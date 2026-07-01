#!/usr/bin/env python3
"""Download curated pack-shot images for staple catalog SKUs.

Primary source: A1 Cash and Carry (a1cashandcarry.com) Shopify CDN.
Fallback: Walmart Canada i5.walmartimages.com full ASR/SEO images.
"""

from __future__ import annotations

import re
import ssl
import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "products" / "staples"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
CTX = ssl.create_default_context()
MAX_WIDTH = 1200
MIN_BYTES = 10_000

# Walmart-only fallbacks (no matching A1 product page).
WALMART_FALLBACKS: dict[str, list[str]] = {
    "lays-chips": [
        "https://i5.walmartimages.com/seo/Lays-Magic-Masala-52gm-6-Pack_7600d150-b77d-457e-9da9-70bcef31bded.b3b2aa4163ef944a7e8137f6b9648f55.jpeg",
        "https://i5.walmartimages.com/asr/e37f4e84-fff6-40c1-98cf-c462e979f446.e1fddc76b8468139a05f79c830a27619f.jpeg",
    ],
    "parle-g-biscuits": [
        "https://i5.walmartimages.com/seo/Parle-G-Gold-Biscuits-1-KG-10-pack-of-100g_45ca1170-fe2e-4f6f-92bf-818c8f2d3c73.680d13d1e5cac5ae7105b0f0b08b7ed9.jpeg",
        "https://i5.walmartimages.com/asr/024fa08f-57b5-4526-b90c-56e7b8aa5e78.7d6a1898516b25aa49218a95a271635e.jpeg",
    ],
    "maggi-noodles": [
        "https://i5.walmartimages.com/asr/3d403be0-a800-4c66-8c07-0907931cdb5f.6a1c622059e0f010b83c1a211b5dc377.jpeg",
    ],
}

# A1 product slugs — pack size must match staple-catalog.ts unit.
A1_SLUGS: dict[str, str] = {
    "aashirvaad-atta-20lb": "aashirvaad-atta-whole-wheat-flour",
    "basmati-rice-10lb": "chandni-chowk-basmati-rice-extra-long",
    "sona-masoori-rice-20lb": "apna-rice-sona-massori",
    "toor-dal-10lb": "toor-daal-split-pigeon-pea-yellow-lentils-daalt110",
    "masoor-dal-10lb": "masoor-daal-wash-red-lentil-split",
    "urad-dal-10lb": "urad-gota-white-1",
    "chana-dal-10lb": "chick-peas-lentils-chana-daal-1",
    "moong-dal-10lb": "moong-daal-wash-yellow-moong-beans",
    "rajma-10lb": "kidney-beans-rajma-whole-1",
    "kabuli-chana-10lb": "chick-peas-white-9mm",
    "besan-2kg": "sher-besan-super-fine",
    "rava-sooji-2kg": "ph-semolina-flour-soojiaata-medium-20kg",
    "turmeric-100g": "apna-turmeric-powder",
    "red-chilli-100g": "mdh-spare-code-4",
    "cumin-100g": "apna-cumin-powder-zeera",
    "coriander-100g": "apna-coriander-powder-2",
    "mdh-masala": "mdh-spare-code-3",
    "nanak-ghee": "nanak-pure-desi-ghee",
    "paneer": "nanak-paneer",
    "dahi": "elegant-dahi-yougart-3-26",
    "indian-pickle": "national-mixed-pickle-large",
    "makhana": "apna-lotus-seeds-phool-makhana",
    "poha": "apna-pressed-rice-thin-poha",
    "red-label-tea": "brooke-bond-red-label-black-tea",
    "mustard-oil-1l": "apna-mustard-oil",
    "sunflower-oil-1l": "the-king-sunflower-oil",
    "salt-1kg": "windsor-salt",
    "sugar-2kg": "redpath-sugar-1",
    "papad": "jeera-papad-swad",
}

ALL_PRODUCT_IDS = list(A1_SLUGS.keys()) + list(WALMART_FALLBACKS.keys())


def fetch(url: str, timeout: int = 60) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as resp:
            return resp.read()
    except Exception as exc:
        print(f"    fetch failed: {exc}")
        return None


def extract_a1_image_from_slug(slug: str) -> str | None:
    """Given an A1 product slug, return the best pack-shot CDN URL."""
    url = f"https://www.a1cashandcarry.com/products/{slug}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except Exception as exc:
        print(f"    A1 scrape failed for {slug}: {exc}")
        return None

    og = re.search(r'property="og:image:secure_url"\s+content="([^"]+)"', html)
    if not og:
        og = re.search(r'property="og:image"\s+content="([^"]+)"', html)
    if og:
        img = og.group(1).split("?")[0]
        if "logo" not in img.lower() and "_600x600" not in img:
            return img

    for match in re.findall(
        r'https://www\.a1cashandcarry\.com/cdn/shop/(?:files|products)/[^"\'\\]+\.(?:jpg|jpeg|png|webp)',
        html,
    ):
        if "logo" not in match.lower() and "_600x600" not in match:
            return match.split("?")[0]

    featured = re.search(r'"featured_image"\s*:\s*"([^"]+)"', html)
    if featured:
        return featured.group(1).replace("\\/", "/").split("?")[0]

    return None


def is_image(data: bytes) -> bool:
    if len(data) < MIN_BYTES:
        return False
    if data[:3] == b"\xff\xd8\xff":
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return True
    return False


def to_jpeg(path: Path, data: bytes) -> bytes:
    if data[:3] == b"\xff\xd8\xff":
        return data
    tmp = path.with_suffix(".tmp")
    tmp.write_bytes(data)
    try:
        subprocess.run(
            ["sips", "-s", "format", "jpeg", str(tmp), "--out", str(path)],
            check=True,
            capture_output=True,
        )
        return path.read_bytes()
    except (subprocess.CalledProcessError, FileNotFoundError):
        try:
            from PIL import Image
            import io

            img = Image.open(io.BytesIO(data)).convert("RGB")
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=90)
            return buf.getvalue()
        except ImportError:
            return data
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)


def resize_if_large(path: Path) -> None:
    try:
        subprocess.run(
            [
                "sips",
                "-Z",
                str(MAX_WIDTH),
                "-s",
                "format",
                "jpeg",
                str(path),
                "--out",
                str(path),
            ],
            check=True,
            capture_output=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        try:
            from PIL import Image

            img = Image.open(path)
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.Resampling.LANCZOS)
                img.convert("RGB").save(path, format="JPEG", quality=90)
        except ImportError:
            pass


def download_product(product_id: str) -> tuple[bool, str]:
    out = OUT / f"{product_id}.jpg"
    candidates: list[str] = []
    used_source = "A1"

    slug = A1_SLUGS.get(product_id)
    if slug:
        print(f"  scraping A1 /products/{slug} ...")
        img = extract_a1_image_from_slug(slug)
        if img:
            candidates.append(img)

    for url in WALMART_FALLBACKS.get(product_id, []):
        if url not in candidates:
            candidates.append(url)
            used_source = "Walmart"

    for url in candidates:
        print(f"  trying {url[:90]}...")
        data = fetch(url)
        if not data or not is_image(data):
            continue
        jpeg = to_jpeg(out, data)
        out.write_bytes(jpeg)
        resize_if_large(out)
        if "a1cashandcarry.com" in url:
            used_source = "A1"
        elif "walmartimages.com" in url:
            used_source = "Walmart"
        print(f"  OK {out.name} ({out.stat().st_size} bytes) [{used_source}]")
        return True, used_source
        time.sleep(0.2)

    print(f"  FAILED {product_id}")
    return False, used_source


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0
    failed: list[str] = []
    sources: dict[str, str] = {}

    for product_id in ALL_PRODUCT_IDS:
        print(f"Downloading {product_id}...")
        success, source = download_product(product_id)
        if success:
            ok += 1
            sources[product_id] = source
        else:
            failed.append(product_id)

    print("\n=== Summary ===")
    print(f"Downloaded: {ok}/{len(ALL_PRODUCT_IDS)}")
    a1_count = sum(1 for s in sources.values() if s == "A1")
    walmart_count = sum(1 for s in sources.values() if s == "Walmart")
    print(f"Sources: A1={a1_count}, Walmart={walmart_count}")
    if failed:
        print(f"Failed: {', '.join(failed)}")

    sizes: dict[int, list[str]] = {}
    for product_id in ALL_PRODUCT_IDS:
        path = OUT / f"{product_id}.jpg"
        if path.exists():
            size = path.stat().st_size
            sizes.setdefault(size, []).append(product_id)
            print(f"  {product_id}.jpg: {size} bytes [{sources.get(product_id, '?')}]")
        else:
            print(f"  {product_id}.jpg: MISSING")

    dupes = {k: v for k, v in sizes.items() if len(v) > 1}
    if dupes:
        print("\nWARNING: identical file sizes (possible duplicate images):")
        for size, ids in dupes.items():
            print(f"  {size} bytes: {', '.join(ids)}")


if __name__ == "__main__":
    main()

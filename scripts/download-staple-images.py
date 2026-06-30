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

# Curated primary URLs — each verified unique and product-appropriate.
# Format: product_id -> (source_label, [url, ...])
PRODUCTS: dict[str, tuple[str, list[str]]] = {
    "aashirvaad-atta-20lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/Flr082.jpg",
        ],
    ),
    "basmati-rice-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/RIC002-01.jpg",
            "https://i5.walmartimages.com/asr/3bb7da89-d7d3-4863-a657-3138df217212.49ceba3589e9663d58d843dc30443c79.jpeg",
        ],
    ),
    "sona-masoori-rice-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/ApnaRice1.jpg",
        ],
    ),
    "toor-dal-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Toor-Daal-Split-Pigeon-Pea-Yellow-Lentils-daalt110-Grocery-No-Brand-Toor-Daal-Split-Pigeon-Pea-Yellow-Lentils-daalt110-Grocery-No-Brand-Toor-Daal-Split-Pigeon-Pea-Yellow-Lentils-daalt.jpg",
            "https://i5.walmartimages.com/asr/f1b93908-3a96-4431-9aba-a8413342c910.69a7e7e4e7c20b48ae72b687c4423aa6.jpeg",
        ],
    ),
    "masoor-dal-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Masoor-Daal-Wash-Red-Lentil-Split-Grocery-No-Brand-Masoor-Daal-Wash-Red-Lentil-Split-Grocery-No-Brand-Masoor-Daal-Wash-Red-Lentil-Split-Grocery-No-Brand-Masoor-Daal-Wash-Red-Lentil-Sp_ec5500a4-540b-40c0-9d5b-2fa267e91c48.jpg",
            "https://i5.walmartimages.com/asr/4dec8d71-ffef-4742-92cd-9f1e6b8dff69.ce01bbaabdb3e37bfe5f7f78d864c10e.jpeg",
        ],
    ),
    "urad-dal-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Urad-Gota-White-Grocery-No-Brand-Urad-Gota-White-Grocery-No-Brand-Urad-Gota-White-Grocery-No-Brand-Urad-Gota-White-Grocery-No-Brand-Urad-Gota-White-Grocery-No-Brand-Urad-Gota-White-Gr_d0550e41-0f88-4f4a-bea8-d7b660830f30.jpg",
            "https://i5.walmartimages.com/asr/cabb5180-3fe0-490c-af04-274fb500f3e8.e8716d46d5ff3681b0c3cd5dc0315a3b.jpeg",
        ],
    ),
    "chana-dal-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Chick-Peas-Lentils-Chana-Daal-Grocery-No-Brand-Chick-Peas-Lentils-Chana-Daal-Grocery-No-Brand-Chick-Peas-Lentils-Chana-Daal-Grocery-No-Brand-Chick-Peas-Lentils-Chana-Daal-Grocery-No-B_ca7d7eec-cddb-4f0c-b7e8-fd36bc89389d.jpg",
            "https://i5.walmartimages.com/asr/aac5632d-943c-40bb-abca-9c893e1bb48e.cfede4bfbad8e67f51f270cad7d23e12.jpeg",
        ],
    ),
    "moong-dal-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Moong-Daal-Wash-Yellow-Moong-Beans-Grocery-No-Brand-Moong-Daal-Wash-Yellow-Moong-Beans-Grocery-No-Brand-Moong-Daal-Wash-Yellow-Moong-Beans-Grocery-No-Brand-Moong-Daal-Wash-Yellow-Moon_a27ffc7e-5222-4fd3-a3be-ada8817cfb8d.jpg",
            "https://i5.walmartimages.com/asr/0e553400-60fb-4961-8d38-c4b48cc92628.ec353baafe12028aac042ee0c0b5a8fc.jpeg",
        ],
    ),
    "rajma-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Kidney-Beans-Rajma-Whole-Grocery-No-Brand-Kidney-Beans-Rajma-Whole-Grocery-No-Brand-Kidney-Beans-Rajma-Whole-Grocery-No-Brand-Kidney-Beans-Rajma-Whole-Grocery-No-Brand-Kidney-Beans-Ra.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/files/LEN102.jpg",
        ],
    ),
    "kabuli-chana-10lb": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/closeup-chickpeas-legumes.jpg",
            "https://i5.walmartimages.com/asr/7a7658a0-cd6f-4671-b271-341e564bbf8e.a5ea80f9ff1cd85c3f60dcacb7a81004.jpeg",
        ],
    ),
    "besan-2kg": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Brar-Besan-Fine-Grocery-Brar-Brar-Besan-Fine-Grocery-Brar-Brar-Besan-Fine-Grocery-Brar-Brar-Besan-Fine-Grocery-Brar-Brar-Besan-Fine-Grocery-Brar-Brar-Besan-Fine-Grocery-Brar-Brar-Besa_d0aafa44-cd82-4c49-8f8f-53c644c3c5b8.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/files/Untitleddesign_3e1445bc-f248-4190-adce-8f74b92c26ad.jpg",
        ],
    ),
    "rava-sooji-2kg": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/Untitleddesign_8301e40f-8763-46e2-9411-3465fa2584a3.jpg",
            "https://i5.walmartimages.com/asr/27e8aae5-170a-472e-ac98-6cdc69d21bea.79f6cd7f2e26017cdcfaaa6e02ab1d25.jpeg",
        ],
    ),
    "turmeric-100g": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/SPA062.jpg",
        ],
    ),
    "red-chilli-100g": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/SPA012.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/files/ChilliExtraHot.jpg",
        ],
    ),
    "cumin-100g": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/Cumin.jpg",
        ],
    ),
    "coriander-100g": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/CorianderGround.jpg",
        ],
    ),
    "mdh-masala": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/2_0550c3bb-50ed-4ffb-8dae-40bfddfec614.jpg",
            "https://i5.walmartimages.com/asr/0982ec8e-7963-4373-902d-bc5d7048e9f4.f72e1607ac473c1ad5639e2fa7f713bc.jpeg",
        ],
    ),
    "nanak-ghee": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/3_0eb9d4ba-c388-41d0-9f34-4f3d00a1a071.jpg",
            "https://i5.walmartimages.com/asr/542948fa-444c-42c4-9c5c-cb9e72eda2a3.07be8d8ecfa2231e5ce533c29a1575ee.jpeg",
        ],
    ),
    "paneer": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Nanak-Paneer-Dairy-Nanak-Nanak-Paneer-Dairy-Nanak-Nanak-Paneer-Dairy-Nanak-nanak-paneer-dairy-nanak-dai028_f.jpg",
        ],
    ),
    "dahi": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/2_03967b01-c13a-4faa-98f2-ce2caeae584a.jpg",
        ],
    ),
    "indian-pickle": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/Mixed-Pickle-2.27-KG-Jar-Canada_55001121.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/files/IMG_1929.jpg",
        ],
    ),
    "makhana": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/PhoolMakhana.jpg",
        ],
    ),
    "poha": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Apna-Pressed-Rice-Thin-Poha-Grocery-Apna-Apna-Pressed-Rice-Thin-Poha-Grocery-Apna-Apna-Pressed-Rice-Thin-Poha-Grocery-Apna-Apna-Pressed-Rice-Thin-Poha-Grocery-Apna-RIC016_F.jpg",
        ],
    ),
    "red-label-tea": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/IMG_3471.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/products/TEA004_A.jpg",
            "https://i5.walmartimages.com/asr/6ae08746-c502-4582-a1bf-34c165b5aa99.dc7ccdf0fd8984b3c3c688a13b2aaaf2.jpeg",
        ],
    ),
    "maggi-noodles": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/PAS002_A_copy.jpg",
            "https://i5.walmartimages.com/asr/3d403be0-a800-4c66-8c07-0907931cdb5f.6a1c622059e0f010b83c1a211b5dc377.jpeg",
        ],
    ),
    "mustard-oil-1l": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Oil121_y.jpg",
            "https://i5.walmartimages.com/asr/844dbd3d-836c-4edf-9915-769b57920f7b.f04cf4ee7f7d8e46d909fae46c77691e.jpeg",
        ],
    ),
    "sunflower-oil-1l": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/2_8bc22e01-8f26-4287-a0fb-a3db7d0b1d37.jpg",
            "https://www.a1cashandcarry.com/cdn/shop/files/IMG_2745.jpg",
        ],
    ),
    "salt-2kg": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Windsor-Salt-Grocery-Windsor-Windsor-Salt-Grocery-Windsor-Windsor-Salt-Grocery-Windsor-Windsor-Salt-Grocery-Windsor-Windsor-Salt-Grocery-Windsor-Windsor-Salt-Grocery-Windsor-Windsor-S.jpg",
            "https://i5.walmartimages.com/asr/7284a97b-93d2-431a-86ba-d7915df96a59.4c0080f2e6b583641fb96f1f756cd9ad.jpeg",
        ],
    ),
    "sugar-2kg": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/files/22_cc781628-ca48-413f-9067-e4e8704bd80b.jpg",
            "https://i5.walmartimages.com/asr/6a2ac174-52a4-42f8-afd2-ef15ab3249e1.84b72fdd5513077d07cbf82ec9c47271.jpeg",
        ],
    ),
    "lays-chips": (
        "Walmart",
        [
            "https://i5.walmartimages.com/seo/Lays-Magic-Masala-52gm-6-Pack_7600d150-b77d-457e-9da9-70bcef31bded.b3b2aa4163ef944a7e8137f6b9648f55.jpeg",
            "https://i5.walmartimages.com/asr/e37f4e84-fff6-40c1-98cf-c462e979f446.e1fddc76b8468139a05f79c83027619f.jpeg",
        ],
    ),
    "papad": (
        "A1",
        [
            "https://www.a1cashandcarry.com/cdn/shop/products/Jeera-Papad-Swad-Grocery-Lijjat-Jeera-Papad-Swad-Grocery-Lijjat-Jeera-Papad-Swad-Grocery-Lijjat-Jeera-Papad-Swad-Grocery-Lijjat-Jeera-Papad-Swad-Grocery-Lijjat-Jeera-Papad-Swad-Grocer_1235bad6-26af-42bc-afa3-43f486c03775.jpg",
            "https://i5.walmartimages.com/asr/0651ca33-a411-4316-bf99-a7be4c526d5a.c57ba2175c473db82206a9dbb4dd2742.jpeg",
        ],
    ),
    "parle-g-biscuits": (
        "Walmart",
        [
            "https://i5.walmartimages.com/seo/Parle-G-Gold-Biscuits-1-KG-10-pack-of-100g_45ca1170-fe2e-4f6f-92bf-818c8f2d3c73.680d13d1e5cac5ae7105b0f0b08b7ed9.jpeg",
            "https://i5.walmartimages.com/asr/024fa08f-57b5-4526-b90c-56e7b8aa5e78.7d6a1898516b25aa49218a95a271635e.jpeg",
        ],
    ),
}

# A1 product slugs for dynamic lookup (optional CLI use).
A1_SLUGS: dict[str, str] = {
    "aashirvaad-atta-20lb": "aashirvaad-atta-whole-wheat-flour",
    "basmati-rice-10lb": "apna-basmati-rice-extra-long-blue-bag-1121",
    "sona-masoori-rice-10lb": "apna-rice-sona-massori",
    "toor-dal-10lb": "toor-daal-split-pigeon-pea-yellow-lentils-daalt110",
    "masoor-dal-10lb": "masoor-daal-wash-red-lentil-split",
    "urad-dal-10lb": "urad-gota-white-1",
    "chana-dal-10lb": "chick-peas-lentils-chana-daal",
    "moong-dal-10lb": "moong-daal-wash-yellow-moong-beans",
    "rajma-10lb": "kidney-beans-rajma-whole-1",
    "kabuli-chana-10lb": "chick-peas-white-9mm-55-lb",
    "besan-2kg": "brars-besan-fine",
    "rava-sooji-2kg": "xxx-cavalier-flour-ubl-fl-ca20",
    "turmeric-100g": "apna-turmeric",
    "red-chilli-100g": "apna-chilli-powder",
    "cumin-100g": "apna-cumin-zeera-powder",
    "coriander-100g": "apna-coriander-powder",
    "mdh-masala": "mdh-spare-code-3",
    "nanak-ghee": "nanak-pure-desi-ghee",
    "paneer": "nanak-paneer",
    "dahi": "so-elegant-dahi-yogurt-3-25",
    "indian-pickle": "national-mixed-pickle-large",
    "makhana": "apna-lotus-seeds-phool-makhana",
    "poha": "apna-pressed-rice-thin-poha",
    "red-label-tea": "brooke-bond-red-label-black-tea",
    "maggi-noodles": "maggi-noodles-spicy-masala",
    "mustard-oil-1l": "gc-mustard-oil",
    "sunflower-oil-1l": "esma-sunflower-oil",
    "salt-2kg": "windsor-salt",
    "sugar-2kg": "redpath-sugar-1",
    "papad": "jeera-papad-swad",
}


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
    source, candidates = PRODUCTS[product_id]
    out = OUT / f"{product_id}.jpg"
    used_source = source

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

    for product_id in PRODUCTS:
        print(f"Downloading {product_id}...")
        success, source = download_product(product_id)
        if success:
            ok += 1
            sources[product_id] = source
        else:
            failed.append(product_id)

    print("\n=== Summary ===")
    print(f"Downloaded: {ok}/{len(PRODUCTS)}")
    a1_count = sum(1 for s in sources.values() if s == "A1")
    walmart_count = sum(1 for s in sources.values() if s == "Walmart")
    print(f"Sources: A1={a1_count}, Walmart={walmart_count}")
    if failed:
        print(f"Failed: {', '.join(failed)}")

    sizes: dict[int, list[str]] = {}
    for product_id in PRODUCTS:
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

#!/usr/bin/env python3
"""Download real pack-shot images for staple catalog SKUs."""

from __future__ import annotations

import json
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "products" / "staples"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
CTX = ssl.create_default_context()

# Primary URLs: Walmart i5.walmartimages.com, brand CDNs, Open Food Facts
URLS: dict[str, list[str]] = {
    "aashirvaad-atta-20lb": [
        "https://i5.walmartimages.com/asr/45ece694-be11-470f-8858-e679fb3550b4.d2be918855eaf3bb76d7c5206c2b1104.jpeg",
    ],
    "basmati-rice-10lb": [
        "https://images.openfoodfacts.org/images/products/069/022/510/1103/front_en.full.jpg",
        "https://i5.walmartimages.com/seo/India-Gate-Basmati-Rice-Classic-10-lb-White_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
    ],
    "sona-masoori-rice-10lb": [
        "https://i5.walmartimages.com/asr/be7b6fa8-580b-4ba8-8ac5-1c1ef1cd3c5c.a31ac5130eb737a9de66781688b35fe7.jpeg",
        "https://i5.walmartimages.com/seo/Laxmi-Sona-Masoori-Rice-10-Pound-LB_8fcc3b17-67de-4572-8f49-6293ec6657b3.7e62bcd2cd77b1c1316f2f34fc672ad7.jpeg",
    ],
    "toor-dal-10lb": [
        "https://i5.walmartimages.com/seo/Rani-Toor-Dal-Split-Pigeon-Peas-64oz-4lbs-1-81kg-All-Natural-Gluten-Friendly-NON-GMO-Kosher-Vegan-Indian-Origin_8eea8857-0670-4868-5169-4bcb.faffb56cbfda4d834.jpeg",
        "https://images.openfoodfacts.org/images/products/081/052/403/0007/front_en.full.jpg",
    ],
    "masoor-dal-10lb": [
        "https://i5.walmartimages.com/seo/Rani-Masoor-Dal-Indian-Red-Lentils-Split-Gram-64oz-4lbs-1-81kg-All-Natural-Gluten-Friendly-NON-GMO-Kosher-Vegan-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
        "https://images.openfoodfacts.org/images/products/501/353/162/0864/front_en.full.jpg",
    ],
    "urad-dal-10lb": [
        "https://i5.walmartimages.com/seo/Rani-Urid-Urad-Gota-White-Matpe-Beans-Skinless-Indian-Lentils-32oz-2lbs-908g-Natural-Gluten-Friendly-NON-GMO-Kosher-Vegan-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
        "https://images.openfoodfacts.org/images/products/890/290/102/7280/front_en.full.jpg",
    ],
    "chana-dal-10lb": [
        "https://i5.walmartimages.com/seo/Rani-Chana-Dal-Split-Desi-Chickpeas-without-skin-14oz-400g-All-Natural-Gluten-Friendly-NON-GMO-Kosher-Vegan-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
        "https://images.openfoodfacts.org/images/products/890/600/881/5184/front_en.full.jpg",
    ],
    "moong-dal-10lb": [
        "https://i5.walmartimages.com/seo/Organic-Mung-Dal-4-Pounds-Non-GMO-Vegan-Raw-by-Food-to-Live_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
        "https://images.openfoodfacts.org/images/products/890/290/102/7280/front_en.full.jpg",
    ],
    "rajma-10lb": [
        "https://i5.walmartimages.com/seo/Light-Red-Kidney-Beans-Grown-in-Washington-18-lbs-Non-GMO-Kosher-Vegan-Non-Irradiated_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
        "https://images.openfoodfacts.org/images/products/501/353/162/0864/front_en.full.jpg",
    ],
    "kabuli-chana-10lb": [
        "https://images.openfoodfacts.org/images/products/890/600/881/5184/front_en.full.jpg",
    ],
    "besan-2kg": [
        "https://i5.walmartimages.com/seo/Rani-Ladoo-Besan-Coarse-Gram-Glour-32oz-2lbs-908g-All-Natural-Vegan-Gluten-Friendly-NON-GMO-Kosher-Indian-Origin_4d52f5b5-1c35-4568-9e04-9d7c7702eba9.aa07f498bbe76081a148096c0ab89f0f.jpeg",
        "https://i5.walmartimages.com/seo/Laxmi-Gram-Besan-Flour-2lb_cecc4be4-e5f4-498d-8b54-37626b9c7d3c.f8ecc1115ed4038038336.jpeg",
    ],
    "rava-sooji-2kg": [
        "https://i5.walmartimages.com/seo/Rani-Sooji-Coarse-Farina-Suji-Rava-Rawa-Wheat-Semolina-Flour-64oz-4lbs-1-81kg-Bulk-All-Natural-Vegan-NON-GMO-Kosher-Indian-Origin_cc5af88c-44d5-44a6-ae20-b52e90d28aaf.2423d28d975de898d65cf967a385f360.jpeg",
    ],
    "turmeric-100g": [
        "https://images.openfoodfacts.org/images/products/316/629/655/5338/front_fr.full.jpg",
        "https://i5.walmartimages.com/seo/Rani-Turmeric-Haldi-Ground-Powder-7oz-200g-PET-Jar-All-Natural-Salt-Free-Vegan-Gluten-Friendly-NON-GMO-Kosher-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
    ],
    "red-chilli-100g": [
        "https://images.openfoodfacts.org/images/products/890/178/639/0151/front_en.full.jpg",
    ],
    "cumin-100g": [
        "https://images.openfoodfacts.org/images/products/501/768/900/3142/front_en.full.jpg",
        "https://i5.walmartimages.com/seo/Rani-Cumin-Jeera-Ground-Powder-7oz-200g-PET-Jar-All-Natural-Salt-Free-Vegan-Gluten-Friendly-NON-GMO-Kosher-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
    ],
    "coriander-100g": [
        "https://images.openfoodfacts.org/images/products/501/768/900/3142/front_en.full.jpg",
    ],
    "mdh-masala": [
        "https://images.openfoodfacts.org/images/products/890/216/700/0782/front_en.full.jpg",
    ],
    "nanak-ghee": [
        "https://static1.squarespace.com/static/62df38bd768870226dced4a0/62ecd969d0402a7f85047496/63193ccfbf2ae46e55b430a1/1769468610969/Ghee.jpg",
        "https://i5.walmartimages.com/seo/Nanak-Ghee-14oz_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
    ],
    "paneer": [
        "https://static1.squarespace.com/static/62df38bd768870226dced4a0/62ecd969d0402a7f85047496/635854930ea08d3898168466/1769462160098/Front_new.png",
    ],
    "dahi": [
        "https://images.openfoodfacts.org/images/products/073/542/693/0012/front_en.full.jpg",
    ],
    "indian-pickle": [
        "https://i5.walmartimages.com/seo/Rani-Major-Grey-Mango-Chutney-Indian-Preserve-12-3oz-350g-Glass-Jar-Ready-to-eat-Vegan-Gluten-Free-All-Natural-NON-GMO-Kosher-Product-of-India_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg",
        "https://images.openfoodfacts.org/images/products/890/103/088/2548/front_en.full.jpg",
    ],
    "makhana": [
        "https://i5.walmartimages.com/seo/Rani-Jumbo-Phool-Makhana-Fox-Nut-Popped-Lotus-Seed-Plain-Raw-Uncooked-3-5oz-100g-Natural-Vegan-Colors-Gluten-Friendly-NON-GMO-Indian-Origin_115f4d93-8c6a-4b40-bd98-4c01b71262d8.88301fbddab483bebe2c82e9abf23f39.jpeg",
    ],
    "poha": [
        "https://images.openfoodfacts.org/images/products/890/336/300/2853/front_en.full.jpg",
    ],
    "red-label-tea": [
        "https://images.openfoodfacts.org/images/products/890/103/088/2548/front_en.full.jpg",
        "https://i5.walmartimages.com/seo/Brooke-Bond-Red-Label-Natural-Care-Tea-900g_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
    ],
    "maggi-noodles": [
        "https://images.openfoodfacts.org/images/products/890/105/800/0306/front_en.full.jpg",
        "https://i5.walmartimages.com/seo/Maggi-Noodles-2-minutes-Masala-Noodles-70g-Pack-of-48_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
    ],
    "mustard-oil-1l": [
        "https://i5.walmartimages.com/asr/1823589d-4090-4793-8014-8c83ec0e1a93.7c371b8111b4cf71aba55d6b77d660a4.jpeg",
        "https://images.openfoodfacts.org/images/products/890/600/728/0969/front_en.full.jpg",
    ],
    "sunflower-oil-1l": [
        "https://i5.walmartimages.com/asr/77f24862-8feb-43eb-9b7e-2c8069f7f604.dfcfed72bf3fffe462cd43d0a4b79fc7.jpeg",
        "https://i5.walmartimages.com/seo/Dabur-Cold-Pressed-Mustard-Oil-1L-Healthy-Cooking-Oil-Goodness-of-Omega-3-6-Perfect-blend-of-Health-Taste-Aroma_716c76d2-c2e2-4737-882b-6e768f3b6603.6f830238aaa54524256d35de7ea50bdd.jpeg",
    ],
    "salt-2kg": [
        "https://i5.walmartimages.com/seo/Great-Value-Iodized-Salt-26-oz_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
        "https://images.openfoodfacts.org/images/products/316/629/655/5338/front_fr.full.jpg",
    ],
    "sugar-2kg": [
        "https://i5.walmartimages.com/seo/Great-Value-Pure-Granulated-Sugar-4-lb_82266cda-deb5-44cd-847a-35b12b24c509.09bcd239f74cfd18291352d0771f236f.jpeg",
    ],
    "lays-chips": [
        "https://i5.walmartimages.com/seo/Lays-Magic-Masala-52gm-6-Pack_7600d150-b77d-457e-9da9-70bcef31bded.b3b2aa4163ef944a7e8137f6b9648f55.jpeg",
        "https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.full.jpg",
    ],
    "papad": [
        "https://i5.walmartimages.com/seo/Lijjat-Punjabi-Masala-Papad-200g_d7fb59cb-a12a-4374-a180-5901126f2013.228f72a9df52b01f9b78e82f3f63df10.jpeg",
        "https://images.openfoodfacts.org/images/products/005/117/921/4309/front_en.full.jpg",
    ],
    "parle-g-biscuits": [
        "https://i5.walmartimages.com/seo/Parle-G-Gold-Biscuits-1-KG-10-pack-of-100g_45ca1170-fe2e-4f6f-92bf-818c8f2d3c73.680d13d1e5cac5ae7105b0f0b08b7ed9.jpeg",
        "https://images.openfoodfacts.org/images/products/890/105/800/0306/front_en.full.jpg",
    ],
}

OFF_SEARCH: dict[str, str] = {
    "basmati-rice-10lb": "India Gate basmati rice",
    "sona-masoori-rice-10lb": "sona masoori rice",
    "toor-dal-10lb": "toor dal split pigeon peas",
    "masoor-dal-10lb": "masoor dal red lentils",
    "urad-dal-10lb": "urad dal",
    "chana-dal-10lb": "chana dal split chickpeas",
    "moong-dal-10lb": "moong dal split mung",
    "rajma-10lb": "rajma kidney beans",
    "kabuli-chana-10lb": "kabuli chana chickpeas",
    "besan-2kg": "besan gram flour",
    "rava-sooji-2kg": "sooji rava semolina",
    "turmeric-100g": "turmeric powder haldi",
    "red-chilli-100g": "red chilli powder",
    "cumin-100g": "cumin powder jeera",
    "coriander-100g": "coriander powder dhania",
    "mdh-masala": "MDH garam masala",
    "nanak-ghee": "Nanak ghee",
    "paneer": "Nanak paneer",
    "dahi": "Indian yogurt dahi",
    "indian-pickle": "mixed pickle achar",
    "makhana": "makhana fox nuts",
    "poha": "poha flattened rice",
    "red-label-tea": "Brooke Bond Red Label tea",
    "maggi-noodles": "Maggi masala noodles",
    "mustard-oil-1l": "mustard oil kachi ghani",
    "sunflower-oil-1l": "sunflower oil refined",
    "salt-2kg": "iodized salt",
    "sugar-2kg": "granulated sugar",
    "lays-chips": "Lays potato chips",
    "papad": "urad papad",
    "parle-g-biscuits": "Parle-G glucose biscuits",
}


def fetch(url: str, timeout: int = 60) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as resp:
            return resp.read()
    except Exception as exc:
        print(f"    fetch failed: {exc}")
        return None


def search_off(query: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "search_terms": query,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": 3,
        }
    )
    url = f"https://world.openfoodfacts.org/cgi/search.pl?{params}"
    try:
        with urllib.request.urlopen(url, context=CTX, timeout=25) as resp:
            data = json.load(resp)
        for product in data.get("products", []):
            img = product.get("image_front_url") or product.get("image_url")
            if img:
                return img.replace(".400.", ".full.")
    except Exception as exc:
        print(f"    OFF search failed: {exc}")
    return None


def is_image(data: bytes) -> bool:
    if len(data) < 3000:
        return False
    if data[:3] == b"\xff\xd8\xff":
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return True
    return False


def download_product(product_id: str) -> bool:
    out = OUT / f"{product_id}.jpg"
    candidates = list(URLS.get(product_id, []))
    if product_id in OFF_SEARCH:
        off_url = search_off(OFF_SEARCH[product_id])
        if off_url and off_url not in candidates:
            candidates.append(off_url)
        time.sleep(0.5)

    for url in candidates:
        print(f"  trying {url[:80]}...")
        data = fetch(url)
        if data and is_image(data):
            out.write_bytes(data)
            print(f"  OK {out.name} ({len(data)} bytes)")
            return True

    print(f"  FAILED {product_id}")
    return False


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = 0
    failed: list[str] = []
    for product_id in URLS:
        print(f"Downloading {product_id}...")
        if download_product(product_id):
            ok += 1
        else:
            failed.append(product_id)

    print("\n=== Summary ===")
    print(f"Downloaded: {ok}/{len(URLS)}")
    if failed:
        print(f"Failed: {', '.join(failed)}")
    for product_id in URLS:
        path = OUT / f"{product_id}.jpg"
        status = f"{path.stat().st_size} bytes" if path.exists() else "MISSING"
        print(f"  {product_id}.jpg: {status}")


if __name__ == "__main__":
    main()

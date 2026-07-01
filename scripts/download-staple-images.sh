#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../public/products/staples" && pwd)"
mkdir -p "$DIR"
cd "$DIR"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

download() {
  local id="$1"
  local url="$2"
  local out="${id}.jpg"
  echo "Downloading ${id}..."
  if curl -fsSL -A "$UA" --connect-timeout 20 --max-time 90 -o "$out" "$url"; then
    local size
    size=$(wc -c < "$out" | tr -d ' ')
    if [ "$size" -lt 3000 ]; then
      echo "  FAIL: ${id} too small (${size} bytes)"
      rm -f "$out"
      return 1
    fi
    echo "  OK: ${out} (${size} bytes)"
    return 0
  else
    echo "  FAIL: ${id} curl error"
    rm -f "$out"
    return 1
  fi
}

# id|url — Walmart i5.walmartimages.com, brand CDNs, Open Food Facts
while IFS='|' read -r id url; do
  [[ "$id" =~ ^#.*$ || -z "$id" ]] && continue
  download "$id" "$url" || true
done <<'URLS'
aashirvaad-atta-20lb|https://i5.walmartimages.com/asr/45ece694-be11-470f-8858-e679fb3550b4.d2be918855eaf3bb76d7c5206c2b1104.jpeg
basmati-rice-10lb|https://spiceboxgrocery.com/cdn/shop/files/Royal_basmati_10lb_1024x.png
sona-masoori-rice-10lb|https://i5.walmartimages.com/asr/be7b6fa8-580b-4ba8-8ac5-1c1ef1cd3c5c.a31ac5130eb737a9de66781688b35fe7.jpeg
toor-dal-10lb|https://images.openfoodfacts.org/images/products/081/052/403/0007/front_en.full.jpg
masoor-dal-10lb|https://images.openfoodfacts.org/images/products/501/353/162/0864/front_en.full.jpg
urad-dal-10lb|https://i5.walmartimages.com/seo/Rani-Urid-Urad-Gota-White-Matpe-Beans-Skinless-Indian-Lentils-32oz-2lbs-908g-Natural-Gluten-Friendly-NON-GMO-Kosher-Vegan-Indian-Origin_0d236394-50e9-4239-9729-30995dcfafa0.e53a6ea01e6da73c4832cde2808d21d8.jpeg
chana-dal-10lb|https://images.openfoodfacts.org/images/products/890/600/881/5184/front_en.full.jpg
moong-dal-10lb|https://images.openfoodfacts.org/images/products/890/290/102/7280/front_en.full.jpg
rajma-10lb|https://images.openfoodfacts.org/images/products/890/600/881/5184/front_en.full.jpg
kabuli-chana-10lb|https://images.openfoodfacts.org/images/products/890/600/881/5184/front_en.full.jpg
besan-2kg|https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.full.jpg
rava-sooji-2kg|https://images.openfoodfacts.org/images/products/890/336/300/2853/front_en.full.jpg
turmeric-100g|https://images.openfoodfacts.org/images/products/316/629/655/5338/front_fr.full.jpg
red-chilli-100g|https://images.openfoodfacts.org/images/products/890/178/639/0151/front_en.full.jpg
cumin-100g|https://images.openfoodfacts.org/images/products/501/768/900/3142/front_en.full.jpg
coriander-100g|https://images.openfoodfacts.org/images/products/501/768/900/3142/front_en.full.jpg
mdh-masala|https://images.openfoodfacts.org/images/products/890/216/700/0782/front_en.full.jpg
nanak-ghee|https://static1.squarespace.com/static/62df38bd768870226dced4a0/62ecd969d0402a7f85047496/63193ccfbf2ae46e55b430a1/1769468610969/Ghee.jpg
paneer|https://static1.squarespace.com/static/62df38bd768870226dced4a0/62ecd969d0402a7f85047496/635854930ea08d3898168466/1769462160098/Front_new.png
dahi|https://images.openfoodfacts.org/images/products/073/542/693/0012/front_en.full.jpg
indian-pickle|https://images.openfoodfacts.org/images/products/890/103/088/2548/front_en.full.jpg
makhana|https://images.openfoodfacts.org/images/products/890/105/800/0306/front_en.full.jpg
poha|https://images.openfoodfacts.org/images/products/890/336/300/2853/front_en.full.jpg
red-label-tea|https://images.openfoodfacts.org/images/products/890/103/088/2548/front_en.full.jpg
maggi-noodles|https://images.openfoodfacts.org/images/products/890/105/800/0306/front_en.full.jpg
mustard-oil-1l|https://i5.walmartimages.com/asr/1823589d-4090-4793-8014-8c83ec0e1a93.7c371b8111b4cf71aba55d6b77d660a4.jpeg
sunflower-oil-1l|https://i5.walmartimages.com/asr/77f24862-8feb-43eb-9b7e-2c8069f7f604.dfcfed72bf3fffe462cd43d0a4b79fc7.jpeg
salt-2kg|https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.full.jpg
sugar-2kg|https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.full.jpg
lays-chips|https://i5.walmartimages.com/seo/Lays-Magic-Masala-52gm-6-Pack_7600d150-b77d-457e-9da9-70bcef31bded.b3b2aa4163ef944a7e8137f6b9648f55.jpeg
papad|https://images.openfoodfacts.org/images/products/005/117/921/4309/front_en.full.jpg
parle-g-biscuits|https://images.openfoodfacts.org/images/products/890/105/800/0306/front_en.full.jpg
URLS

echo ""
echo "=== Verification ==="
missing=0
for id in aashirvaad-atta-20lb basmati-rice-10lb sona-masoori-rice-10lb toor-dal-10lb masoor-dal-10lb urad-dal-10lb chana-dal-10lb moong-dal-10lb rajma-10lb kabuli-chana-10lb besan-2kg rava-sooji-2kg turmeric-100g red-chilli-100g cumin-100g coriander-100g mdh-masala nanak-ghee paneer dahi indian-pickle makhana poha red-label-tea maggi-noodles mustard-oil-1l sunflower-oil-1l salt-2kg sugar-2kg lays-chips papad parle-g-biscuits; do
  if [ -f "${id}.jpg" ]; then
    echo "OK  ${id}.jpg ($(wc -c < "${id}.jpg" | tr -d ' ') bytes)"
  else
    echo "MISSING ${id}"
    missing=$((missing + 1))
  fi
done
echo "Missing: $missing"

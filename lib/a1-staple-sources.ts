/**
 * A1 Cash and Carry product slugs aligned to listed pack sizes.
 * Images are scraped from the matching product page (og:image).
 */
export type A1StapleSource = {
  slug?: string;
  unit: string;
  notes?: string;
};

export const A1_STAPLE_SOURCES: Record<string, A1StapleSource> = {
  "aashirvaad-atta-20lb": {
    slug: "aashirvaad-atta-whole-wheat-flour",
    unit: "20 lb",
    notes: "A1 FLR082 — case 2×20 lb $30.79 ($15.395/bag); each $16.79 walk-in",
  },
  "basmati-rice-10lb": {
    unit: "10 lb",
    notes: "Royal Basmati — Everest Traders $13.50/10 lb (not on A1 walk-in)",
  },
  "sona-masoori-rice-20lb": {
    slug: "apna-rice-sona-massori",
    unit: "20 lb",
    notes: "Apna sona masoori — A1 $24.19/20 lb",
  },
  "toor-dal-10lb": { slug: "toor-daal-split-pigeon-pea-yellow-lentils-daalt110", unit: "10 lb" },
  "masoor-dal-10lb": { slug: "masoor-daal-wash-red-lentil-split", unit: "10 lb" },
  "urad-dal-10lb": { slug: "urad-gota-white-1", unit: "10 lb" },
  "chana-dal-10lb": { slug: "chick-peas-lentils-chana-daal-1", unit: "10 lb" },
  "moong-dal-10lb": { slug: "moong-daal-wash-yellow-moong-beans", unit: "10 lb" },
  "rajma-10lb": { slug: "kidney-beans-rajma-whole-1", unit: "10 lb" },
  "kabuli-chana-10lb": { slug: "chick-peas-white-9mm", unit: "10 lb" },
  "besan-2kg": {
    slug: "sher-besan-super-fine",
    unit: "2 kg",
    notes: "Everest Bambino 2 kg; A1 ref Sher 4 lb @ $6.29 scaled",
  },
  "rava-sooji-2kg": {
    slug: "ph-semolina-flour-soojiaata-medium-20kg",
    unit: "2 kg",
    notes: "Everest Bambino 2 kg; A1 ref P&H 20 kg @ $26.49 scaled",
  },
  "turmeric-100g": {
    slug: "apna-turmeric-powder",
    unit: "400 g",
    notes: "Apna haldi — MDH plain turmeric not on A1",
  },
  "red-chilli-100g": {
    slug: "mdh-spare-code-4",
    unit: "100 g",
    notes: "MDH Deggi Mirch; A1 $23.79/case × 10",
  },
  "cumin-100g": {
    slug: "apna-cumin-powder-zeera",
    unit: "400 g",
    notes: "Apna jeera — MDH plain cumin not on A1",
  },
  "coriander-100g": {
    slug: "apna-coriander-powder-2",
    unit: "400 g",
    notes: "Apna dhania — MDH plain coriander not on A1",
  },
  "mdh-masala": { slug: "mdh-spare-code-3", unit: "100 g", notes: "MDH Kitchen King; A1 $21.49/case × 10" },
  "nanak-ghee": {
    slug: "nanak-pure-desi-ghee",
    unit: "1.6 kg",
    notes: "Nanak Pure Desi Ghee 1.6 kg — $26.74 cost × 1.2 retail",
  },
  "paneer": {
    slug: "apna-malai-paneer-retail-pack",
    unit: "300 g",
    notes: "Apna malai paneer retail pack — A1 $4.99/300 g (min walk-in)",
  },
  "dahi": { slug: "elegant-dahi-yougart-3-26", unit: "1.8 kg", notes: "Elegant retail tub" },
  "indian-pickle": {
    slug: "deep-pickle-hot-mango",
    unit: "700 g",
    notes: "Deep Hot Mango; A1 $51.49/case × 12",
  },
  "makhana": { slug: "apna-lotus-seeds-phool-makhana", unit: "2 lb" },
  "poha": { slug: "apna-pressed-rice-thin-poha", unit: "4 lb" },
  "red-label-tea": { slug: "brooke-bond-red-label-black-tea", unit: "900 g" },
  "maggi-noodles": {
    unit: "280 g",
    notes: "Everest Jan 2026: $40/case × 24×280 g; Walmart image (A1 only has 70 g singles)",
  },
  "mustard-oil-1l": { slug: "apna-mustard-oil", unit: "1 L" },
  "sunflower-oil-1l": { slug: "the-king-sunflower-oil", unit: "3 L", notes: "Closest A1 retail size" },
  "salt-1kg": { slug: "windsor-salt", unit: "1 kg", notes: "Windsor iodised salt @ $1.79" },
  "sugar-2kg": { slug: "redpath-sugar-1", unit: "2 kg" },
  "papad": { slug: "jeera-papad-swad", unit: "200 g" },
};

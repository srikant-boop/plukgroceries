/**
 * A1 Cash and Carry product slugs aligned to listed pack sizes.
 * Images are scraped from the matching product page (og:image).
 */
export type A1StapleSource = {
  slug: string;
  unit: string;
  notes?: string;
};

export const A1_STAPLE_SOURCES: Record<string, A1StapleSource> = {
  "aashirvaad-atta-20lb": { slug: "aashirvaad-atta-whole-wheat-flour", unit: "20 lb" },
  "basmati-rice-10lb": {
    slug: "chandni-chowk-basmati-rice-extra-long",
    unit: "10 lb",
    notes: "Chandni Chowk extra-long basmati; Everest Royal 10 lb pricing",
  },
  "sona-masoori-rice-10lb": {
    slug: "apna-rice-sona-massori",
    unit: "20 lb",
    notes: "A1 only stocks 20 lb Apna sona masoori",
  },
  "toor-dal-10lb": { slug: "toor-daal-split-pigeon-pea-yellow-lentils-daalt110", unit: "10 lb" },
  "masoor-dal-10lb": { slug: "masoor-daal-wash-red-lentil-split", unit: "10 lb" },
  "urad-dal-10lb": { slug: "urad-gota-white-1", unit: "10 lb" },
  "chana-dal-10lb": { slug: "chick-peas-lentils-chana-daal-1", unit: "10 lb" },
  "moong-dal-10lb": { slug: "moong-daal-wash-yellow-moong-beans", unit: "10 lb" },
  "rajma-10lb": { slug: "kidney-beans-rajma-whole-1", unit: "10 lb" },
  "kabuli-chana-10lb": { slug: "chick-peas-white-9mm", unit: "10 lb" },
  "besan-2kg": { slug: "brars-besan-fine", unit: "20 lb", notes: "Brar fine besan; A1 has no 2 kg" },
  "rava-sooji-2kg": {
    slug: "xxx-cavalier-flour-ubl-fl-ca20",
    unit: "20 kg",
    notes: "Ardent Mills coarse sooji",
  },
  "turmeric-100g": { slug: "apna-turmeric-powder", unit: "400 g", notes: "Apna retail pack" },
  "red-chilli-100g": { slug: "apna-chilli-powder-1", unit: "400 g" },
  "cumin-100g": { slug: "apna-cumin-powder-zeera", unit: "400 g" },
  "coriander-100g": { slug: "apna-coriander-powder-2", unit: "400 g" },
  "mdh-masala": { slug: "mdh-spare-code-3", unit: "100 g", notes: "MDH Kitchen King" },
  "nanak-ghee": { slug: "nanak-pure-desi-ghee", unit: "1.6 kg" },
  "paneer": { slug: "nanak-paneer", unit: "1.6 kg" },
  "dahi": { slug: "elegant-dahi-yougart-3-26", unit: "1.8 kg", notes: "Elegant retail tub" },
  "indian-pickle": { slug: "national-mixed-pickle-large", unit: "2.27 kg" },
  "makhana": { slug: "apna-lotus-seeds-phool-makhana", unit: "2 lb" },
  "poha": { slug: "apna-pressed-rice-thin-poha", unit: "4 lb" },
  "red-label-tea": { slug: "brooke-bond-red-label-black-tea", unit: "900 g" },
  "maggi-noodles": { slug: "maggi-noodles-spicy-masala", unit: "70 g", notes: "A1 single pack" },
  "mustard-oil-1l": { slug: "apna-mustard-oil", unit: "1 L" },
  "sunflower-oil-1l": { slug: "the-king-sunflower-oil", unit: "3 L", notes: "Closest A1 retail size" },
  "salt-2kg": { slug: "windsor-salt", unit: "1 kg" },
  "sugar-2kg": { slug: "redpath-sugar-1", unit: "2 kg" },
  "papad": { slug: "jeera-papad-swad", unit: "200 g" },
};

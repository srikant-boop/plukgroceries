/**
 * Curated shelf — 33-item plan (32 SKUs: four single spices, three snacks).
 * KVI hooks: atta, basmati, sona masoori, toor, masoor.
 * Everything else: margin / mild-KVI per pricing rules.
 * No Everest extras, no kids' products — Aldi-style diaspora staples only.
 */
export const CURATED_SHELF_IDS = [
  "aashirvaad-atta-20lb",
  "basmati-rice-10lb",
  "sona-masoori-rice-10lb",
  "toor-dal-10lb",
  "masoor-dal-10lb",
  "urad-dal-10lb",
  "chana-dal-10lb",
  "moong-dal-10lb",
  "rajma-10lb",
  "kabuli-chana-10lb",
  "besan-2kg",
  "rava-sooji-2kg",
  "turmeric-100g",
  "red-chilli-100g",
  "cumin-100g",
  "coriander-100g",
  "mdh-masala",
  "nanak-ghee",
  "paneer",
  "dahi",
  "indian-pickle",
  "makhana",
  "poha",
  "red-label-tea",
  "maggi-noodles",
  "mustard-oil-1l",
  "sunflower-oil-1l",
  "salt-2kg",
  "sugar-2kg",
  "lays-chips",
  "papad",
  "parle-g-biscuits",
] as const;

export type CuratedShelfId = (typeof CURATED_SHELF_IDS)[number];

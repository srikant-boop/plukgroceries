/** How we label who a product is for — shown on cards and product detail. */

export const AUDIENCE_LABELS = {
  "Baby/Toddler": "From 6 months — starting solids.",
  Toddlers: "12 months+ who can chew this texture.",
  Kids: "School-age (3+).",
  Family: "Whole household, all ages.",
} as const;

/** Short labels shown on product cards and PDP chips. */
export const AUDIENCE_CHIP_LABEL: Record<string, string> = {
  "Baby/Toddler": "Baby & toddler",
  Toddlers: "Toddlers",
  Kids: "Kids",
  Family: "Family",
  Parents: "Parents",
};

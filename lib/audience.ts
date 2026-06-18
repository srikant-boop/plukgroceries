/** How we label who a product is for — aligned with product-page age notes. */

export const AUDIENCE_LABELS = {
  "Baby/Toddler":
    "From 6 months — starting solids and young toddlers (one meal on our shelf).",
  Toddlers: "Older toddlers who can chew and swallow the texture.",
  Kids: "School-age children; some items suit older toddlers — check the product page.",
  Family: "The whole household, including adults.",
} as const;

/** Short labels shown on product cards and PDP chips. */
export const AUDIENCE_CHIP_LABEL: Record<string, string> = {
  "Baby/Toddler": "Baby & toddler",
  Toddlers: "Toddlers",
  Kids: "Kids",
  Family: "Family",
  Parents: "Parents",
};

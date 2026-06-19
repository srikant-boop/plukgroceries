/** Grocery-style highlight labels — sentence case, like dietary lines on Whole Foods / Farm Boy PDPs. */

const HIGHLIGHT_LABELS: Record<string, string> = {
  "No Maida": "No refined flour",
  "No Sugar": "No added sugar",
  "No Added Sugar": "No added sugar",
  "No Palm Oil": "No palm oil",
  "No Preservatives": "No preservatives",
  "Not Fried": "Not fried",
  "Non-Fried": "Not fried",
  "Gluten-Free": "Gluten-free",
  Vegan: "Vegan",
  Millet: "Millet-based",
  Ragi: "Ragi & millets",
  Makhana: "Makhana",
  Roasted: "Roasted",
  Wholegrain: "Wholegrain",
  Baked: "Baked",
  "High Protein": "High protein",
  "With Milk": "With milk",
  "Travel-Friendly": "Travel-friendly",
  Chocolate: "Chocolate",
  Spinach: "Spinach",
};

/** Skip on cards — detail lives in name, nutrition, or description. */
const CARD_SKIP = new Set([
  "High Protein",
  "Chocolate",
  "Spinach",
  "Travel-Friendly",
  "Ragi",
  "Makhana",
  "Roasted",
  "With Milk",
]);

export function highlightLabel(raw: string): string {
  return HIGHLIGHT_LABELS[raw] ?? raw;
}

export function productHighlights(
  badges: string[],
  {
    max = badges.length,
    forCard = false,
  }: { max?: number; forCard?: boolean } = {},
): string[] {
  const out: string[] = [];
  for (const badge of badges) {
    if (out.length >= max) break;
    if (forCard && CARD_SKIP.has(badge)) continue;
    const label = highlightLabel(badge);
    if (!out.includes(label)) out.push(label);
  }
  return out;
}

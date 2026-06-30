export type PricingRule =
  | "kvi-near"
  | "kvi-thin"
  | "mild-kvi"
  | "margin"
  | "margin-strong"
  | "margin-moderate";

/** Margin on retail price → price = cost / (1 - marginPct). */
const MARGIN_ON_PRICE: Record<PricingRule, number> = {
  "kvi-near": 0.1,
  "kvi-thin": 0.15,
  "mild-kvi": 0.12,
  margin: 0.35,
  "margin-strong": 0.45,
  "margin-moderate": 0.25,
};

/** Round up to nearest .49 or .99 retail ending. */
export function roundRetail(price: number): number {
  const whole = Math.floor(price);
  const candidates = [whole + 0.49, whole + 0.99, whole + 1.49, whole + 1.99];
  const above = candidates.filter((c) => c >= price - 0.001);
  const pick = above.length > 0 ? above[0] : candidates[candidates.length - 1];
  return Math.round(pick * 100) / 100;
}

export function priceFromCost(
  cost: number,
  rule: PricingRule,
): { wholesalerPrice: number; ourPrice: number; markupMultiplier: number } {
  const marginPct = MARGIN_ON_PRICE[rule];
  const rawPrice = cost / (1 - marginPct);
  const ourPrice = roundRetail(rawPrice);
  const wholesalerPrice = Math.round(cost * 100) / 100;
  const markupMultiplier =
    wholesalerPrice > 0
      ? Math.round((ourPrice / wholesalerPrice) * 1000) / 1000
      : 1;
  return { wholesalerPrice, ourPrice, markupMultiplier };
}

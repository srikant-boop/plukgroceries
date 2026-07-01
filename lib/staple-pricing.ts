/** Retail margin on shelf price — price = cost / (1 - margin). */
export const STANDARD_MARGIN = 0.2;

/** Atta and rice — pass wholesale through at 0% margin. */
export const KVI_MARGIN = 0;

export type PricingTier = "kvi" | "standard";

export const ZERO_MARGIN_PRODUCT_IDS = new Set([
  "aashirvaad-atta-20lb",
  "basmati-rice-10lb",
  "sona-masoori-rice-20lb",
]);

export function pricingTierForProduct(productId: string): PricingTier {
  return ZERO_MARGIN_PRODUCT_IDS.has(productId) ? "kvi" : "standard";
}

export function marginForTier(tier: PricingTier): number {
  return tier === "kvi" ? KVI_MARGIN : STANDARD_MARGIN;
}

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
  tier: PricingTier,
): { wholesalerPrice: number; ourPrice: number; markupMultiplier: number } {
  const marginPct = marginForTier(tier);
  const wholesalerPrice = Math.round(cost * 100) / 100;
  const rawPrice = marginPct === 0 ? wholesalerPrice : cost / (1 - marginPct);
  const ourPrice =
    marginPct === 0 ? wholesalerPrice : roundRetail(rawPrice);
  const markupMultiplier =
    wholesalerPrice > 0
      ? Math.round((ourPrice / wholesalerPrice) * 1000) / 1000
      : 1;
  return { wholesalerPrice, ourPrice, markupMultiplier };
}

/** @deprecated Legacy rule names — map to new tiers for any old references. */
export type PricingRule = "kvi" | "standard";

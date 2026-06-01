import type { Order } from "./orders";
import {
  DEFAULT_MARKUP_MULTIPLIER,
  markupOnCostPct,
  products,
  retailFromWholesale,
  type Product,
} from "./products";

/** Catalogue before Aldi-aligned reduction (2026-06). */
export const LEGACY_DEFAULT_MARKUP_MULTIPLIER = 1.25;
export const LEGACY_ELEVATED_MARKUP_MULTIPLIER = 1.3;

const LEGACY_ELEVATED_SLUGS = new Set([
  "tomatoes-on-the-vine",
  "english-cucumbers",
  "carrots",
  "broccoli-crowns",
]);

/** Max markup % used to scale admin bar charts. */
export const MARKUP_BAR_SCALE_PCT = 35;

export type ProductMarkupInsight = {
  productId: string;
  name: string;
  category: string;
  passThrough: boolean;
  wholesalerPrice: number;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  currentMarkupPct: number;
  previousMarkupPct: number;
  markupChangePp: number;
  currentMultiplier: number;
  previousMultiplier: number;
  unitsAtPreviousMarkup: number;
  unitsAtCurrentMarkup: number;
  revenueAtPreviousMarkup: number;
  revenueAtCurrentMarkup: number;
};

export function previousMarkupMultiplier(product: Product): number {
  if (product.markupMultiplier <= 1) return 1;
  if (LEGACY_ELEVATED_SLUGS.has(product.slug)) {
    return LEGACY_ELEVATED_MARKUP_MULTIPLIER;
  }
  return LEGACY_DEFAULT_MARKUP_MULTIPLIER;
}

export function previousCatalogPrice(product: Product): number {
  if (product.markupMultiplier <= 1) return product.ourPrice;
  return retailFromWholesale(
    product.wholesalerPrice,
    previousMarkupMultiplier(product),
  );
}

function lineUsesPreviousMarkup(
  lineUnitPrice: number,
  previousPrice: number,
  currentPrice: number,
  lineMarkupMultiplier?: number,
  currentMultiplier?: number,
): boolean {
  if (
    lineMarkupMultiplier != null &&
    currentMultiplier != null &&
    lineMarkupMultiplier > currentMultiplier + 0.001
  ) {
    return true;
  }
  if (Math.abs(previousPrice - currentPrice) < 0.005) return false;
  return lineUnitPrice >= previousPrice - 0.02 && lineUnitPrice > currentPrice + 0.02;
}

export function buildProductMarkupInsights(
  paidOrders: Order[],
): ProductMarkupInsight[] {
  const orderStats = new Map<
    string,
    {
      unitsAtPrevious: number;
      unitsAtCurrent: number;
      revenueAtPrevious: number;
      revenueAtCurrent: number;
    }
  >();

  for (const order of paidOrders) {
    for (const line of order.lines) {
      const key = line.productId;
      const stats = orderStats.get(key) ?? {
        unitsAtPrevious: 0,
        unitsAtCurrent: 0,
        revenueAtPrevious: 0,
        revenueAtCurrent: 0,
      };
      const product = products.find((p) => p.id === key);
      if (!product) continue;

      const prevPrice = previousCatalogPrice(product);
      const curPrice = product.ourPrice;
      const atPrevious = lineUsesPreviousMarkup(
        line.unitPrice,
        prevPrice,
        curPrice,
        line.markupMultiplier,
        product.markupMultiplier,
      );

      if (atPrevious) {
        stats.unitsAtPrevious += line.qty;
        stats.revenueAtPrevious += line.unitPrice * line.qty;
      } else {
        stats.unitsAtCurrent += line.qty;
        stats.revenueAtCurrent += line.unitPrice * line.qty;
      }
      orderStats.set(key, stats);
    }
  }

  return products.map((product) => {
    const previousMultiplier = previousMarkupMultiplier(product);
    const previousPrice = previousCatalogPrice(product);
    const currentPrice = product.ourPrice;
    const currentMarkupPct = markupOnCostPct(product);
    const previousMarkupPct = (previousMultiplier - 1) * 100;
    const stats = orderStats.get(product.id);

    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      passThrough: product.markupMultiplier <= 1,
      wholesalerPrice: product.wholesalerPrice,
      currentPrice,
      previousPrice,
      priceChange: Math.round((currentPrice - previousPrice) * 100) / 100,
      currentMarkupPct,
      previousMarkupPct,
      markupChangePp:
        Math.round((currentMarkupPct - previousMarkupPct) * 10) / 10,
      currentMultiplier: product.markupMultiplier,
      previousMultiplier,
      unitsAtPreviousMarkup: stats?.unitsAtPrevious ?? 0,
      unitsAtCurrentMarkup: stats?.unitsAtCurrent ?? 0,
      revenueAtPreviousMarkup:
        Math.round((stats?.revenueAtPrevious ?? 0) * 100) / 100,
      revenueAtCurrentMarkup:
        Math.round((stats?.revenueAtCurrent ?? 0) * 100) / 100,
    };
  });
}

export const markupTargetLabel = `${Math.round((DEFAULT_MARKUP_MULTIPLIER - 1) * 100)}% on cost`;

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

/** When 20% produce markup went live (Toronto). */
export const MARKUP_REDUCTION_AT_MS = Date.parse("2026-06-01T21:30:00-04:00");

const LEGACY_ELEVATED_SLUGS = new Set([
  "tomatoes-on-the-vine",
  "english-cucumbers",
  "carrots",
  "broccoli-crowns",
]);

/** Max markup % used to scale admin bar charts. */
export const MARKUP_BAR_SCALE_PCT = 35;

/** Distinct hues per SKU (Pluk palette). */
export const SKU_CHART_COLORS = [
  "#4a5c42",
  "#7d9474",
  "#a8b89e",
  "#6b5a32",
  "#9a8555",
  "#c4b896",
  "#2d5016",
  "#556b2f",
  "#8b6914",
  "#5c4033",
  "#1a1a1a",
  "#d4ddd0",
];

export type MarkupMetric = "markupPct" | "units" | "revenue";

export type MarkupSkuMeta = {
  productId: string;
  name: string;
  color: string;
  /** Wholesale pass-through (markup ×1). */
  passThrough: boolean;
  /** Discover / Find shelf — omitted from markup chart for now. */
  discoverFind: boolean;
};

/** SKUs to plot on the markup % timeline (excludes Discover Find). */
export function isMarkupChartSku(meta: MarkupSkuMeta): boolean {
  return !meta.discoverFind;
}

export type MarkupTimelineBucket = {
  startMs: number;
  label: string;
  shortLabel: string;
  markupPct: Record<string, number>;
  units: Record<string, number>;
  revenue: Record<string, number>;
};

export type MarkupTimeSeries = {
  skus: MarkupSkuMeta[];
  buckets: MarkupTimelineBucket[];
};

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

export function roundMarkupPct(pct: number): number {
  return Math.round(pct * 10) / 10;
}

export function formatMarkupPct(pct: number): string {
  const r = roundMarkupPct(pct);
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

export function formatMarkupChangePp(pp: number): string {
  if (pp === 0) return "—";
  const r = roundMarkupPct(pp);
  const sign = r > 0 ? "+" : "-";
  return `${sign}${formatMarkupPct(Math.abs(r))} pp`;
}

function formatTorontoDayKey(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

function formatTorontoDayLabel(ms: number): { label: string; shortLabel: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
  const key = formatTorontoDayKey(ms);
  const [, month, day] = key.split("-");
  return { label: parts, shortLabel: `${Number(month)}/${Number(day)}` };
}

function torontoDayStartMs(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 5, 0, 0);
  for (let i = 0; i < 48; i++) {
    const key = formatTorontoDayKey(guess + i * 3_600_000);
    if (key === dateKey) {
      for (let h = 0; h < 24; h++) {
        const ms = guess + i * 3_600_000 + h * 3_600_000;
        if (formatTorontoDayKey(ms) === dateKey) return ms;
      }
    }
  }
  return guess;
}

function catalogMarkupPctAt(product: Product, atMs: number): number {
  if (product.markupMultiplier <= 1) return 0;
  const mult =
    atMs < MARKUP_REDUCTION_AT_MS
      ? previousMarkupMultiplier(product)
      : product.markupMultiplier;
  return roundMarkupPct((mult - 1) * 100);
}

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
  return (
    lineUnitPrice >= previousPrice - 0.02 && lineUnitPrice > currentPrice + 0.02
  );
}

function skuColor(index: number): string {
  return SKU_CHART_COLORS[index % SKU_CHART_COLORS.length]!;
}

function buildTimelineBuckets(
  timeline?: { startMs: number; label: string; shortLabel: string }[],
): { startMs: number; label: string; shortLabel: string }[] {
  if (timeline && timeline.length > 0) return timeline;

  const buckets: { startMs: number; label: string; shortLabel: string }[] = [];
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const ms = now - i * 86_400_000;
    const key = formatTorontoDayKey(ms);
    const startMs = torontoDayStartMs(key);
    const { label, shortLabel } = formatTorontoDayLabel(startMs);
    buckets.push({ startMs, label, shortLabel });
  }
  return buckets;
}

function bucketEndMs(
  buckets: { startMs: number }[],
  index: number,
): number {
  if (index < buckets.length - 1) return buckets[index + 1]!.startMs;
  return buckets[index]!.startMs + 86_400_000;
}

export function buildMarkupTimeSeries(
  paidOrders: Order[],
  timeline?: { startMs: number; label: string; shortLabel: string }[],
): MarkupTimeSeries {
  const bucketDefs = buildTimelineBuckets(timeline);
  const skus: MarkupSkuMeta[] = products.map((p, i) => ({
    productId: p.id,
    name: p.name,
    color: skuColor(i),
    passThrough: p.markupMultiplier <= 1,
    discoverFind: p.special === "Find",
  }));

  const buckets: MarkupTimelineBucket[] = bucketDefs.map((b) => ({
    ...b,
    markupPct: Object.fromEntries(products.map((p) => [p.id, 0])),
    units: Object.fromEntries(products.map((p) => [p.id, 0])),
    revenue: Object.fromEntries(products.map((p) => [p.id, 0])),
  }));

  type Acc = { markupWeighted: number; units: number; revenue: number };
  const acc = new Map<number, Map<string, Acc>>();

  for (const order of paidOrders) {
    const orderMs = order.createdAt;
    const bucketIdx = bucketDefs.findIndex((b, i) => {
      const end = bucketEndMs(bucketDefs, i);
      return orderMs >= b.startMs && orderMs < end;
    });
    if (bucketIdx < 0) continue;

    const bucketAcc = acc.get(bucketIdx) ?? new Map();
    for (const line of order.lines) {
      const row = bucketAcc.get(line.productId) ?? {
        markupWeighted: 0,
        units: 0,
        revenue: 0,
      };
      const lineMarkup =
        line.markupOnCostPct != null && line.markupOnCostPct > 0
          ? roundMarkupPct(line.markupOnCostPct)
          : roundMarkupPct(
              ((line.unitPrice / Math.max(line.wholesalerPrice, 0.01)) - 1) *
                100,
            );
      row.markupWeighted += lineMarkup * line.qty;
      row.units += line.qty;
      row.revenue += line.unitPrice * line.qty;
      bucketAcc.set(line.productId, row);
    }
    acc.set(bucketIdx, bucketAcc);
  }

  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i]!;
    const bucketAcc = acc.get(i);
    const bucketMid =
      b.startMs +
      (i < bucketDefs.length - 1
        ? (bucketDefs[i + 1]!.startMs - b.startMs) / 2
        : 43_200_000);

    for (const product of products) {
      const row = bucketAcc?.get(product.id);
      if (row && row.units > 0) {
        b.markupPct[product.id] = roundMarkupPct(row.markupWeighted / row.units);
        b.units[product.id] = row.units;
        b.revenue[product.id] = Math.round(row.revenue * 100) / 100;
      } else if (product.markupMultiplier <= 1) {
        b.markupPct[product.id] = 0;
      } else {
        b.markupPct[product.id] = catalogMarkupPctAt(product, bucketMid);
      }
    }
  }

  return { skus, buckets };
}

export function bucketSkuValue(
  bucket: MarkupTimelineBucket,
  productId: string,
  metric: MarkupMetric,
): number {
  if (metric === "markupPct") return bucket.markupPct[productId] ?? 0;
  if (metric === "units") return bucket.units[productId] ?? 0;
  return bucket.revenue[productId] ?? 0;
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
    const currentMarkupPct = roundMarkupPct(markupOnCostPct(product));
    const previousMarkupPct = roundMarkupPct((previousMultiplier - 1) * 100);
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
      markupChangePp: roundMarkupPct(currentMarkupPct - previousMarkupPct),
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

import type { Product } from "./products";
import { markupOnCostPct } from "./products";
import { getSupplierById } from "./suppliers";

/** Competitor row frozen at order time. */
export type OrderLineCompetitorSnapshot = {
  store: string;
  price: number;
  unit: string;
  url?: string;
  organic?: boolean;
};

/**
 * One catalogue line frozen when the order is saved.
 * `productUuid` = immutable key; `sku` / `slug` = human id for URLs & ops.
 */
export type OrderLine = {
  /** Immutable product UUID from catalogue. */
  productUuid: string;
  /** Slug / legacy cart id, e.g. `clementines`. */
  productId: string;
  /** Human-readable SKU (slug) at order time. */
  sku: string;
  slug: string;

  name: string;
  unit: string;
  qty: number;
  category: string;

  /** Wholesaler / pack cost per unit (CAD). */
  wholesalerPrice: number;
  /** e.g. 1.25 = 25% markup on cost. */
  markupMultiplier: number;
  /** Markup on cost as percent, e.g. 25. */
  markupOnCostPct: number;
  /** Catalogue retail per unit at order time. */
  ourPrice: number;
  /** Price charged per unit (matches ourPrice unless promos are added later). */
  unitPrice: number;
  lineSubtotal: number;

  /** Packer / label on box — internal. */
  brand?: string;
  supplierId?: string;
  supplierName?: string;
  supplierSlug?: string;
  organic?: boolean;
  origin?: string;

  competitors: OrderLineCompetitorSnapshot[];

  marginPerUnit: number;
  marginOnLine: number;

  /** ISO timestamp when this line was snapshotted from the catalogue. */
  snapshotAt: string;
};

export function orderLineSubtotal(line: OrderLine): number {
  return line.lineSubtotal ?? line.unitPrice * line.qty;
}

/** Build a full audit line from the current catalogue (webhook / checkout completion). */
export function snapshotOrderLine(
  product: Product,
  qty: number,
  snapshotAt: string = new Date().toISOString(),
): OrderLine {
  const supplier = product.supplierId
    ? getSupplierById(product.supplierId)
    : undefined;
  const unitPrice = product.ourPrice;
  const marginPerUnit = unitPrice - product.wholesalerPrice;

  return {
    productUuid: product.uuid,
    productId: product.id,
    sku: product.slug,
    slug: product.slug,
    name: product.name,
    unit: product.unit,
    qty,
    category: product.category,
    wholesalerPrice: product.wholesalerPrice,
    markupMultiplier: product.markupMultiplier,
    markupOnCostPct: markupOnCostPct(product),
    ourPrice: product.ourPrice,
    unitPrice,
    lineSubtotal: Math.round(unitPrice * qty * 100) / 100,
    brand: product.brand,
    supplierId: product.supplierId,
    supplierName: supplier?.name,
    supplierSlug: supplier?.slug,
    organic: product.organic,
    origin: product.origin,
    competitors: product.competitors.map((c) => ({ ...c })),
    marginPerUnit: Math.round(marginPerUnit * 100) / 100,
    marginOnLine: Math.round(marginPerUnit * qty * 100) / 100,
    snapshotAt,
  };
}

export function orderLineTotals(lines: OrderLine[]) {
  const subtotal = lines.reduce((s, l) => s + orderLineSubtotal(l), 0);
  const totalWholesaleCost = lines.reduce(
    (s, l) => s + l.wholesalerPrice * l.qty,
    0,
  );
  const totalMargin = lines.reduce((s, l) => s + l.marginOnLine, 0);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalWholesaleCost: Math.round(totalWholesaleCost * 100) / 100,
    totalMargin: Math.round(totalMargin * 100) / 100,
  };
}

/** Normalize legacy orders saved before the audit snapshot (minimal lines). */
export function normalizeOrderLine(raw: OrderLine): OrderLine {
  if (raw.sku && raw.wholesalerPrice != null) return raw;

  const unitPrice = raw.unitPrice ?? 0;
  const qty = raw.qty ?? 0;
  const snapshotAt = raw.snapshotAt ?? new Date(0).toISOString();

  return {
    productUuid: raw.productUuid ?? "",
    productId: raw.productId,
    sku: raw.sku ?? raw.productId,
    slug: raw.slug ?? raw.productId,
    name: raw.name,
    unit: raw.unit,
    qty,
    category: raw.category ?? "",
    wholesalerPrice: raw.wholesalerPrice ?? 0,
    markupMultiplier: raw.markupMultiplier ?? 1,
    markupOnCostPct: raw.markupOnCostPct ?? 0,
    ourPrice: raw.ourPrice ?? unitPrice,
    unitPrice,
    lineSubtotal: raw.lineSubtotal ?? unitPrice * qty,
    brand: raw.brand,
    supplierId: raw.supplierId,
    supplierName: raw.supplierName,
    supplierSlug: raw.supplierSlug,
    organic: raw.organic,
    origin: raw.origin,
    competitors: raw.competitors ?? [],
    marginPerUnit: raw.marginPerUnit ?? 0,
    marginOnLine: raw.marginOnLine ?? 0,
    snapshotAt,
  };
}

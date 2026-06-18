// Product schema — one row per SKU. Pantry catalogue in lib/pantry-catalog.ts.

import {
  PANTRY_COLLECTIONS,
  type PantryCollection,
  type PantryMeta,
  pantryProducts,
} from "./pantry-catalog";

export type CompetitorPrice = {
  store: string;
  price: number;
  unit: string;
  url?: string;
  organic?: boolean;
  perLb?: number;
};

export type Product = {
  uuid: string;
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  image: string;
  imageAlt?: string;
  unit: string;
  stock: number;
  wholesalerPrice: number;
  markupMultiplier: number;
  ourPrice: number;
  competitors: CompetitorPrice[];
  supplierId?: string;
  brand?: string;
  organic?: boolean;
  origin?: string;
  tags?: string[];
  avgWeightKg?: number;
  /** À la carte pantry metadata */
  pantry?: PantryMeta;
  collection?: PantryCollection;
  /** @deprecated Legacy produce — unused on pantry storefront */
  special?: string;
};

export const STANDARD_MARKUP_MULTIPLIER = 1.1;
export const DEFAULT_MARKUP_MULTIPLIER = 1.2;

export const retailFromWholesale = (
  wholesalerPrice: number,
  markupMultiplier: number,
): number =>
  Math.round(wholesalerPrice * markupMultiplier * 100) / 100;

export const margin = (p: Product) => p.ourPrice - p.wholesalerPrice;
export const marginPct = (p: Product) =>
  p.wholesalerPrice > 0 ? (margin(p) / p.ourPrice) * 100 : 0;
export const markupOnCostPct = (p: Product) =>
  Math.round((p.markupMultiplier - 1) * 1000) / 10;

export const cheapestCompetitor = (p: Product) =>
  p.competitors.reduce<CompetitorPrice | null>(
    (best, c) => (best === null || c.price < best.price ? c : best),
    null,
  );

export const mostExpensiveCompetitor = (p: Product) =>
  p.competitors.reduce<CompetitorPrice | null>(
    (worst, c) => (worst === null || c.price > worst.price ? c : worst),
    null,
  );

export const savingsVsCheapest = (p: Product) => {
  const c = cheapestCompetitor(p);
  if (!c) return 0;
  return c.price - p.ourPrice;
};

export type PriceDelta = {
  competitor: CompetitorPrice;
  delta: number;
  pct: number;
  cheaper: boolean;
};

export const priceDeltas = (p: Product): PriceDelta[] =>
  p.competitors.map((c) => {
    const delta = c.price - p.ourPrice;
    const pct = (delta / c.price) * 100;
    return { competitor: c, delta, pct, cheaper: delta > 0 };
  });

export const averageSavingsVsStore = (store: string): number => {
  let pctSum = 0;
  let n = 0;
  for (const p of products) {
    const c = p.competitors.find((c) => c.store === store);
    if (!c || c.price <= 0) continue;
    pctSum += ((c.price - p.ourPrice) / c.price) * 100;
    n++;
  }
  return n > 0 ? pctSum / n : 0;
};

export const products: Product[] = pantryProducts;

/** All pantry SKUs are on the curated shelf. */
export const STOREFRONT_PRODUCT_IDS = new Set(products.map((p) => p.id));

export const isStorefrontProduct = (p: Product) =>
  STOREFRONT_PRODUCT_IDS.has(p.id);

export const storefrontProducts = (): Product[] =>
  products.filter(isStorefrontProduct);

export const getStorefrontProduct = (slug: string) => {
  const p = getProduct(slug);
  return p && isStorefrontProduct(p) ? p : undefined;
};

export const getStorefrontProductById = (id: string) => {
  const p = getProductById(id);
  return p && isStorefrontProduct(p) ? p : undefined;
};

export const specialProducts = (): Product[] => [];

export const pricePerLbLabel = (p: Product): string | null => {
  const m = p.unit.match(/^([\d.]+)\s*lb/);
  if (m) {
    const lbs = parseFloat(m[1]);
    if (isFinite(lbs) && lbs > 0) return `$${(p.ourPrice / lbs).toFixed(2)}/lb`;
  }
  if (p.avgWeightKg && p.avgWeightKg > 0) {
    const lbs = p.avgWeightKg * 2.2046226218;
    return `$${(p.ourPrice / lbs).toFixed(2)}/lb`;
  }
  return null;
};

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getProductByUuid = (uuid: string) =>
  products.find((p) => p.uuid === uuid);

export const categories = () =>
  Array.from(new Set(storefrontProducts().map((p) => p.category)));

export type StorefrontSection = {
  id: string;
  title: string;
  match: (p: Product) => boolean;
};

/** Homepage / shop category sections — curated shelf groupings. */
export const storefrontSections = (): StorefrontSection[] =>
  PANTRY_COLLECTIONS.map(({ slug, title }) => ({
    id: slug,
    title,
    match: (p) => p.collection === slug,
  }));

export function productsInCollection(collection: PantryCollection): Product[] {
  return storefrontProducts().filter((p) => p.collection === collection);
}

export function hasPantryMeta(
  p: Product,
): p is Product & { pantry: PantryMeta } {
  return Boolean(p.pantry);
}

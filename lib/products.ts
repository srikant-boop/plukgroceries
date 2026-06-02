// Product schema mirrors what an Excel/CSV upload will provide later.
// One row per SKU. `competitors` is open-ended so adding stores stays cheap.
//
// Identifiers (how grocers usually think about it):
//   uuid     — immutable system key (never changes; use on orders & imports)
//   slug/id  — human URL + cart key (may change if you rename a product)
//   Future: gtin/upc (barcode), plu (produce), supplierItemCode (wholesaler)

export type CompetitorPrice = {
  store: string;
  price: number;
  unit: string;
  url?: string;
  // Sobeys produce comparables are organic SKUs — flag so the table labels them.
  organic?: boolean;
  /** Shelf per-lb when the store prices by weight (e.g. Loblaws bananas). */
  perLb?: number;
};

export type Product = {
  /** Immutable catalogue UUID — primary key for orders & inventory. */
  uuid: string;
  /** Same as slug today; used in URLs, cart, and Stripe metadata. */
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
  // Internal ops: retail = wholesalerPrice × markupMultiplier (e.g. 1.20 =
  // 20% on cost, 1.0 = pass-through). Never shown on the storefront.
  markupMultiplier: number;
  ourPrice: number;
  competitors: CompetitorPrice[];
  supplierId?: string;
  // Packer/label on the box at the wholesaler — internal ops only, not shown
  // on the storefront (Pluk is the customer-facing brand).
  brand?: string;
  // When set, item is in the homepage Discover section (rotating drop pick).
  // Value is internal only — not shown on the storefront.
  special?: string;
  // Certified organic. Per BRAND.md: only set when the specific item is —
  // organic is no longer a brand-wide promise.
  organic?: boolean;
  origin?: string;
  tags?: string[];
  /** Average sell weight in kg when sold by count/bunch (for per-lb shelf labels). */
  avgWeightKg?: number;
};

/** Standard produce markup: cost × 1.20 (Aldi-style ~20% on cost). Internal ops only. */
export const DEFAULT_MARKUP_MULTIPLIER = 1.2;

/** Derive retail from wholesale cost (round to cents). Internal ops only. */
export const retailFromWholesale = (
  wholesalerPrice: number,
  markupMultiplier: number,
): number =>
  Math.round(wholesalerPrice * markupMultiplier * 100) / 100;

export const margin = (p: Product) => p.ourPrice - p.wholesalerPrice;
export const marginPct = (p: Product) =>
  p.wholesalerPrice > 0 ? (margin(p) / p.ourPrice) * 100 : 0;
/** Markup on cost, e.g. multiplier 1.20 → 20%. Internal ops only. */
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
  delta: number; // positive = Pluk is cheaper by this much; negative = more expensive
  pct: number; // percentage saving (positive) or surcharge (negative)
  cheaper: boolean;
};

export const priceDeltas = (p: Product): PriceDelta[] =>
  p.competitors.map((c) => {
    const delta = c.price - p.ourPrice;
    const pct = (delta / c.price) * 100;
    return { competitor: c, delta, pct, cheaper: delta > 0 };
  });

// Average % saving vs a named competitor across every catalogue item that
// lists that competitor. Returns 0 if no products list them.
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

export const specialProducts = (): Product[] =>
  products.filter((p) => p.special);

// Per-pound price label for items whose `unit` starts with a weight in lb
// (e.g. "3 lb bag", "1 lb"). Returns null for count-based or volume units.
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

// Unsplash photos — verified-resolving IDs. Swap any URL for your own
// product photography when you upload via the eventual Excel import.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  // ─── Vegetables ──────────────────────────────
  {
    uuid: "8f08b890-1a5c-4187-bd65-24b11ad582d7",
    id: "yellow-potatoes",
    slug: "yellow-potatoes",
    name: "Yellow Potatoes",
    shortDescription: "Creamy yellow flesh, 3 lb bag",
    longDescription: "",
    category: "Vegetables",
    image: "/products/yellow-potatoes.webp",
    unit: "3 lb bag",
    stock: 40,
    wholesalerPrice: 5.75,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 6.9,
    competitors: [
      { store: "Sobeys", price: 7.99, unit: "3 lb", url: "https://voila.ca/products/organic-potatoes-yellow-1-36-kg/472128EA", organic: true },
      { store: "Loblaws", price: 7.0, unit: "3 lb", url: "https://www.loblaws.ca/en/organic-yellow-potatoes-3lb-bag/p/20075900_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Earth Fresh",
    organic: true,
  },
  {
    uuid: "444843d4-b40e-4771-8e0f-c39d188f12dc",
    id: "tomatoes-on-the-vine",
    slug: "tomatoes-on-the-vine",
    name: "Tomatoes on the Vine",
    shortDescription: "Greenhouse, on the vine",
    longDescription: "",
    category: "Vegetables",
    image: unsplash("1592924357228-91a4daadcfea"),
    unit: "4-6 count",
    stock: 40,
    wholesalerPrice: 5.44,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 6.53,
    competitors: [
      { store: "Sobeys", price: 8.99, unit: "4-6 count", url: "https://voila.ca/products/organic-tomatoes-on-the-vine-4-6-counts/1408309EA", organic: true },
      { store: "Loblaws", price: 7.92, unit: "4-6 count", url: "https://www.loblaws.ca/en/tomato-on-the-vine-red-1-bunch/p/20127917001_KG?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    uuid: "63274256-65a9-428d-8b73-1b4e363045ad",
    id: "english-cucumbers",
    slug: "english-cucumbers",
    name: "English Cucumber",
    shortDescription: "Long, one count",
    longDescription: "",
    category: "Vegetables",
    image: "/products/english-cucumbers.jpg",
    unit: "1 count",
    stock: 45,
    wholesalerPrice: 2.0,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 2.4,
    competitors: [
      { store: "Sobeys", price: 4.99, unit: "1 ct", url: "https://voila.ca/products/organic-english-cucumber-1-count/129818EA", organic: true },
      { store: "Loblaws", price: 4.0, unit: "1 ct", url: "https://www.loblaws.ca/en/organic-english-cucumber/p/20080489001_EA?storeId=1011", organic: true },
    ],
    brand: "Gen V",
    supplierId: "terra-freska",
    organic: true,
  },
  {
    uuid: "a64efff2-3853-467b-9319-4545f4595c10",
    id: "carrots",
    slug: "carrots",
    name: "Carrots",
    shortDescription: "2 lb bag",
    longDescription: "",
    category: "Vegetables",
    image: "/products/carrots.jpg",
    unit: "2 lb bag",
    stock: 40,
    wholesalerPrice: 3.08,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 3.7,
    competitors: [
      { store: "Sobeys", price: 5.99, unit: "2 lb", url: "https://voila.ca/products/organic-carrots-908-g/112284EA", organic: true },
      { store: "Loblaws", price: 5.0, unit: "2 lb", url: "https://www.loblaws.ca/en/organic-carrots-2-lb-bag/p/20053421_EA?storeId=1011", organic: true },
    ],
    brand: "Cal-Organic",
    supplierId: "terra-freska",
    organic: true,
  },
  {
    uuid: "da4a96f2-4dc0-465e-b12f-6ff0872e86a3",
    id: "romaine-lettuce",
    slug: "romaine-lettuce",
    name: "Romaine Lettuce",
    shortDescription: "Three hearts, 340 g",
    longDescription: "",
    category: "Vegetables",
    image: "/products/romaine-lettuce.webp",
    unit: "3 pack (340 g)",
    stock: 30,
    wholesalerPrice: 9.0,
    markupMultiplier: 1,
    ourPrice: 8.99,
    competitors: [
      { store: "Sobeys", price: 8.99, unit: "3 ct", url: "https://voila.ca/products/organic-romaine-hearts-3-count/414489EA", organic: true },
      { store: "Loblaws", price: 9.99, unit: "3 ct", url: "https://www.loblaws.ca/en/organic-romaine-lettuce-hearts/p/20599776001_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Foxy",
    organic: true,
  },
  {
    uuid: "a13c2375-83ba-4040-a888-177c62a9d760",
    id: "broccoli-crowns",
    slug: "broccoli-crowns",
    name: "Broccoli Crowns",
    shortDescription: "One crown",
    longDescription: "",
    category: "Vegetables",
    image: "/products/broccoli-crowns.avif",
    unit: "1 crown",
    stock: 30,
    wholesalerPrice: 3.29,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 3.95,
    competitors: [
      { store: "Sobeys", price: 8.99, unit: "1 ct", url: "https://voila.ca/products/organic-broccoli-1-count/112808EA", organic: true },
      { store: "Loblaws", price: 7.99, unit: "1 ct", url: "https://www.loblaws.ca/en/broccoli/p/20149635001_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },

  // ─── Fruits ────────────────────────────────────────────────────
  {
    uuid: "ffb9224d-9df4-465e-8b6a-6ca0acc95531",
    id: "bananas",
    slug: "bananas",
    name: "Bananas",
    shortDescription: "6–10 count bunch",
    longDescription: "",
    category: "Fruits",
    image: "/products/bananas.avif",
    unit: "6-10 count",
    stock: 60,
    wholesalerPrice: 2.76,
    // Match Loblaws $1.09/lb × 1.1 kg avg bunch ≈ $2.64 — sold below cost.
    markupMultiplier: 0.9565,
    ourPrice: 2.64,
    avgWeightKg: 1.1,
    competitors: [
      { store: "Sobeys", price: 3.79, unit: "6-10 count", url: "https://voila.ca/products/organic-bananas-bunch-6-10-count-ripe-in-3-4-days/833423EA", organic: true },
      {
        store: "Loblaws",
        price: 2.64,
        perLb: 1.09,
        unit: "est. bunch (avg 1.1 kg)",
        url: "https://www.loblaws.ca/en/organic-bananas-bunch/p/20139509001_KG?storeId=1011",
        organic: true,
      },
    ],
    supplierId: "terra-freska",
    brand: "Dole",
    organic: true,
  },
  {
    uuid: "4ff8e3c7-318c-4cb9-8891-3d94f51962f2",
    id: "gala-apples",
    slug: "gala-apples",
    name: "Gala Apples",
    shortDescription: "3 lb bag",
    longDescription: "",
    category: "Fruits",
    image: unsplash("1619546813926-a78fa6372cd2"),
    unit: "3 lb bag",
    stock: 30,
    wholesalerPrice: 7.17,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 8.6,
    competitors: [
      { store: "Sobeys", price: 8.99, unit: "1.36 kg", url: "https://voila.ca/products/lil-snapper-organic-apples-gala-1-36-kg/674671EA", organic: true },
      { store: "Loblaws", price: 9.5, unit: "3 lb", url: "https://www.loblaws.ca/en/gala-apples-3-lb-bag/p/20606349001_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    uuid: "1d668541-9979-46d9-b4a1-d95cfc946485",
    id: "clementines",
    slug: "clementines",
    name: "Clementines",
    shortDescription: "2 lb box",
    longDescription: "",
    category: "Fruits",
    image: "/products/clementines.webp",
    unit: "2 lb box (907 g)",
    stock: 30,
    wholesalerPrice: 5.87,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 7.04,
    competitors: [
      { store: "Sobeys", price: 8.49, unit: "907 g", url: "https://voila.ca/products/organic-clementine-907-g/265759EA", organic: true },
      { store: "Loblaws", price: 8.0, unit: "907 g", url: "https://www.loblaws.ca/en/organic-orange/p/20972628001_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    uuid: "6db2b209-03af-4dd3-802a-2d9cc6edcde8",
    id: "strawberries",
    slug: "strawberries",
    name: "Strawberries",
    shortDescription: "1 lb clamshell",
    longDescription: "",
    category: "Fruits",
    image: "/products/strawberries.png",
    unit: "1 lb clamshell (454 g)",
    stock: 30,
    wholesalerPrice: 7.25,
    // 10% markup — matches Loblaws Baseline Road shelf price.
    markupMultiplier: 1.1,
    ourPrice: 7.98,
    competitors: [
      { store: "Sobeys", price: 9.99, unit: "454 g", url: "https://voila.ca/products/organic-strawberries-454-g/14837EA", organic: true },
      { store: "Loblaws", price: 8.0, unit: "454 g", url: "https://www.loblaws.ca/en/organic-strawberries-1-lb/p/20313872001_EA?storeId=1011", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Driscoll's",
    organic: true,
  },

  // ─── Beverages ─────────────────────────────────────────────────
  {
    uuid: "b8033818-0682-4cac-9cd8-bf835bf05f45",
    id: "honey-soda",
    slug: "honey-soda",
    name: "Honey Soda",
    shortDescription:
      "Their own sparkling drink — wildflower honey, light fizz, nothing fussy on the label.",
    longDescription:
      "Lightly sparkling, with sweetness from wildflower honey rather than cane sugar. No added flavours or dyes. Gluten-free, caffeine-free, about 80 calories per 355 ml can.",
    category: "Beverages",
    image: "/products/honey-soda.webp",
    imageAlt:
      "Backed By Bees Original Honey Soda can — 355 ml, all natural, made from real honey",
    unit: "355 ml can",
    stock: 36,
    // Backed By Bees case: $25.89 / 12 cans
    wholesalerPrice: 2.16,
    markupMultiplier: 1.25,
    ourPrice: 2.7,
    competitors: [],
    supplierId: "backed-by-bees",
    special: "Find",
  },

  // ─── Pantry (specials from neighbouring farms this drop) ───────
  {
    uuid: "df2d2985-c29b-4977-bf0c-c22ded169214",
    id: "raw-honey",
    slug: "raw-honey",
    name: "Raw Honey",
    shortDescription:
      "Raw wildflower honey from their hives — never heated, never filtered.",
    longDescription:
      "Straight from the hive in Halton Region: unheated and unfiltered so it keeps the taste of whatever was blooming that season. Colour and flavour shift with the year — that’s the point.",
    category: "Pantry",
    image: "/products/raw-honey.webp",
    imageAlt:
      "Backed By Bees raw honey jar — Bee Keepin' it Real, 500 g Ontario No. 1 golden",
    unit: "500 g jar",
    stock: 24,
    // Backed By Bees case: $103.24 / 12 jars
    wholesalerPrice: 8.6,
    markupMultiplier: 1.25,
    ourPrice: 10.75,
    competitors: [],
    supplierId: "backed-by-bees",
    special: "Find",
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getProductByUuid = (uuid: string) =>
  products.find((p) => p.uuid === uuid);

export const categories = () =>
  Array.from(new Set(products.map((p) => p.category)));

// Product schema mirrors what an Excel/CSV upload will provide later.
// One row per SKU. `competitors` is open-ended so adding stores stays cheap.

export type CompetitorPrice = {
  store: string;
  price: number;
  unit: string;
  url?: string;
  // Voila produce comparables are organic SKUs — flag so the table labels them.
  organic?: boolean;
};

export type Product = {
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
  // Internal ops: retail = wholesalerPrice × markupMultiplier (e.g. 1.25 =
  // 25% on cost, 1.0 = pass-through). Never shown on the storefront.
  markupMultiplier: number;
  ourPrice: number;
  competitors: CompetitorPrice[];
  supplierId?: string;
  // Packer/label on the box at the wholesaler — internal ops only, not shown
  // on the storefront (Pluk is the customer-facing brand).
  brand?: string;
  // When set, this item is featured as a "special" for the current drop —
  // typically something from a neighbouring farm. The string is the badge
  // label, e.g. "Neighbour pick".
  special?: string;
  // Certified organic. Per BRAND.md: only set when the specific item is —
  // organic is no longer a brand-wide promise.
  organic?: boolean;
  origin?: string;
  tags?: string[];
};

/** Standard produce markup: cost × 1.25. Internal ops only. */
export const DEFAULT_MARKUP_MULTIPLIER = 1.25;

/** Derive retail from wholesale cost (round to cents). Internal ops only. */
export const retailFromWholesale = (
  wholesalerPrice: number,
  markupMultiplier: number,
): number =>
  Math.round(wholesalerPrice * markupMultiplier * 100) / 100;

export const margin = (p: Product) => p.ourPrice - p.wholesalerPrice;
export const marginPct = (p: Product) =>
  p.wholesalerPrice > 0 ? (margin(p) / p.ourPrice) * 100 : 0;
/** Markup on cost, e.g. multiplier 1.25 → 25%. Internal ops only. */
export const markupOnCostPct = (p: Product) =>
  (p.markupMultiplier - 1) * 100;

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
  if (!m) return null;
  const lbs = parseFloat(m[1]);
  if (!isFinite(lbs) || lbs <= 0) return null;
  return `$${(p.ourPrice / lbs).toFixed(2)}/lb`;
};

// Unsplash photos — verified-resolving IDs. Swap any URL for your own
// product photography when you upload via the eventual Excel import.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  // ─── Vegetables & Cooking Staples ──────────────────────────────
  {
    id: "yellow-potatoes",
    slug: "yellow-potatoes",
    name: "Organic Yellow Potatoes",
    shortDescription: "Creamy, 3 lb bag",
    longDescription:
      "Creamy yellow-fleshed potatoes. Hold their shape boiled, fluff up roasted.",
    category: "Vegetables & Cooking Staples",
    image: "/products/yellow-potatoes.webp",
    unit: "3 lb bag",
    stock: 40,
    wholesalerPrice: 5.75,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 7.19,
    competitors: [
      { store: "Voila", price: 7.99, unit: "1.36 kg", url: "https://voila.ca/products/organic-potatoes-yellow-1-36-kg/472128EA", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Earth Fresh",
    organic: true,
  },
  {
    id: "tomatoes-on-the-vine",
    slug: "tomatoes-on-the-vine",
    name: "Organic Tomatoes on the Vine",
    shortDescription: "Greenhouse, 1.5 lb",
    longDescription:
      "Vine-ripened greenhouse tomatoes. Picked deep red, never gas-ripened.",
    category: "Vegetables & Cooking Staples",
    image: unsplash("1592924357228-91a4daadcfea"),
    unit: "4-6 count",
    stock: 40,
    wholesalerPrice: 5.44,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 6.8,
    competitors: [
      { store: "Voila", price: 8.99, unit: "4-6 count", url: "https://voila.ca/products/organic-tomatoes-on-the-vine-4-6-counts/1408309EA", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "english-cucumbers",
    slug: "english-cucumbers",
    name: "Organic English Cucumber",
    shortDescription: "Long, seedless",
    longDescription:
      "One long English cucumber — thin skin, almost seedless, crisp through the middle.",
    category: "Vegetables & Cooking Staples",
    image: "/products/english-cucumbers.jpg",
    unit: "1 count",
    stock: 45,
    wholesalerPrice: 2.0,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 2.5,
    competitors: [
      { store: "Voila", price: 2.99, unit: "1 ct", url: "https://voila.ca/products/organic-english-cucumber-1-count/129818EA", organic: true },
    ],
    brand: "Gen V",
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "carrots",
    slug: "carrots",
    name: "Organic Carrots",
    shortDescription: "Sweet, 2 lb bag",
    longDescription:
      "Two pounds of medium carrots — sweet, snappy, perfect for snacking, soups, or roasting.",
    category: "Vegetables & Cooking Staples",
    image: "/products/carrots.jpg",
    unit: "2 lb bag",
    stock: 40,
    wholesalerPrice: 3.08,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 3.86,
    competitors: [
      { store: "Voila", price: 5.99, unit: "908 g", url: "https://voila.ca/products/organic-carrots-908-g/112284EA", organic: true },
    ],
    brand: "Cal-Organic",
    supplierId: "pfennings-organic",
    organic: true,
  },
  {
    id: "romaine-lettuce",
    slug: "romaine-lettuce",
    name: "Organic Romaine Lettuce",
    shortDescription: "Hearts, 3 pack",
    longDescription:
      "Three crisp romaine hearts — the spine of a proper Caesar, hearty enough to grill.",
    category: "Vegetables & Cooking Staples",
    image: "/products/romaine-lettuce.webp",
    unit: "3 pack (340 g)",
    stock: 30,
    wholesalerPrice: 9.0,
    markupMultiplier: 1,
    ourPrice: 9.0,
    competitors: [
      { store: "Voila", price: 9.99, unit: "3 ct", url: "https://voila.ca/products/organic-romaine-hearts-3-count/414489EA", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Foxy",
    organic: true,
  },
  {
    id: "broccoli-crowns",
    slug: "broccoli-crowns",
    name: "Organic Broccoli Crowns",
    shortDescription: "Fresh, per crown",
    longDescription:
      "One fresh broccoli crown — florets with a short stem, ready to wash and break down for the pan.",
    category: "Vegetables & Cooking Staples",
    image: "/products/broccoli-crowns.avif",
    unit: "1 crown",
    stock: 30,
    wholesalerPrice: 3.29,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 4.11,
    competitors: [
      { store: "Voila", price: 9.99, unit: "1 ct", url: "https://voila.ca/products/organic-broccoli-1-count/112808EA", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },

  // ─── Fruits ────────────────────────────────────────────────────
  {
    id: "bananas",
    slug: "bananas",
    name: "Organic Bananas",
    shortDescription: "Just-ripe, 6-10 count",
    longDescription:
      "A bunch of bananas delivered at peak ripeness — not too green, not too spotted.",
    category: "Fruits",
    image: "/products/bananas.avif",
    unit: "6-10 count",
    stock: 60,
    wholesalerPrice: 2.76,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 3.45,
    competitors: [
      { store: "Voila", price: 3.79, unit: "6-10 count", url: "https://voila.ca/products/organic-bananas-bunch-6-10-count-ripe-in-3-4-days/833423EA", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Dole",
    organic: true,
  },
  {
    id: "gala-apples",
    slug: "gala-apples",
    name: "Organic Gala Apples",
    shortDescription: "Sweet, crisp, 3 lb",
    longDescription:
      "Three pounds of Gala apples — mild, sweet, and crisp. The everyday apple that pleases everyone.",
    category: "Fruits",
    image: unsplash("1619546813926-a78fa6372cd2"),
    unit: "3 lb bag",
    stock: 30,
    wholesalerPrice: 7.17,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 8.97,
    competitors: [
      { store: "Voila", price: 9.99, unit: "1.36 kg", url: "https://voila.ca/products/lil-snapper-organic-apples-gala-1-36-kg/674671EA", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "clementines",
    slug: "clementines",
    name: "Organic Clementines",
    shortDescription: "Easy-peel, 2 lb box",
    longDescription:
      "A 2 lb box of seedless clementines — small, sweet, easy to peel. The fruit kids actually eat.",
    category: "Fruits",
    image: "/products/clementines.webp",
    unit: "2 lb box (907 g)",
    stock: 30,
    wholesalerPrice: 5.87,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 7.34,
    competitors: [
      { store: "Voila", price: 8.49, unit: "907 g", url: "https://voila.ca/products/organic-clementine-907-g/265759EA", organic: true },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "strawberries",
    slug: "strawberries",
    name: "Organic Strawberries",
    shortDescription: "Sweet, 1 lb clamshell",
    longDescription:
      "A 1 lb clamshell of strawberries — picked ripe, kept cold until they reach you.",
    category: "Fruits",
    image: "/products/strawberries.png",
    unit: "1 lb clamshell (454 g)",
    stock: 30,
    wholesalerPrice: 7.25,
    markupMultiplier: DEFAULT_MARKUP_MULTIPLIER,
    ourPrice: 9.07,
    competitors: [
      { store: "Voila", price: 9.99, unit: "454 g", url: "https://voila.ca/products/organic-strawberries-454-g/14837EA", organic: true },
    ],
    supplierId: "terra-freska",
    brand: "Driscoll's",
    organic: true,
  },

  // ─── Beverages ─────────────────────────────────────────────────
  {
    id: "honey-soda",
    slug: "honey-soda",
    name: "Honey Soda™",
    shortDescription: "Wildflower honey, lightly sparkling, one can",
    longDescription:
      "Backed By Bees brew Honey Soda™ at their Burlington apiary from farm-fresh wildflower honey — no cane sugar, no added flavours or dyes. One 355 ml can: lightly sparkling, gluten-free, caffeine-free, about 80 calories. Every can helps fund the hives that pollinate Ontario farmland, including some of the fields behind our produce.",
    category: "Beverages",
    image: "https://backedbybees.com/cdn/shop/files/IMG_4691_edited_1200x.jpg",
    imageAlt: "Backed By Bees Honey Soda can",
    unit: "355 ml can",
    stock: 36,
    wholesalerPrice: 3.0,
    markupMultiplier: 1.5,
    ourPrice: 4.49,
    competitors: [
      { store: "Backed By Bees", price: 3.29, unit: "355 ml can", url: "https://backedbybees.com/products/honey-soda" },
      { store: "Whole Foods", price: 5.99, unit: "355 ml" },
      { store: "Farm Boy", price: 4.99, unit: "355 ml" },
    ],
    supplierId: "backed-by-bees",
    special: "Find",
  },

  // ─── Pantry (specials from neighbouring farms this drop) ───────
  {
    id: "raw-honey",
    slug: "raw-honey",
    name: "Raw Honey",
    shortDescription: "Hive to jar, unheated, 500 g",
    longDescription:
      "Backed By Bees raw honey goes straight from the hive to the jar — unheated, unfiltered, and never blended. Sourced from wildflower nectar across Halton Region; colour shifts with the season. Rich and spreadable when soft; crystallises naturally in the jar. Warm the closed jar in tap water to liquefy.",
    category: "Pantry",
    image: "https://backedbybees.com/cdn/shop/files/IMG_4274_edited_1200x.jpg",
    imageAlt: "Backed By Bees raw honey jar",
    unit: "500 g jar",
    stock: 24,
    wholesalerPrice: 10.0,
    markupMultiplier: 1.5,
    ourPrice: 14.99,
    competitors: [
      { store: "Backed By Bees", price: 11.99, unit: "500 g jar", url: "https://backedbybees.com/products/keepin-it-real-raw" },
      { store: "Whole Foods", price: 19.99, unit: "500 g" },
      { store: "Farm Boy", price: 16.99, unit: "500 g" },
    ],
    supplierId: "backed-by-bees",
    special: "Find",
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const categories = () =>
  Array.from(new Set(products.map((p) => p.category)));

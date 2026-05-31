// Product schema mirrors what an Excel/CSV upload will provide later.
// One row per SKU. `competitors` is open-ended so adding stores stays cheap.

export type CompetitorPrice = {
  store: string;
  price: number;
  unit: string;
  url?: string;
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
  ourPrice: number;
  wholesalerPrice: number;
  competitors: CompetitorPrice[];
  supplierId?: string;
  // The brand on the box at the wholesaler (e.g. Chiquita, Sunkist). Skip
  // for direct-from-farmer items or anything that ships unbranded.
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

export const margin = (p: Product) => p.ourPrice - p.wholesalerPrice;
export const marginPct = (p: Product) =>
  p.wholesalerPrice > 0 ? (margin(p) / p.ourPrice) * 100 : 0;

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
    name: "Yellow Potatoes",
    shortDescription: "Creamy, 3 lb bag",
    longDescription:
      "Creamy yellow-fleshed potatoes. Hold their shape boiled, fluff up roasted.",
    category: "Vegetables & Cooking Staples",
    image: "/products/yellow-potatoes.webp",
    unit: "3 lb bag",
    stock: 40,
    ourPrice: 7.19,
    wholesalerPrice: 5.75,
    competitors: [
      { store: "Voila", price: 7.99, unit: "1.36 kg", url: "https://voila.ca/products/organic-potatoes-yellow-1-36-kg/472128EA" },
    ],
    supplierId: "terra-freska",
    brand: "Earth Fresh",
    organic: true,
  },
  {
    id: "tomatoes-on-the-vine",
    slug: "tomatoes-on-the-vine",
    name: "Tomatoes on the Vine",
    shortDescription: "Greenhouse, 1.5 lb",
    longDescription:
      "Vine-ripened greenhouse tomatoes. Picked deep red, never gas-ripened.",
    category: "Vegetables & Cooking Staples",
    image: unsplash("1592924357228-91a4daadcfea"),
    unit: "4-6 count",
    stock: 40,
    ourPrice: 6.8,
    wholesalerPrice: 5.44,
    competitors: [
      { store: "Voila", price: 8.99, unit: "4-6 count", url: "https://voila.ca/products/organic-tomatoes-on-the-vine-4-6-counts/1408309EA" },
    ],
    supplierId: "terra-freska",
  },
  {
    id: "english-cucumbers",
    slug: "english-cucumbers",
    name: "English Cucumber",
    shortDescription: "Long, seedless",
    longDescription:
      "One long English cucumber — thin skin, almost seedless, crisp through the middle.",
    category: "Vegetables & Cooking Staples",
    image: "/products/english-cucumbers.jpg",
    unit: "1 count",
    stock: 45,
    ourPrice: 2.5,
    wholesalerPrice: 2.0,
    competitors: [
      { store: "Voila", price: 4.99, unit: "1 ct", url: "https://voila.ca/products/organic-english-cucumber-1-count/129818EA" },
    ],
    brand: "Gen V",
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "carrots",
    slug: "carrots",
    name: "Carrots",
    shortDescription: "Sweet, 2 lb bag",
    longDescription:
      "Two pounds of medium carrots — sweet, snappy, perfect for snacking, soups, or roasting.",
    category: "Vegetables & Cooking Staples",
    image: "/products/carrots.jpg",
    unit: "2 lb bag",
    stock: 40,
    ourPrice: 3.86,
    wholesalerPrice: 3.08,
    competitors: [
      { store: "Voila", price: 5.99, unit: "908 g", url: "https://voila.ca/products/organic-carrots-908-g/112284EA" },
    ],
    brand: "Cal-Organic",
    supplierId: "pfennings-organic",
    organic: true,
  },
  {
    id: "romaine-lettuce",
    slug: "romaine-lettuce",
    name: "Romaine Lettuce",
    shortDescription: "Hearts, 3 pack",
    longDescription:
      "Three crisp romaine hearts — the spine of a proper Caesar, hearty enough to grill.",
    category: "Vegetables & Cooking Staples",
    image: "/products/romaine-lettuce.webp",
    unit: "3 pack",
    stock: 30,
    ourPrice: 4.07,
    wholesalerPrice: 3.25,
    competitors: [
      { store: "Voila", price: 8.99, unit: "3 ct", url: "https://voila.ca/products/organic-romaine-hearts-3-count/414489EA" },
    ],
    supplierId: "terra-freska",
    organic: true,
  },
  {
    id: "broccoli-crowns",
    slug: "broccoli-crowns",
    name: "Broccoli Crowns",
    shortDescription: "Fresh, per crown",
    longDescription:
      "One fresh broccoli crown — florets with a short stem, ready to wash and break down for the pan.",
    category: "Vegetables & Cooking Staples",
    image: "/products/broccoli-crowns.avif",
    unit: "1 crown",
    stock: 30,
    ourPrice: 4.11,
    wholesalerPrice: 3.29,
    competitors: [
      { store: "Voila", price: 8.99, unit: "1 ct", url: "https://voila.ca/products/organic-broccoli-1-count/112808EA" },
    ],
    supplierId: "terra-freska",
    organic: true,
  },

  // ─── Fruits ────────────────────────────────────────────────────
  {
    id: "bananas",
    slug: "bananas",
    name: "Bananas",
    shortDescription: "Just-ripe, 6-10 count",
    longDescription:
      "A bunch of bananas delivered at peak ripeness — not too green, not too spotted.",
    category: "Fruits",
    image: "/products/bananas.avif",
    unit: "6-10 count",
    stock: 60,
    ourPrice: 3.45,
    wholesalerPrice: 2.76,
    competitors: [
      { store: "Voila", price: 3.79, unit: "6-10 count", url: "https://voila.ca/products/organic-bananas-bunch-6-10-count-ripe-in-3-4-days/833423EA" },
    ],
    supplierId: "terra-freska",
    brand: "Dole",
  },
  {
    id: "gala-apples",
    slug: "gala-apples",
    name: "Gala Apples",
    shortDescription: "Sweet, crisp, 3 lb",
    longDescription:
      "Three pounds of Gala apples — mild, sweet, and crisp. The everyday apple that pleases everyone.",
    category: "Fruits",
    image: unsplash("1619546813926-a78fa6372cd2"),
    unit: "3 lb bag",
    stock: 30,
    ourPrice: 8.97,
    wholesalerPrice: 7.17,
    competitors: [
      { store: "Voila", price: 8.99, unit: "1.36 kg", url: "https://voila.ca/products/lil-snapper-organic-apples-gala-1-36-kg/674671EA" },
    ],
    supplierId: "northrose-orchard",
  },
  {
    id: "clementines",
    slug: "clementines",
    name: "Clementines",
    shortDescription: "Easy-peel, 2 lb box",
    longDescription:
      "A 2 lb box of seedless clementines — small, sweet, easy to peel. The fruit kids actually eat.",
    category: "Fruits",
    image: "/products/clementines.webp",
    unit: "2 lb box (907 g)",
    stock: 30,
    ourPrice: 7.34,
    wholesalerPrice: 5.87,
    competitors: [
      { store: "Voila", price: 8.49, unit: "907 g", url: "https://voila.ca/products/organic-clementine-907-g/265759EA" },
    ],
    supplierId: "terra-freska",
  },
  {
    id: "strawberries",
    slug: "strawberries",
    name: "Strawberries",
    shortDescription: "Sweet, 1 lb clamshell",
    longDescription:
      "A 1 lb clamshell of strawberries — picked ripe, kept cold until they reach you.",
    category: "Fruits",
    image: "/products/strawberries.png",
    unit: "1 lb clamshell (454 g)",
    stock: 30,
    ourPrice: 9.07,
    wholesalerPrice: 7.25,
    competitors: [
      { store: "Voila", price: 9.99, unit: "454 g", url: "https://voila.ca/products/organic-strawberries-454-g/14837EA" },
    ],
    supplierId: "terra-freska",
    brand: "Driscoll's",
    organic: true,
  },

  // ─── Beverages ─────────────────────────────────────────────────
  {
    id: "honey-soda",
    slug: "honey-soda",
    name: "Honey Soda",
    shortDescription: "Sparkling, honey-sweetened, 355 ml",
    longDescription:
      "Backed By Bees brews this in Burlington from raw honey instead of cane sugar — sparkling, light, naturally sweet. One 355 ml glass bottle. Their hives also pollinate a chunk of the farmland our produce comes from.",
    category: "Beverages",
    image: "https://backedbybees.com/cdn/shop/files/IMG_4691_edited_1200x.jpg",
    unit: "355 ml bottle",
    stock: 36,
    ourPrice: 4.49,
    wholesalerPrice: 3.0,
    competitors: [
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
    shortDescription: "Unpasteurised, 500 g jar",
    longDescription:
      "Raw, unpasteurised honey from Backed By Bees' hives across the GTA — including a few that work the fields supplying our produce. Crystallises naturally; warm the jar in tap water to liquefy.",
    category: "Pantry",
    image: "https://backedbybees.com/cdn/shop/files/IMG_4274_edited_1200x.jpg",
    unit: "500 g jar",
    stock: 24,
    ourPrice: 14.99,
    wholesalerPrice: 10.0,
    competitors: [
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

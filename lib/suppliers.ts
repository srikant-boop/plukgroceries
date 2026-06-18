// Brand profiles for the curated Indian family pantry.

export type SupplierType =
  | "farmer"
  | "wholesaler"
  | "farmer-wholesaler"
  | "maker"
  | "brand";

export type SupplierLink = {
  label: string;
  href: string;
};

export type Supplier = {
  id: string;
  slug: string;
  name: string;
  type: SupplierType;
  tagline: string;
  story: string;
  discoverBlurb?: string;
  location?: string;
  image?: string;
  logo?: string;
  links: SupplierLink[];
};

export const suppliers: Supplier[] = [
  {
    id: "slurrp-farm",
    slug: "slurrp-farm",
    name: "Slurrp Farm",
    type: "brand",
    tagline: "Millet-based kids' foods · India",
    story:
      "Slurrp Farm makes millet-forward foods for babies and kids — cereals, noodles, dosa mixes, pancakes, and snacks. Founded by two mothers in India, the brand is widely known for using millets and ragi instead of refined flour in everyday formats families already buy.\n\nWe carry a short list of Slurrp Farm SKUs across product types — cereals, pancakes, noodles, and more — rather than stocking every flavour they make.",
    logo: "/suppliers/slurrp-farm.png",
    links: [{ label: "Website", href: "https://www.slurrpfarm.com/" }],
  },
  {
    id: "early-foods",
    slug: "early-foods",
    name: "Early Foods",
    type: "brand",
    tagline: "Traditional mixes for babies & toddlers · India",
    story:
      "Early Foods focuses on simple, traditional Indian foods for young children — khichdi mixes, porridges, and gentle staples many Indian families already cook at home.\n\nWe stock their rice and moong khichdi mix as our baby/toddler meal anchor — one SKU that covers lunch, dinner, and travel without filling the shelf with multiple porridge variants.",
    logo: "/suppliers/early-foods.png",
    links: [{ label: "Website", href: "https://www.earlyfoods.com/" }],
  },
  {
    id: "farmley",
    slug: "farmley",
    name: "Farmley",
    type: "brand",
    tagline: "Nuts, makhana & snacks · India",
    story:
      "Farmley is known in India for nuts, dry fruits, and roasted makhana (fox nuts) — the kind of shelf-stable snack many families keep for tea-time or travel.\n\nWe carry one roasted makhana SKU to cover the family snack occasion without turning PLUK into a full dry-fruit aisle.",
    logo: "/suppliers/farmley.png",
    links: [{ label: "Website", href: "https://farmley.com/" }],
  },
  {
    id: "timios",
    slug: "timios",
    name: "Timios",
    type: "brand",
    tagline: "Kids' snacks · India",
    story:
      "Timios makes finger foods and snacks designed for babies and toddlers — formats like melts that dissolve easily for young eaters learning to self-feed.\n\nWe carry one Melts variety pack as a test SKU. If families reorder it, it stays on the shelf; if not, we replace it with something that earns its place.",
    logo: "/suppliers/timios.svg",
    links: [
      {
        label: "Shop",
        href: "https://www.firstcry.com/timios",
      },
    ],
  },
];

export const getSupplier = (slug: string) =>
  suppliers.find((s) => s.slug === slug);

export const getSupplierById = (id: string) =>
  suppliers.find((s) => s.id === id);

export function supplierIntroLabel(supplier: Supplier): string | null {
  if (supplier.type === "brand") return `About ${supplier.name}`;
  if (supplier.type === "maker") return null;
  return `About ${supplier.name}`;
}

/** Brands we currently carry on the curated shelf. */
export const carriedBrands = () => suppliers;

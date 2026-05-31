// Supplier = who we bought the food from this week. Two flavours:
//   - "farmer"      a named grower we buy direct from
//   - "wholesaler"  a stall/distributor (e.g. the Ontario Food Terminal)
// Each supplier gets a /suppliers/{slug} profile page so customers can
// see who they're actually buying from.

export type SupplierType =
  | "farmer"
  | "wholesaler"
  | "farmer-wholesaler"
  | "maker"; // bakers, craft makers, artists — non-farm neighbours

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
  location?: string;
  image?: string;
  // Brand logo — local path under /public/suppliers/ (e.g. "/suppliers/foo.png").
  // Shown on the supplier profile page when present.
  logo?: string;
  links: SupplierLink[];
};

// Placeholder seed suppliers. Replace names, stories, and links with real
// ones as you sign each supplier up.
export const suppliers: Supplier[] = [
  {
    id: "terra-freska",
    slug: "terra-freska",
    name: "Terra Freska Produce",
    type: "wholesaler",
    tagline: "Rooted in freshness — organic wholesale, Woodbridge",
    story:
      "Terra Freska is a wholesale produce distributor specializing in organic fruit and vegetables, based in Woodbridge with a stall (#237) at the Ontario Food Terminal. They supply restaurants and independent grocers across the GTA. Items we buy from Terra Freska are picked up at the Terminal the morning of each drop, kept cold, and dropped to you within hours. When a product has its own brand on the box (Chiquita, Sunkist, etc.) we list that too — what you see is what we paid for.",
    location: "1 Royal Gate Blvd, Woodbridge, ON · OFT stall #237",
    logo: "/suppliers/terra-freska.png",
    links: [
      { label: "Website", href: "https://www.terrafreska.com" },
      { label: "Instagram @rootedinfreshness", href: "https://www.instagram.com/rootedinfreshness/" },
    ],
  },
  {
    id: "northrose-orchard",
    slug: "northrose-orchard",
    name: "Northrose Orchard",
    type: "farmer",
    tagline: "Family apple orchard, Niagara escarpment",
    story:
      "Northrose has been growing Galas, Honeycrisps, and Ambrosias on the Niagara escarpment for two generations. We pick up cold-stored bins direct from the orchard and pass them on the same week — no warehousing in between.",
    location: "Vineland, ON",
    links: [
      { label: "Website", href: "https://example.com" },
      { label: "Instagram", href: "https://instagram.com/example" },
    ],
  },
  {
    id: "forest-glen-berries",
    slug: "forest-glen-berries",
    name: "Forest Glen Berries",
    type: "farmer",
    tagline: "Ontario strawberries, in season only",
    story:
      "A small berry farm we work with from June through September. When their strawberries are in, we list them; the rest of the year strawberries come from Terra Freska so the page stays honest about origin.",
    location: "Beamsville, ON",
    links: [
      { label: "Instagram", href: "https://instagram.com/example" },
    ],
  },
  {
    id: "pfennings-organic",
    slug: "pfennings-organic",
    name: "Pfenning's Organic Farms",
    type: "farmer-wholesaler",
    tagline: "Community Enriched Agriculture — New Hamburg since 1981",
    story:
      "Pfenning's grow over 700 acres of certified-organic vegetables in New Hamburg, and also pack, import, and distribute organic produce from a network of other growers year-round. Family-run since 1981, with a compliance team that manages their own organic certification and monitors every vendor they work with. We use them for the items where certified-organic is worth the small premium — leafy greens, peppers, and roots.",
    location: "1209 Waterloo Street, New Hamburg, ON",
    logo: "/suppliers/pfennings-organic.png",
    links: [
      { label: "Website", href: "https://pfenningsfarms.ca" },
      { label: "Instagram @pfenningsfarm", href: "https://www.instagram.com/pfenningsfarm/" },
      { label: "Facebook", href: "https://www.facebook.com/pfenningsfarm" },
    ],
  },
  {
    id: "backed-by-bees",
    slug: "backed-by-bees",
    name: "Backed By Bees",
    type: "farmer",
    tagline: "Burlington beekeepers — \"Good for you. Good for nature too.\"",
    story:
      "Backed By Bees keep hives across the GTA and turn the honey into raw jars, mead, and their signature Honey Soda™ — sparkling and sweetened with honey instead of cane sugar. Their hives pollinate around 32,000 acres of Ontario farmland, including a few we buy produce from. They're our neighbours in Burlington, ten minutes up the QEW.",
    location: "Burlington, ON",
    logo: "/suppliers/backed-by-bees.jpg",
    links: [
      { label: "Website", href: "https://www.backedbybees.com" },
      { label: "Instagram @backedbybees", href: "https://www.instagram.com/backedbybees/" },
      { label: "Facebook", href: "https://www.facebook.com/backedbybees/" },
    ],
  },
];

export const getSupplier = (slug: string) =>
  suppliers.find((s) => s.slug === slug);

export const getSupplierById = (id: string) =>
  suppliers.find((s) => s.id === id);

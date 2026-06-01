// Supplier = who we bought the food from this week. Two flavours:
//   - "farmer"      a named grower we buy direct from
//   - "wholesaler"  a stall/distributor (e.g. the Ontario Food Terminal)
// Each supplier gets a /suppliers/{slug} profile page so customers can
// see who you're actually buying from.

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
  /** Short intro on Discover product pages — we’re introducing them. Factual only. */
  discoverBlurb?: string;
  location?: string;
  image?: string;
  // Brand logo — local path under /public/suppliers/ (e.g. "/suppliers/foo.png").
  // Shown on the supplier profile page when present.
  logo?: string;
  links: SupplierLink[];
};

export const suppliers: Supplier[] = [
  {
    id: "terra-freska",
    slug: "terra-freska",
    name: "Terra Freska Produce",
    type: "wholesaler",
    tagline: "Organic wholesale · Ontario Food Terminal, stall #237",
    story:
      "Most of the produce in our shop moves through Terra Freska — a Woodbridge wholesaler with a permanent stall at the Ontario Food Terminal (#237). They sell certified-organic fruit and vegetables to restaurants and independent grocers across the GTA.\n\nWhen Terra Freska is on a product page, that’s where we bought it that week. If the case shows a brand name, we keep it in our records even when it isn’t on the storefront.",
    location: "1 Royal Gate Blvd, Woodbridge, ON · OFT stall #237",
    logo: "/suppliers/terra-freska.png",
    links: [
      { label: "Website", href: "https://www.terrafreska.com" },
      {
        label: "Instagram @rootedinfreshness",
        href: "https://www.instagram.com/rootedinfreshness/",
      },
    ],
  },
  {
    id: "northrose-orchard",
    slug: "northrose-orchard",
    name: "Northrose Orchard",
    type: "farmer",
    tagline: "Apple orchard · Niagara escarpment",
    story:
      "We’d like you to meet Northrose Orchard — Galas, Honeycrisps, and Ambrosias on the Niagara escarpment, a family orchard for two generations. When cold-stored bins direct from the farm beat the terminal on price, we buy there and get them to your pickup window within the week.\n\nOtherwise our apples come through Terra Freska and we say so on the product page. No warehouse sit: orchard to you within the week when we go direct.",
    location: "Vineland, ON",
    links: [],
  },
  {
    id: "forest-glen-berries",
    slug: "forest-glen-berries",
    name: "Forest Glen Berries",
    type: "farmer",
    tagline: "Strawberries · Beamsville, in season",
    story:
      "Meet Forest Glen Berries — a small Beamsville farm we work with from June through September. When their strawberries are in, we list them as a Find.\n\nOff-season strawberries in the catalogue come from Terra Freska at the terminal. We’d rather say that plainly than blur where your food came from.",
    location: "Beamsville, ON",
    links: [],
  },
  {
    id: "pfennings-organic",
    slug: "pfennings-organic",
    name: "Pfenning's Organic Farms",
    type: "farmer-wholesaler",
    tagline: "Certified organic · New Hamburg since 1981",
    discoverBlurb:
      "Meet Pfenning’s — a New Hamburg family farming certified organic since 1981. Seven hundred acres of their own vegetables, plus a network of growers they pack and distribute year-round.",
    story:
      "We’d like to introduce Pfenning’s Organic Farms — family-run in New Hamburg since 1981, with more than 700 acres of certified-organic vegetables and a distribution network they audit themselves.\n\nWe reach for Pfenning’s when certified organic is worth the small premium on the item — carrots, peppers, roots — and the terminal price lines up. Same pickup-day cold chain as everything else we haul from the terminal.",
    location: "1209 Waterloo Street, New Hamburg, ON",
    logo: "/suppliers/pfennings-organic.png",
    links: [
      { label: "Website", href: "https://pfenningsfarms.ca" },
      {
        label: "Instagram @pfenningsfarm",
        href: "https://www.instagram.com/pfenningsfarm/",
      },
      { label: "Facebook", href: "https://www.facebook.com/pfenningsfarm" },
    ],
  },
  {
    id: "backed-by-bees",
    slug: "backed-by-bees",
    name: "Backed By Bees",
    type: "maker",
    tagline: "Burlington apiary · \"Good for you. Good for nature too.\"",
    discoverBlurb:
      "This drop we’re introducing Backed By Bees — a Burlington apiary with a farm store on Appleby Line. They jar raw honey and make Honey Soda™, lightly sparkling and sweetened with wildflower honey.",
    story:
      "We’d like you to meet Backed By Bees. They keep hives across the GTA and run a farm store at 6214 Appleby Line in Burlington. Honey is bottled raw — unheated and unfiltered. Honey Soda™ is their own recipe: light sparkle, wildflower honey, nothing fussy.",
    location: "6214 Appleby Line, Burlington, ON",
    logo: "/suppliers/backed-by-bees.jpg",
    links: [
      { label: "Website", href: "https://www.backedbybees.com" },
      {
        label: "Instagram @backedbybees",
        href: "https://www.instagram.com/backedbybees/",
      },
      { label: "Facebook", href: "https://www.facebook.com/backedbybees/" },
    ],
  },
];

export const getSupplier = (slug: string) =>
  suppliers.find((s) => s.slug === slug);

export const getSupplierById = (id: string) =>
  suppliers.find((s) => s.id === id);

/** Eyebrow for intro copy — warm for farmers/makers, neutral for wholesalers. */
export function supplierIntroLabel(supplier: Supplier): string {
  if (supplier.type === "wholesaler") return `About ${supplier.name}`;
  return `Meet ${supplier.name}`;
}

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
      "Terra Freska is a Woodbridge wholesaler with a permanent stall at the Ontario Food Terminal — stall #237. They built their name on certified-organic fruit and vegetables, buying from growers and supplying restaurants and small grocers across the GTA.\n\nEarly mornings at the terminal, their team is grading, packing, and moving what came in overnight. The kind of operation small shops rely on when they want organic produce without the long warehouse chain.",
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
    discoverBlurb:
      "Meet Northrose Orchard — a family apple farm on the Niagara escarpment, two generations in. Galas, Honeycrisps, and Ambrosias from the same slopes they've tended for years.",
    story:
      "Northrose is a family orchard on the Niagara escarpment — two generations growing Galas, Honeycrisps, and Ambrosias on the same land. When their cold-stored bins are the right pick that week, we drive out to Vineland and bring them straight to your pickup window.\n\nWhen we can't go direct, we're plain about it: those apples came through Terra Freska instead. Either way, orchard to you without a long warehouse sit.",
    location: "Vineland, ON",
    links: [],
  },
  {
    id: "forest-glen-berries",
    slug: "forest-glen-berries",
    name: "Forest Glen Berries",
    type: "farmer",
    tagline: "Strawberries · Beamsville, in season",
    discoverBlurb:
      "Meet Forest Glen Berries — a small Beamsville farm we look forward to every summer. When their strawberries are in, they're the kind of Find worth telling you about.",
    story:
      "Picture a small strawberry patch in Beamsville — that's Forest Glen. From June through September they're who we call when the berries are red and worth sharing as a Find.\n\nOff-season strawberries on our list come through Terra Freska at the terminal. We'd rather tell you that than pretend every pint came off the same field.",
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
      "Meet the Pfennings — a New Hamburg family growing certified organic since 1981. More than 700 acres under their care, and a circle of growers they pack and stand behind through every season.",
    story:
      "The Pfennings have been in New Hamburg since 1981 — a family on land they've kept certified organic from the start. More than 700 acres of vegetables under their own care, and they pack and distribute for other organic growers they know and audit themselves.\n\nWhen our carrots or roots carry their name, it's because we trust how they grow and how they handle food. Good people, good dirt, the kind of farm we're happy to put in front of you.",
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
    tagline: "Farm store on Appleby Line · Burlington",
    discoverBlurb:
      "A farm store on Appleby Line — raw honey and their own Honey Soda.",
    story:
      "There is a farm store on Appleby Line in Burlington, about ten minutes up the QEW — Backed By Bees. They tend hives across the GTA.\n\nThe honey is never heated or filtered. Each jar tastes like what was blooming that season, so no two are quite the same.\n\nThey also make Honey Soda — a gentle fizz, sweetened with their wildflower honey.",
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

/** Optional eyebrow above supplier story — omitted for makers (name in H1 is enough). */
export function supplierIntroLabel(supplier: Supplier): string | null {
  if (supplier.type === "maker") return null;
  return `About ${supplier.name}`;
}

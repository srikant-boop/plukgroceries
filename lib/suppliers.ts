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
      "Terra Freska is a Woodbridge-based produce wholesaler with a permanent stall at the Ontario Food Terminal. They specialize in certified-organic fruit and vegetables for restaurants and independent grocers across the GTA — the same cases you'd see on a chef's loading dock, sold by the case or half-case.\n\nFor Pluk drops we buy from Terra Freska the morning of pickup: inspect on the floor, load cold, and run straight to the community handoff. Most of the organic produce in this week's catalogue came through their stall. When the box shows a brand (Earth Fresh, Foxy, Dole), that's what's on the case — we pass the name through so you know what you're getting.",
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
      "Northrose grows Galas, Honeycrisps, and Ambrosias on the Niagara escarpment — a family orchard for two generations. When we can get cold-stored bins direct from the farm at a price that beats the terminal, we do; otherwise apples in the shop come through Terra Freska and we say so on the product page.\n\nNo warehouse sit: orchard to our pickup window within the week.",
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
      "A small berry farm in Beamsville we work with from June through September. When their strawberries are in, we list them as a Find; off-season strawberries in the catalogue come from Terra Freska at the terminal so we're never vague about origin.",
    location: "Beamsville, ON",
    links: [],
  },
  {
    id: "pfennings-organic",
    slug: "pfennings-organic",
    name: "Pfenning's Organic Farms",
    type: "farmer-wholesaler",
    tagline: "Certified organic · New Hamburg since 1981",
    story:
      "Pfenning's farm more than 700 acres of certified-organic vegetables in New Hamburg and also pack, import, and distribute organic produce from a network of growers year-round. Family-run since 1981, with their own compliance team managing certification and auditing every vendor they handle.\n\nWe reach for Pfenning's when certified-organic is worth the small premium on the item — carrots, peppers, roots — and the terminal price lines up. Same cold-chain story as Terra Freska: bought wholesale, dropped to you the same day we pick up.",
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
    story:
      "Backed By Bees keep hives across the GTA and run a farm store on Appleby Line in Burlington — about ten minutes up the QEW from Oakville. Honey goes from hive to jar without heating or blending; they also brew Honey Soda™, a lightly sparkling drink sweetened with wildflower honey instead of cane sugar.\n\nTheir bees pollinate roughly 32,000 acres of Ontario farmland each season, including fields that grow produce we buy for Pluk. When we have a batch from the farm, we list it as a Find: neighbour pick, same price they charge us — no markup.\n\nFarm store: 6214 Appleby Line. Shop the full honey-and-hive line at backedbybees.com.",
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

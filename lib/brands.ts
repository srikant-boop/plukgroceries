// Brands appear on the wholesaler items (Bananas: Chiquita, Strawberries:
// Driscoll's, Yellow Potatoes: Earth Fresh, English Cucumber: Gen V, etc).
// When a brand has an
// entry here, the brand name on the product detail page links to its
// brand page. Brands without an entry are shown as plain text.

export type BrandLink = {
  label: string;
  href: string;
};

export type Brand = {
  slug: string;
  name: string;
  tagline?: string;
  story: string;
  location?: string;
  logo?: string;
  links: BrandLink[];
};

// Match the brand-name string on Product to a slug we can look up.
export const brandSlug = (brandName: string) =>
  brandName
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const brands: Brand[] = [
  {
    slug: "dole",
    name: "Dole",
    tagline: "Global produce since 1851",
    story:
      "Dole plc traces back to 1851, when Castle & Cooke was founded in Hawaii. Today it's one of the world's largest fresh produce companies, headquartered in Dublin, Ireland after its 2021 merger with Total Produce. Best known for bananas and pineapples, Dole supplies ~300 products across 75 countries with around 38,500 staff. We carry their bananas when the price and quality beat the local options for the week.",
    location: "Dublin, Ireland (global ops)",
    logo: "/brands/dole.png",
    links: [
      { label: "Website", href: "https://www.dole.com" },
      { label: "Instagram", href: "https://www.instagram.com/dole/" },
    ],
  },
  {
    slug: "earth-fresh",
    name: "Earth Fresh",
    tagline: "Real. Good. — North American potato grower since 1963",
    story:
      "EarthFresh Foods has been growing and packing potatoes across North America since 1963. They run nine facilities in Canada and the US and supply both retail and foodservice with conventional and organic potatoes — from creamy yellows to bakers. Their organic Canadian yellow potatoes are what we usually stock.",
    location: "Burlington, ON (Canadian HQ)",
    logo: "/brands/earth-fresh.svg",
    links: [
      { label: "Website", href: "https://earthfreshfoods.com" },
      { label: "Instagram", href: "https://www.instagram.com/earthfresh/" },
      { label: "Facebook", href: "https://www.facebook.com/earthfresh" },
    ],
  },
  {
    slug: "gen-v",
    name: "Gen V",
    tagline: "Eat true to your values — Quebec greenhouse produce",
    story:
      "Cultures Gen V is a family-run Canadian greenhouse grower with more than 360,000 square metres across St-Jérôme, Portneuf, Sainte-Clotilde, and Ham-Nord, Quebec. Formerly Hydroserre, the Terrault family took over in 2008 and rebranded as Gen V in 2023. They grow organic English cucumbers, mini cucumbers, peppers, tomatoes, and hydroponic lettuce year-round — supplying Eastern Canada and the US from greenhouses near major city centres.",
    location: "Sainte-Clotilde, Quebec",
    logo: "/brands/gen-v.svg",
    links: [
      { label: "Website", href: "https://gen-v.com/en" },
      { label: "Instagram", href: "https://www.instagram.com/culturesgenv/" },
    ],
  },
  {
    slug: "driscolls",
    name: "Driscoll's",
    tagline: "Only the finest berries — since 1872",
    story:
      "Driscoll's is the world's largest fresh berry company, with a 150-year history of family farming that began with the Reiter and Driscoll families in California's Pajaro Valley. They specialise in proprietary berry varieties grown by independent farmers across the Americas and Europe. We carry their organic strawberries when the local berry season isn't running.",
    location: "Watsonville, California",
    logo: undefined, // add when we have a clean logo file
    links: [
      { label: "Website", href: "https://www.driscolls.com" },
      { label: "Instagram", href: "https://www.instagram.com/driscollsberry/" },
    ],
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getBrandByName = (name: string) => getBrand(brandSlug(name));

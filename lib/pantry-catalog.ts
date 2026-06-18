/** Extended pantry fields — compliance-safe copy from official sources where noted. */
export type PantryMeta = {
  roleLine: string;
  audience: string[];
  occasions: string[];
  /** Max 3 shown on cards; full list on PDP */
  badges: string[];
  whySelected: string;
  ingredients: string;
  allergens: string;
  nutritionHighlights: string;
  preparation: string;
  storage: string;
  countryOfOrigin: string;
  suggestedAge?: string;
  sourceUrl: string;
  gallery?: string[];
};

export type PantryProduct = {
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
  competitors: [];
  supplierId?: string;
  brand?: string;
  origin?: string;
  pantry: PantryMeta;
  collection: PantryCollection;
};

export type PantryCollection =
  | "baby-toddler-meals"
  | "kids-breakfast"
  | "quick-meals"
  | "tea-time-snacks";

export const PANTRY_COLLECTIONS: {
  slug: PantryCollection;
  title: string;
  navLabel: string;
}[] = [
  { slug: "baby-toddler-meals", title: "Baby & Toddler Meals", navLabel: "Baby & Toddler" },
  { slug: "kids-breakfast", title: "Kids Breakfast", navLabel: "Kids Breakfast" },
  { slug: "quick-meals", title: "Quick Meals", navLabel: "Quick Meals" },
  { slug: "tea-time-snacks", title: "Tea-Time & Snacks", navLabel: "Snacks" },
];

const P = (cost: number, price: number) => ({
  wholesalerPrice: cost,
  markupMultiplier: price / cost,
  ourPrice: price,
});

/** Placeholder landed costs — update when final import pricing is set. */
export const pantryProducts: PantryProduct[] = [
  {
    uuid: "a1000001-0000-4000-8000-000000000001",
    id: "early-foods-rice-moong-khichdi",
    slug: "early-foods-rice-moong-khichdi",
    name: "Rice & Moong Khichdi Mix",
    shortDescription: "Baby/toddler khichdi — lunch, dinner, travel, or comfort meal.",
    longDescription:
      "A simple rice and moong dal khichdi mix from Early Foods — the kind of gentle Indian meal many families reach for when they want something familiar and easy to prepare.",
    category: "Baby & Toddler Meals",
    collection: "baby-toddler-meals",
    image: "/products/pantry/early-foods-rice-moong-khichdi.png",
    imageAlt: "Early Foods Rice and Moong Khichdi Mix package",
    unit: "200 g pouch",
    stock: 40,
    ...P(6.5, 8.99),
    competitors: [],
    supplierId: "early-foods",
    brand: "Early Foods",
    origin: "India",
    pantry: {
      roleLine: "Gentle khichdi for baby or toddler meals at home or on the go.",
      audience: ["Baby/Toddler", "Parents"],
      occasions: ["Lunch/Dinner", "Quick Meal", "Travel-Friendly"],
      badges: ["Baby/Toddler", "Travel-Friendly", "Quick Meal"],
      whySelected:
        "Khichdi is a staple comfort food for many Indian families. Early Foods focuses on simple mixes for young children, and this SKU covers an everyday lunch or dinner use case without adding multiple porridge variants to the shelf.",
      ingredients:
        "Refer to the official product label. Typical khichdi mixes include rice, moong dal (split green gram), and spices suited for young children — verify the exact list on package.",
      allergens:
        "Check the package label for allergen statements. May contain traces depending on manufacturing facility.",
      nutritionHighlights:
        "Made with rice and moong dal. Refer to the nutrition facts panel on the package for per-serving values.",
      preparation:
        "Follow package directions: usually simmer with water until soft and porridge-like. Adjust consistency for your child's age and texture preference.",
      storage: "Store in a cool, dry place. Reseal after opening.",
      countryOfOrigin: "India",
      suggestedAge: "See package for age or stage guidance.",
      sourceUrl: "https://www.earlyfoods.com/products/rice-moong-khichdi-mix-200g",
      gallery: ["/products/pantry/early-foods-rice-moong-khichdi.png"],
    },
  },
  {
    uuid: "a1000002-0000-4000-8000-000000000002",
    id: "slurrp-farm-strawberry-ragi-cereal",
    slug: "slurrp-farm-strawberry-ragi-cereal",
    name: "Strawberry, Ragi & Rice Cereal with Milk",
    shortDescription: "Baby/toddler breakfast cereal with ragi and strawberry.",
    longDescription:
      "A ragi and rice cereal from Slurrp Farm with strawberry — designed as an easy breakfast option for babies and toddlers when you want something beyond plain rice cereal.",
    category: "Baby & Toddler Meals",
    collection: "baby-toddler-meals",
    image: "/products/pantry/slurrp-farm-strawberry-ragi-cereal.jpg",
    imageAlt: "Slurrp Farm Strawberry Ragi and Rice Cereal with Milk",
    unit: "200 g",
    stock: 40,
    ...P(7.0, 9.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Warm or cold cereal-style breakfast for babies and toddlers.",
      audience: ["Baby/Toddler"],
      occasions: ["Breakfast"],
      badges: ["Baby/Toddler", "Breakfast", "Ragi"],
      whySelected:
        "Slurrp Farm is a trusted name for millet-based kids' foods in India. This cereal covers the baby breakfast occasion with ragi — a familiar grain for many Indian families — in a single SKU.",
      ingredients:
        "Refer to the official Slurrp Farm product page and package label for the full ingredient list.",
      allergens: "Contains milk ingredients per product formulation. Check label for full allergen info.",
      nutritionHighlights:
        "Made with ragi and rice. See package nutrition panel for vitamins, minerals, and sugar content.",
      preparation:
        "Mix with warm water, milk, or as directed on the package to desired consistency.",
      storage: "Cool, dry place. Use within recommended time after opening.",
      countryOfOrigin: "India",
      suggestedAge: "See package for recommended age or stage.",
      sourceUrl: "https://www.slurrpfarm.com/products/no-refined-sugar-strawberry-ragi-rice-cereal",
      gallery: ["/products/pantry/slurrp-farm-strawberry-ragi-cereal.jpg"],
    },
  },
  {
    uuid: "a1000003-0000-4000-8000-000000000003",
    id: "slurrp-farm-millet-pancake-chocolate",
    slug: "slurrp-farm-millet-pancake-chocolate",
    name: "Millet Pancake Mix — Chocolate Supergrains",
    shortDescription: "Weekend or weekday breakfast pancakes for kids and family.",
    longDescription:
      "A chocolate millet pancake mix from Slurrp Farm — quick to make and popular as a kids' breakfast or relaxed family morning meal.",
    category: "Kids Breakfast",
    collection: "kids-breakfast",
    image: "/products/pantry/slurrp-farm-millet-pancake-chocolate.jpg",
    imageAlt: "Slurrp Farm Millet Pancake Chocolate Supergrains mix",
    unit: "150 g",
    stock: 35,
    ...P(6.0, 8.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Millet pancakes for kids' breakfast or a family weekend treat.",
      audience: ["Kids", "Family"],
      occasions: ["Breakfast"],
      badges: ["Kids", "Breakfast", "Millet"],
      whySelected:
        "Pancakes are an easy win for busy mornings. This mix uses millets and supergrains instead of a typical refined-flour pancake — one breakfast SKU that covers kids and parents eating together.",
      ingredients: "See official Slurrp Farm listing and package for full ingredients.",
      allergens: "Check package for wheat, milk, nut, and other allergen statements.",
      nutritionHighlights: "Made with millets and supergrains. Refer to package nutrition facts.",
      preparation: "Mix with water or milk per package instructions; cook on a griddle or pan.",
      storage: "Store sealed in a cool, dry place.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-pancake-choclate-and-supergrains",
      gallery: ["/products/pantry/slurrp-farm-millet-pancake-chocolate.jpg"],
    },
  },
  {
    uuid: "a1000004-0000-4000-8000-000000000004",
    id: "slurrp-farm-choco-crunch-ragi-cereal",
    slug: "slurrp-farm-choco-crunch-ragi-cereal",
    name: "Choco Crunch Ragi Stars & Moons Cereal",
    shortDescription: "Kids breakfast cereal — with milk or as a dry snack.",
    longDescription:
      "A chocolate-flavoured ragi cereal from Slurrp Farm shaped for kids — works in a bowl with milk or as a portable snack.",
    category: "Kids Breakfast",
    collection: "kids-breakfast",
    image: "/products/pantry/slurrp-farm-choco-crunch-ragi-cereal.jpg",
    imageAlt: "Slurrp Farm Choco Crunch Ragi Stars and Moons Cereal",
    unit: "250 g",
    stock: 35,
    ...P(6.5, 8.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Kid-friendly cereal for breakfast bowls or lunchbox snacking.",
      audience: ["Kids"],
      occasions: ["Breakfast", "Snack"],
      badges: ["Kids", "Breakfast", "Ragi"],
      whySelected:
        "Many families want a cereal option that feels familiar to kids but uses better grains. This is our one kids' cereal SKU — ragi-based, without stocking multiple flavours.",
      ingredients: "See Slurrp Farm product page and package label.",
      allergens: "Check label for gluten, milk, and other allergens.",
      nutritionHighlights: "Made with ragi and jowar per product formulation. See nutrition panel on package.",
      preparation: "Serve with cold or warm milk, or eat dry as a snack.",
      storage: "Cool, dry place; reseal bag after opening.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-crunch-cereal-chocolate-stars-and-moons-healthy-millet-breakfast-300-gm",
      gallery: ["/products/pantry/slurrp-farm-choco-crunch-ragi-cereal.jpg"],
    },
  },
  {
    uuid: "a1000005-0000-4000-8000-000000000005",
    id: "slurrp-farm-millet-noodles-masala",
    slug: "slurrp-farm-millet-noodles-masala",
    name: "Millet Noodles — Classic Masala",
    shortDescription: "Quick millet noodles for kids and family lunch or dinner.",
    longDescription:
      "Classic masala millet noodles from Slurrp Farm — a familiar quick-meal format many Indian-Canadian families already know, with millet instead of refined wheat noodles.",
    category: "Quick Meals",
    collection: "quick-meals",
    image: "/products/pantry/slurrp-farm-millet-noodles-masala.jpg",
    imageAlt: "Slurrp Farm Millet Noodles Classic Masala",
    unit: "192 g",
    stock: 50,
    ...P(5.5, 7.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Fast masala noodles for kids or the whole family.",
      audience: ["Kids", "Family"],
      occasions: ["Lunch/Dinner", "Quick Meal"],
      badges: ["Kids", "Quick Meal", "Millet"],
      whySelected:
        "Instant noodles are a real use case in busy households. We carry one millet-based masala noodle — a cleaner alternative to typical maida noodles, without filling the shelf with flavours.",
      ingredients: "See package and Slurrp Farm listing for noodles, seasoning, and oil content.",
      allergens: "Check label for gluten, soy, and other allergens.",
      nutritionHighlights: "Made with millet. See package for fat, sodium, and per-serving nutrition.",
      preparation: "Boil noodles, drain, mix with masala seasoning per package directions.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/classic-masala-serves-2-96-gms",
      gallery: ["/products/pantry/slurrp-farm-millet-noodles-masala.jpg"],
    },
  },
  {
    uuid: "a1000006-0000-4000-8000-000000000006",
    id: "slurrp-farm-millet-dosa-spinach",
    slug: "slurrp-farm-millet-dosa-spinach",
    name: "Millet Dosa — Spinach Supergrains",
    shortDescription: "Instant dosa mix for breakfast, lunch, or light dinner.",
    longDescription:
      "Spinach millet dosa mix from Slurrp Farm — pour-and-cook dosas without starting from scratch, useful for Indian breakfasts or a light evening meal.",
    category: "Quick Meals",
    collection: "quick-meals",
    image: "/products/pantry/slurrp-farm-millet-dosa-spinach.jpg",
    imageAlt: "Slurrp Farm Millet Dosa Spinach Supergrains mix",
    unit: "150 g",
    stock: 40,
    ...P(5.5, 7.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Spinach millet dosas without grinding batter from scratch.",
      audience: ["Kids", "Family"],
      occasions: ["Breakfast", "Lunch/Dinner"],
      badges: ["Family", "Millet", "Quick Meal"],
      whySelected:
        "Dosa is a core Indian breakfast. This mix covers that occasion with millets and spinach in one SKU — faster than homemade batter on a weekday.",
      ingredients: "See official product listing for millet flours, spinach, and seasonings.",
      allergens: "Check package allergen statement.",
      nutritionHighlights: "Made with millets and spinach. Refer to package nutrition facts.",
      preparation: "Mix batter per instructions; spread on hot tawa and cook until crisp.",
      storage: "Cool, dry storage; use within time recommended after opening.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-dosa-supergrains-and-spinach",
      gallery: ["/products/pantry/slurrp-farm-millet-dosa-spinach.jpg"],
    },
  },
  {
    uuid: "a1000007-0000-4000-8000-000000000007",
    id: "slurrp-farm-macaroni-pasta",
    slug: "slurrp-farm-macaroni-pasta",
    name: "Macaroni Pasta",
    shortDescription: "Kids' pasta for lunch or dinner — sauce it your way.",
    longDescription:
      "Macaroni pasta from Slurrp Farm for simple kids' meals — boil, add sauce or cheese, and serve.",
    category: "Quick Meals",
    collection: "quick-meals",
    image: "/products/pantry/slurrp-farm-macaroni-pasta.jpg",
    imageAlt: "Slurrp Farm Macaroni Pasta",
    unit: "400 g",
    stock: 40,
    ...P(6.0, 8.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Everyday macaroni for kids' pasta nights.",
      audience: ["Kids", "Family"],
      occasions: ["Lunch/Dinner", "Quick Meal"],
      badges: ["Kids", "Quick Meal", "Family"],
      whySelected:
        "Pasta is a weekly staple in many homes. We stock one macaroni shape from Slurrp Farm — enough for lunchboxes and quick dinners without a wall of pasta SKUs.",
      ingredients: "See package for flour type and full ingredient list.",
      allergens: "Check label for gluten and other allergens.",
      nutritionHighlights: "See package nutrition panel.",
      preparation: "Boil in salted water until tender; drain and serve with sauce or vegetables.",
      storage: "Cool, dry place.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/macaroni-pasta",
      gallery: ["/products/pantry/slurrp-farm-macaroni-pasta.jpg"],
    },
  },
  {
    uuid: "a1000008-0000-4000-8000-000000000008",
    id: "slurrp-farm-choco-ragi-cookies",
    slug: "slurrp-farm-choco-ragi-cookies",
    name: "Choco Ragi Cookies",
    shortDescription: "Tiffin, tea-time, or after-school snack.",
    longDescription:
      "Chocolate ragi cookies from Slurrp Farm — a shelf-stable snack for lunchboxes, tea-time, or travel.",
    category: "Tea-Time & Snacks",
    collection: "tea-time-snacks",
    image: "/products/pantry/slurrp-farm-choco-ragi-cookies.jpg",
    imageAlt: "Slurrp Farm Choco Ragi Cookies",
    unit: "75 g",
    stock: 45,
    ...P(4.0, 5.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Ragi cookies for tiffin, tea-time, or the car ride home.",
      audience: ["Kids", "Family"],
      occasions: ["Snack", "Tea-Time", "Travel-Friendly"],
      badges: ["Kids", "Snack", "Ragi"],
      whySelected:
        "We carry one cookie SKU — choco ragi — instead of a wall of flavours. It covers school snack and family tea-time without turning PLUK into a biscuit aisle.",
      ingredients: "See Slurrp Farm package for flours, cocoa, sweeteners, and fats used.",
      allergens: "Check label for wheat, milk, nuts, and soy.",
      nutritionHighlights: "Made with ragi. See package for sugar and per-cookie nutrition.",
      preparation: "Ready to eat.",
      storage: "Store sealed; consume by best-before date on package.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.slurrpfarm.com/products/the-good-cookie-tasty-no-maida-no-refined-sugar-choco-ragi-cookie",
      gallery: ["/products/pantry/slurrp-farm-choco-ragi-cookies.jpg"],
    },
  },
  {
    uuid: "a1000009-0000-4000-8000-000000000009",
    id: "farmley-makhana",
    slug: "farmley-makhana",
    name: "Roasted Makhana",
    shortDescription: "Light roasted makhana for family tea-time or travel.",
    longDescription:
      "Roasted makhana (fox nuts) from Farmley — a common Indian snack for adults and older kids who enjoy something crunchy and lightly seasoned.",
    category: "Tea-Time & Snacks",
    collection: "tea-time-snacks",
    image: "/products/pantry/farmley-makhana.jpg",
    imageAlt: "Farmley roasted makhana snack",
    unit: "77 g",
    stock: 40,
    ...P(5.0, 6.99),
    competitors: [],
    supplierId: "farmley",
    brand: "Farmley",
    origin: "India",
    pantry: {
      roleLine: "Roasted makhana for parents and kids at tea-time or on the go.",
      audience: ["Family", "Parents", "Kids"],
      occasions: ["Snack", "Tea-Time", "Travel-Friendly"],
      badges: ["Family", "Snack", "Makhana"],
      whySelected:
        "Makhana is a familiar Indian snack that works for the whole family. Farmley is a known brand for nuts and makhana — one flavour on the shelf keeps choice simple.",
      ingredients: "See Farmley package for makhana, oil, salt, and seasonings.",
      allergens: "Check label; may be processed in facilities handling nuts.",
      nutritionHighlights: "Made with makhana (fox nuts). See package nutrition facts.",
      preparation: "Ready to eat.",
      storage: "Cool, dry place; reseal after opening.",
      countryOfOrigin: "India",
      sourceUrl: "https://www.farmley.com/products/peri-peri-makhana-pack-of-4",
      gallery: ["/products/pantry/farmley-makhana.jpg"],
    },
  },
  {
    uuid: "a100000a-0000-4000-8000-00000000000a",
    id: "timios-melts-variety",
    slug: "timios-melts-variety",
    name: "Melts Variety Pack",
    shortDescription: "Baby/toddler finger snack — melts in the mouth.",
    longDescription:
      "A variety pack of Timios Melts — small finger-food snacks designed for babies and toddlers learning to self-feed.",
    category: "Tea-Time & Snacks",
    collection: "tea-time-snacks",
    image: "/products/pantry/timios-melts-variety.jpg",
    imageAlt: "Timios Melts Variety Pack",
    unit: "Variety pack",
    stock: 30,
    ...P(7.5, 9.99),
    competitors: [],
    supplierId: "timios",
    brand: "Timios",
    origin: "India",
    pantry: {
      roleLine: "Finger-food melts for babies and toddlers — test SKU on our shelf.",
      audience: ["Baby/Toddler"],
      occasions: ["Snack", "Travel-Friendly"],
      badges: ["Baby/Toddler", "Snack", "Travel-Friendly"],
      whySelected:
        "Timios is known for kids' snacks in India. Melts are a distinct baby/toddler finger-food format — we carry one variety pack to test demand before expanding.",
      ingredients: "See Timios package for grains, fruit, and other ingredients per flavour.",
      allergens: "Check each inner pack label for allergen information.",
      nutritionHighlights: "Made with whole grains per Timios product info. See individual sachet labels.",
      preparation: "Ready to eat; supervise young children while eating.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      suggestedAge: "See package for age guidance.",
      sourceUrl: "https://www.firstcry.com/timios/timios-melts-non-fried-no-maida-wholegrain-snacks-assorted-pack-of-4-50-g-each/8714198/product-detail",
      gallery: ["/products/pantry/timios-melts-variety.jpg"],
    },
  },
];

export function getPantryProduct(slug: string): PantryProduct | undefined {
  return pantryProducts.find((p) => p.slug === slug);
}

export function productsByCollection(collection: PantryCollection): PantryProduct[] {
  return pantryProducts.filter((p) => p.collection === collection);
}

export function cardBadges(p: PantryProduct): string[] {
  return p.pantry.badges.slice(0, 3);
}

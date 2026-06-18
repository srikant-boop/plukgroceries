/** Extended pantry fields — compliance-safe copy from official sources where noted. */
export type IngredientRow = {
  name: string;
  amount?: string;
};

export type IngredientSection = {
  heading?: string;
  rows: IngredientRow[];
};

export type PantryMeta = {
  roleLine: string;
  audience: string[];
  /** Max 3 shown on cards; full list on PDP */
  badges: string[];
  whySelected: string;
  ingredientSections: IngredientSection[];
  ingredientsNote?: string;
  allergens: string;
  nutritionHighlights: string;
  preparation: string;
  storage: string;
  countryOfOrigin: string;
  suggestedAge?: string;
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
  | "khichdi"
  | "cereals"
  | "pancakes"
  | "noodles"
  | "dosa"
  | "pasta"
  | "cookies"
  | "snacks";

export const PANTRY_COLLECTIONS: {
  slug: PantryCollection;
  title: string;
  navLabel: string;
}[] = [
  { slug: "cereals", title: "Cereals", navLabel: "Cereals" },
  { slug: "pancakes", title: "Pancakes", navLabel: "Pancakes" },
  { slug: "noodles", title: "Noodles", navLabel: "Noodles" },
  { slug: "dosa", title: "Dosa", navLabel: "Dosa" },
  { slug: "pasta", title: "Pasta", navLabel: "Pasta" },
  { slug: "snacks", title: "Snacks", navLabel: "Snacks" },
];

/** Curated 7-SKU test shelf — only these appear on the storefront. */
export const TEST_SHELF_PRODUCT_IDS = new Set([
  "slurrp-farm-millet-noodles-masala",
  "slurrp-farm-millet-dosa-spinach",
  "slurrp-farm-millet-pancake-chocolate",
  "slurrp-farm-macaroni-pasta",
  "slurrp-farm-choco-crunch-ragi-cereal",
  "early-foods-rice-moong-khichdi",
  "superyou-multigrain-protein-chips",
]);

const P = (cost: number, price: number) => ({
  wholesalerPrice: cost,
  markupMultiplier: price / cost,
  ourPrice: price,
});

/** Landed costs and shelf prices — update when import pricing changes. */
export const pantryProducts: PantryProduct[] = [
  {
    uuid: "a1000001-0000-4000-8000-000000000001",
    id: "early-foods-rice-moong-khichdi",
    slug: "early-foods-rice-moong-khichdi",
    name: "Rice & Moong Khichdi Mix",
    shortDescription: "Rice and moong khichdi mix with pepper, jeera, and ajwain.",
    longDescription:
      "A simple rice and moong dal khichdi mix from Early Foods — hand-pounded rajamudi red rice, yellow moong dal, and kodo millet with mild Indian spices. Sugar-free and made in small batches.",
    category: "Baby meals",
    collection: "khichdi",
    image: "/products/pantry/early-foods-rice-moong-khichdi.png",
    imageAlt: "Early Foods Rice and Moong Khichdi Mix package",
    unit: "200 g",
    stock: 40,
    ...P(5.11, 7.99),
    competitors: [],
    supplierId: "early-foods",
    brand: "Early Foods",
    origin: "India",
    pantry: {
      roleLine: "Traditional khichdi mix — creamy porridge or instant dosa in minutes.",
      audience: ["Baby/Toddler"],
      badges: ["No Sugar", "Travel-Friendly"],
      whySelected:
        "Khichdi is a staple comfort food for many Indian families. Early Foods uses a short, transparent ingredient list with no milk powder, salt, or maltodextrin — one khichdi SKU on our shelf instead of multiple porridge variants.",
      ingredientSections: [
        {
          rows: [
            { name: "Hand-pounded Rajamudi red rice", amount: "37%" },
            { name: "Yellow moong dal", amount: "37%" },
            { name: "Kodo millet (kodra)", amount: "25%" },
            { name: "Pepper", amount: "0.5%" },
            { name: "Ajwain", amount: "0.25%" },
            { name: "Jeera", amount: "0.25%" },
          ],
        },
      ],
      ingredientsNote: undefined,
      allergens: "Milk, wheat, nuts, and soy.",
      nutritionHighlights: "",
      preparation:
        "Creamy porridge: cook with water or milk until soft (about 5 minutes). Instant dosa/pancake: mix batter with water and spices; cook on a hot tawa. Follow package directions for consistency.",
      storage:
        "Store in a cool, dry place. Transfer to a clean airtight container after opening. Shelf life is 4 months from manufacturing.",
      countryOfOrigin: "India",
      suggestedAge: "From 6 months.",
      gallery: ["/products/pantry/early-foods-rice-moong-khichdi.png"],
    },
  },
  {
    uuid: "a1000002-0000-4000-8000-000000000002",
    id: "slurrp-farm-strawberry-ragi-cereal",
    slug: "slurrp-farm-strawberry-ragi-cereal",
    name: "Strawberry, Ragi & Rice Cereal with Milk",
    shortDescription: "Instant ragi, strawberry, and rice cereal with milk.",
    longDescription:
      "A ragi and rice cereal from Slurrp Farm with real strawberry — sweetened with date powder instead of refined sugar. Mixes with lukewarm water for a quick cereal-style meal.",
    category: "Cereals",
    collection: "cereals",
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
      roleLine: "Instant cereal with ragi, strawberry, and milk solids.",
      audience: ["Baby/Toddler"],
      badges: ["With Milk", "No Added Sugar", "Ragi"],
      whySelected:
        "Slurrp Farm is a trusted name for millet-based kids' foods in India. This cereal uses ragi and date powder for sweetness — one cereal SKU for families starting solids.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Multigrain flour blend (sprouted ragi, jowar, rice, oats)",
              amount: "47%",
            },
            { name: "Milk solids", amount: "33%" },
            {
              name: "Fruit powder blend (banana, strawberry)",
              amount: "10%",
            },
            { name: "Date powder", amount: "9%" },
            { name: "Beet juice powder" },
            { name: "Vitamins and minerals" },
          ],
        },
      ],
      ingredientsNote: "This product contains 23% millets.",
      allergens:
        "Contains oat and milk products. Made in a facility that processes wheat and nuts. May contain trace elements.",
      nutritionHighlights: "",
      preparation:
        "Boil drinking water for 5 minutes; cool to lukewarm. Measure 45 ml (3 tbsp) water into a bowl, add 3 level scoops (20 g) cereal, stir, and feed immediately with a clean spoon. Consume within 30 minutes.",
      storage:
        "Keep in a cool, dry place. After opening, store airtight and use within one month or by expiry date, whichever is earlier. Shelf life 12 months (unopened).",
      countryOfOrigin: "India",
      suggestedAge: "From 6 months.",
      gallery: ["/products/pantry/slurrp-farm-strawberry-ragi-cereal.jpg"],
    },
  },
  {
    uuid: "a1000003-0000-4000-8000-000000000003",
    id: "slurrp-farm-millet-pancake-chocolate",
    slug: "slurrp-farm-millet-pancake-chocolate",
    name: "Millet Pancake Mix — Chocolate Supergrains",
    shortDescription: "Chocolate millet pancake mix with jowar, ragi, and cocoa.",
    longDescription:
      "A chocolate millet pancake mix from Slurrp Farm — jowar, oat, foxtail millet, and ragi with cocoa. No maida, preservatives, or artificial flavours.",
    category: "Pancakes",
    collection: "pancakes",
    image: "/products/pantry/slurrp-farm-millet-pancake-chocolate.jpg",
    imageAlt: "Slurrp Farm Millet Pancake Chocolate Supergrains mix",
    unit: "150 g",
    stock: 35,
    ...P(3.09, 4.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Fluffy chocolate pancakes from a millet supergrain blend.",
      audience: ["Kids", "Family"],
      badges: ["No Maida", "Millet", "Chocolate"],
      whySelected:
        "Pancakes are an easy win for busy mornings. This mix uses millets and supergrains instead of refined flour — one pancake SKU that works for kids and adults eating together.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Multigrain flour blend (jowar, oat, foxtail millet, ragi)",
              amount: "66%",
            },
            { name: "Jaggery", amount: "14%" },
            { name: "Raw unrefined sugar", amount: "14%" },
            { name: "Cocoa powder" },
            { name: "Baking powder" },
            { name: "Raising agent (baking soda, INS 500(ii))" },
            { name: "Natural flavour" },
            { name: "Iodised salt" },
            { name: "Cinnamon powder" },
          ],
        },
      ],
      ingredientsNote: undefined,
      allergens:
        "Contains oats. May contain traces of wheat (gluten) and nuts.",
      nutritionHighlights: "",
      preparation:
        "Mix with water or milk per package instructions; pour onto a hot griddle and flip when bubbles form. Ready in minutes.",
      storage:
        "Keep in a cool, dry place. Best before 12 months from date of packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "Suitable for kids and adults — quick breakfast or snack.",
      gallery: ["/products/pantry/slurrp-farm-millet-pancake-chocolate.jpg"],
    },
  },
  {
    uuid: "a1000004-0000-4000-8000-000000000004",
    id: "slurrp-farm-choco-crunch-ragi-cereal",
    slug: "slurrp-farm-choco-crunch-ragi-cereal",
    name: "Choco Crunch Ragi Stars & Moons Cereal",
    shortDescription: "Chocolate ragi stars & moons cereal — bowl or dry snack.",
    longDescription:
      "A chocolate-flavoured ragi and jowar cereal from Slurrp Farm in star and moon shapes. Works in a bowl with milk or as a dry snack.",
    category: "Cereals",
    collection: "cereals",
    image: "/products/pantry/slurrp-farm-choco-crunch-ragi-cereal.jpg",
    imageAlt: "Slurrp Farm Choco Crunch Ragi Stars and Moons Cereal",
    unit: "250 g",
    stock: 35,
    ...P(6.09, 8.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Ragi and jowar cereal shapes with cocoa and unrefined sugar.",
      audience: ["Toddlers", "Kids"],
      badges: ["No Maida", "Ragi", "No Palm Oil"],
      whySelected:
        "Many families want a cereal that feels familiar to kids but uses better grains. This is our one shaped cereal SKU — ragi and jowar based, without stocking multiple flavours.",
      ingredientSections: [
        {
          rows: [
            { name: "Millet flour blend (jowar, ragi)", amount: "24%" },
            { name: "Unrefined sugar", amount: "22.6%" },
            { name: "Corn grits", amount: "18%" },
            { name: "Rice flour", amount: "9.9%" },
            { name: "Cocoa", amount: "5.7%" },
            { name: "Rice bran oil" },
            { name: "Nature-identical flavour" },
            { name: "Antioxidant (natural tocopherol)" },
          ],
        },
      ],
      ingredientsNote: "This product contains 24% millets.",
      allergens:
        "Made in a facility that processes wheat, milk solids, soy, and nuts. May contain trace elements.",
      nutritionHighlights: "",
      preparation:
        "Serve with cold or warm milk, or eat dry as a snack. Contains dairy when prepared with milk.",
      storage:
        "Keep in a cool, dry place. After opening, transfer to an airtight container and consume within one month. Best before 9 months from packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For toddlers and kids who can chew and swallow this texture — not for babies without teeth.",
      gallery: ["/products/pantry/slurrp-farm-choco-crunch-ragi-cereal.jpg"],
    },
  },
  {
    uuid: "a1000005-0000-4000-8000-000000000005",
    id: "slurrp-farm-millet-noodles-masala",
    slug: "slurrp-farm-millet-noodles-masala",
    name: "Millet Noodles — Classic Masala",
    shortDescription: "Foxtail millet and whole wheat masala noodles — not fried.",
    longDescription:
      "Classic masala millet noodles from Slurrp Farm — foxtail millet and whole wheat with a separate spice sachet. Not fried; ready in minutes.",
    category: "Noodles",
    collection: "noodles",
    image: "/products/pantry/slurrp-farm-millet-noodles-masala.jpg",
    imageAlt: "Slurrp Farm Millet Noodles Classic Masala",
    unit: "192 g",
    stock: 50,
    ...P(2.77, 4.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Millet noodles with a natural-spice masala sachet — serves 2.",
      audience: ["Kids", "Family"],
      badges: ["No Maida", "Not Fried", "Millet"],
      whySelected:
        "Instant noodles are a real use case in busy households. We carry one millet-based masala noodle — a cleaner alternative to typical maida noodles, without filling the shelf with flavours.",
      ingredientSections: [
        {
          heading: "Noodles (94%)",
          rows: [
            {
              name: "Multigrain flour blend (whole wheat, foxtail millet)",
              amount: "93%",
            },
            { name: "Thickener (guar gum)", amount: "6.7%" },
            { name: "Salt" },
            { name: "Antioxidant (natural rosemary)" },
          ],
        },
        {
          heading: "Spice mix (6%)",
          rows: [
            {
              name: "Mixed spices (coriander, chilli, black pepper, amchur, turmeric, nutmeg, fennel, cumin, ginger, fenugreek, star anise, allspice, garam masala, clove, cinnamon)",
            },
            { name: "Maltodextrin" },
            { name: "Salt" },
            { name: "Jaggery powder" },
            { name: "Dehydrated vegetables (onion, garlic)" },
            { name: "Natural flavouring substances" },
            { name: "Edible vegetable oil (sunflower)" },
            { name: "Dehydrated curry leaves" },
            { name: "Natural colours (paprika extract, turmeric extract)" },
            { name: "Acidity regulator (citric acid)" },
          ],
        },
      ],
      ingredientsNote: "This product contains 31.2% millets.",
      allergens:
        "Contains wheat. Manufactured in a facility that also processes milk, soy, and nuts.",
      nutritionHighlights: "",
      preparation:
        "Boil noodles, drain, and toss with the masala seasoning sachet per package directions. Also works for stir-fries, hakka-style noodles, or soup.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — mild masala, suited to lunchboxes and quick meals.",
      gallery: ["/products/pantry/slurrp-farm-millet-noodles-masala.jpg"],
    },
  },
  {
    uuid: "a1000006-0000-4000-8000-000000000006",
    id: "slurrp-farm-millet-dosa-spinach",
    slug: "slurrp-farm-millet-dosa-spinach",
    name: "Millet Dosa — Spinach Supergrains",
    shortDescription: "Spinach multigrain millet dosa mix — pour and cook.",
    longDescription:
      "Spinach millet dosa mix from Slurrp Farm — supergrains, natural spinach powder, and mild spices. No maida or white rice.",
    category: "Dosa",
    collection: "dosa",
    image: "/products/pantry/slurrp-farm-millet-dosa-spinach.jpg",
    imageAlt: "Slurrp Farm Millet Dosa Spinach Supergrains mix",
    unit: "150 g",
    stock: 40,
    ...P(2.85, 4.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Spinach millet dosa batter mix — no grinding from scratch.",
      audience: ["Kids", "Family"],
      badges: ["No Maida", "Spinach", "Millet"],
      whySelected:
        "Dosa is a core Indian breakfast. This mix covers that format with millets and spinach in one SKU — faster than homemade batter on a weekday.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Supergrain blend (foxtail millet flour, rice flour)",
              amount: "54%",
            },
            { name: "Moong dal (green gram)", amount: "16%" },
            { name: "Urad dal (black gram)", amount: "14%" },
            { name: "Iodised salt" },
            { name: "Spinach powder" },
            {
              name: "Spices (asafoetida, curry leaves, cumin)",
            },
            { name: "Onion flakes" },
            { name: "Raising agent (baking soda, INS 500(ii))" },
          ],
        },
      ],
      ingredientsNote: undefined,
      allergens:
        "Made in a facility that processes wheat and nuts. May contain trace elements.",
      nutritionHighlights: "",
      preparation:
        "Mix batter per package instructions; spread thin on a hot tawa and cook until crisp.",
      storage: "Keep in a cool, dry place. Best before 12 months from packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — everyday dosa mix once child eats regular table foods.",
      gallery: ["/products/pantry/slurrp-farm-millet-dosa-spinach.jpg"],
    },
  },
  {
    uuid: "a1000007-0000-4000-8000-000000000007",
    id: "slurrp-farm-macaroni-pasta",
    slug: "slurrp-farm-macaroni-pasta",
    name: "Macaroni Pasta",
    shortDescription: "Gluten-free multigrain macaroni — brown rice, rice, and corn.",
    longDescription:
      "Macaroni pasta from Slurrp Farm made with brown rice, white rice, and corn. Vegan, gluten-free, and cooks in 9–10 minutes.",
    category: "Pasta",
    collection: "pasta",
    image: "/products/pantry/slurrp-farm-macaroni-pasta.jpg",
    imageAlt: "Slurrp Farm Macaroni Pasta",
    unit: "400 g",
    stock: 40,
    ...P(7.08, 10.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Multigrain macaroni — boil and sauce your way.",
      audience: ["Kids", "Family"],
      badges: ["Gluten-Free", "Vegan", "No Maida"],
      whySelected:
        "Pasta is a weekly staple in many homes. We stock one macaroni from Slurrp Farm — enough for lunchboxes and quick dinners without a wall of pasta SKUs.",
      ingredientSections: [
        {
          rows: [
            { name: "Brown rice" },
            { name: "White rice" },
            { name: "Corn" },
          ],
        },
      ],
      ingredientsNote: undefined,
      allergens:
        "Made in a facility that may handle wheat and other allergens.",
      nutritionHighlights: "",
      preparation:
        "Boil in salted water 9–10 minutes until tender; drain and serve with sauce, cheese, or vegetables.",
      storage:
        "Cool, dry place. Best before 18 months from date of packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — gluten-free pasta for everyday meals.",
      gallery: ["/products/pantry/slurrp-farm-macaroni-pasta.jpg"],
    },
  },
  {
    uuid: "a1000008-0000-4000-8000-000000000008",
    id: "slurrp-farm-choco-ragi-cookies",
    slug: "slurrp-farm-choco-ragi-cookies",
    name: "Choco Ragi Cookies",
    shortDescription: "Choco ragi cookies sweetened with jaggery — ready to eat.",
    longDescription:
      "Chocolate ragi cookies from Slurrp Farm — multigrain biscuits with ragi and jowar, sweetened with jaggery and unrefined sugar. No preservatives.",
    category: "Cookies",
    collection: "cookies",
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
      roleLine: "Ragi and jowar chocolate cookies — shelf-stable snack.",
      audience: ["Kids", "Family"],
      badges: ["No Maida", "Ragi", "No Preservatives"],
      whySelected:
        "We carry one cookie SKU — choco ragi — instead of a wall of flavours. It covers lunchbox and travel snacking without turning PLUK into a biscuit aisle.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Multigrain flour blend (whole wheat atta, jowar, ragi)",
              amount: "46%",
            },
            { name: "Rice bran oil", amount: "12%" },
            { name: "Jaggery", amount: "11%" },
            { name: "Unrefined sugar", amount: "11%" },
            { name: "Cocoa powder", amount: "3.5%" },
            { name: "Chocolate chips" },
            { name: "Skimmed milk powder" },
            { name: "Corn flour" },
            { name: "Nature identical flavouring substances (vanilla)" },
            { name: "Raising agent (baking soda)" },
            { name: "Iodised salt" },
            { name: "Emulsifier (sunflower lecithin)" },
            { name: "Thickener (xanthan gum)" },
            { name: "Antioxidant (natural rosemary)" },
          ],
        },
      ],
      ingredientsNote: undefined,
      allergens:
        "Contains milk and wheat (gluten). May contain nuts and seeds.",
      nutritionHighlights: "",
      preparation: "Ready to eat.",
      storage:
        "Cool, dry place. After opening, keep airtight and consume within one month or by expiry date, whichever is earlier.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — solid snack for children who can chew biscuits safely.",
      gallery: ["/products/pantry/slurrp-farm-choco-ragi-cookies.jpg"],
    },
  },
  {
    uuid: "a1000009-0000-4000-8000-000000000009",
    id: "farmley-makhana",
    slug: "farmley-makhana",
    name: "Roasted Makhana",
    shortDescription: "Roasted peri peri makhana — never fried.",
    longDescription:
      "Roasted makhana (fox nuts) from Farmley with peri peri seasoning — light, gluten-free, and ready to eat.",
    category: "Snacks",
    collection: "snacks",
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
      roleLine: "Roasted peri peri makhana — crunchy, never fried.",
      audience: ["Family", "Kids"],
      badges: ["Gluten-Free", "Roasted", "Makhana"],
      whySelected:
        "Makhana is a familiar Indian snack that works for the whole family. Farmley is a known brand for nuts and makhana — one flavour on the shelf keeps choice simple.",
      ingredientSections: [
        {
          rows: [
            { name: "Foxnut (makhana)" },
            { name: "Olive oil" },
            { name: "Red chilli" },
            { name: "Dried garlic" },
            { name: "Dried onion" },
            { name: "Cumin" },
            { name: "Dried mango powder" },
            { name: "Coriander seeds" },
            { name: "Dried ginger" },
            { name: "Turmeric" },
            { name: "Carom seeds" },
            { name: "Black pepper" },
            { name: "Cinnamon" },
            { name: "Fenugreek seeds" },
            { name: "Nutmeg" },
            { name: "Mace" },
            { name: "Iodised salt" },
            { name: "Black salt" },
            { name: "Sugar" },
            { name: "Citric acid" },
            { name: "Malic acid" },
            { name: "Corn starch" },
            { name: "Paprika extract" },
            { name: "Flavour enhancer (INS 635)" },
          ],
        },
      ],
      allergens:
        "May contain tree nuts.",
      nutritionHighlights:
        "See package label for full nutrition facts.",
      preparation: "Ready to eat.",
      storage:
        "Cool, dry place away from direct sunlight. Reseal after opening. Shelf life 9 months.",
      countryOfOrigin: "India",
      suggestedAge:
        "For older kids and adults — supervise young children because of size and crunch.",
      gallery: ["/products/pantry/farmley-makhana.jpg"],
    },
  },
  {
    uuid: "a100000a-0000-4000-8000-00000000000a",
    id: "timios-melts-variety",
    slug: "timios-melts-variety",
    name: "Melts Variety Pack",
    shortDescription: "Wholegrain melts variety pack — four flavours.",
    longDescription:
      "Timios Melts variety pack — non-fried, wholegrain finger snacks in four fruit and spice flavours. Each inner pack is 50 g.",
    category: "Snacks",
    collection: "snacks",
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
      roleLine: "Wholegrain melts that dissolve quickly — four flavours in one pack.",
      audience: ["Baby/Toddler"],
      badges: ["No Maida", "Wholegrain", "Non-Fried"],
      whySelected:
        "Timios is known for kids' snacks in India. Melts are a distinct baby/toddler finger-food format — we carry one variety pack to test demand before expanding.",
      ingredientSections: [
        {
          heading: "Blueberry",
          rows: [
            { name: "Whole grain (wheat, rice, oats)" },
            { name: "Wheat starch" },
            { name: "Cane sugar" },
            { name: "Rice bran oil" },
            { name: "Apple juice powder" },
            { name: "Blueberry fruit powder" },
            { name: "Natural blueberry flavour" },
            { name: "Mixed tocopherols" },
          ],
        },
        {
          heading: "Apple & cinnamon",
          rows: [
            { name: "Whole grain (wheat, rice, oats)" },
            { name: "Wheat starch" },
            { name: "Cane sugar" },
            { name: "Rice bran oil" },
            { name: "Apple & cinnamon extracts", amount: "4%" },
            { name: "Salt" },
            { name: "Mixed tocopherols" },
          ],
        },
        {
          heading: "Carrot & cumin",
          rows: [
            { name: "Whole grain (wheat, rice, oats)" },
            { name: "Wheat starch" },
            { name: "Cane sugar" },
            { name: "Rice bran oil" },
            { name: "Carrot & cumin extracts", amount: "3%" },
            {
              name: "Spices (salt, onion, garlic, coriander, tomato extract, turmeric)",
            },
            { name: "Mixed tocopherols" },
          ],
        },
        {
          heading: "Banana & strawberry",
          rows: [
            { name: "Whole grain (wheat, rice, oats)" },
            { name: "Wheat starch" },
            { name: "Cane sugar" },
            { name: "Rice bran oil" },
            { name: "Banana fruit powder" },
            { name: "Strawberry fruit powder" },
            { name: "Natural banana flavour" },
            { name: "Mixed tocopherols" },
          ],
        },
      ],
      allergens:
        "Contains wheat (gluten) and oats in all four flavours.",
      nutritionHighlights:
        "See package label for full nutrition facts.",
      preparation:
        "Ready to eat. Supervise young children while eating.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      suggestedAge: "From 9 months.",
      gallery: ["/products/pantry/timios-melts-variety.jpg"],
    },
  },
  {
    uuid: "a100000b-0000-4000-8000-00000000000b",
    id: "superyou-multigrain-protein-chips",
    slug: "superyou-multigrain-protein-chips",
    name: "Multigrain Protein Chips — Pudina",
    shortDescription:
      "Baked pudina multigrain protein chips — 10 g protein and 3 g fibre per 40 g pack, no palm oil or added sugar.",
    longDescription:
      "10 g of pure protein packed into every crunchy bite, made with an innovative blend of multigrains — chickpea, urad dal, jowar, and rice flour — with soya protein isolate. No sugar. No palm oil. Light, crispy, and bursting with bold pudina flavour. All in under 170 kcal per 40 g pack.",
    category: "Snacks",
    collection: "snacks",
    image: "/products/pantry/superyou-multigrain-protein-chips.jpg",
    imageAlt: "SuperYou Pudina Multigrain Protein Chips 40 g pack",
    unit: "40 g",
    stock: 50,
    ...P(2.0, 2.99),
    competitors: [],
    supplierId: "superyou",
    brand: "SuperYou",
    origin: "India",
    pantry: {
      roleLine:
        "Baked pudina multigrain chips with 10 g protein — a lighter savoury snack.",
      audience: ["Family", "Kids"],
      badges: ["High Protein", "No Palm Oil", "No Added Sugar"],
      whySelected:
        "Many families want a familiar chip format with more protein and less junk. SuperYou’s pudina multigrain chips use a baked base with soya protein isolate — one protein chip SKU on the test shelf to see if it earns reorders.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Multigrain blend (urad dal, rice flour, jowar, chickpea)",
            },
            { name: "Soya protein isolate" },
            { name: "Tapioca starch" },
            { name: "Rice bran oil" },
            {
              name: "Spices and condiments (chilli, turmeric, cumin, ginger, ajwain, dried mango powder, asafoetida, hydrolysed vegetable powder, yeast extract, salt)",
            },
            { name: "Citric acid (INS 330)" },
          ],
        },
      ],
      ingredientsNote:
        "Contains added natural food colour (INS 160c) and added natural and nature-identical flavouring substances.",
      allergens: "Contains milk and soya products.",
      nutritionHighlights:
        "10 g protein and 3 g dietary fibre per 40 g pack; under 170 kcal per pack.",
      preparation: "Ready to eat.",
      storage:
        "Keep away from direct sunlight. Store in a cool, dry, hygienic place at 20–25 °C. Do not buy if the pack is found tampered.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — supervise young children because of size and crunch.",
      gallery: ["/products/pantry/superyou-multigrain-protein-chips.jpg"],
    },
  },
];

export function getPantryProduct(slug: string): PantryProduct | undefined {
  return pantryProducts.find((p) => p.slug === slug);
}

export const testShelfProducts = (): PantryProduct[] =>
  pantryProducts.filter((p) => TEST_SHELF_PRODUCT_IDS.has(p.id));

export function productsByCollection(collection: PantryCollection): PantryProduct[] {
  return pantryProducts.filter((p) => p.collection === collection);
}

export function cardBadges(p: PantryProduct): string[] {
  return p.pantry.badges.slice(0, 3);
}

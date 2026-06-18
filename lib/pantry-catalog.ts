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
  occasions: string[];
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
  { slug: "khichdi", title: "Khichdi", navLabel: "Khichdi" },
  { slug: "cereals", title: "Cereals", navLabel: "Cereals" },
  { slug: "pancakes", title: "Pancakes", navLabel: "Pancakes" },
  { slug: "noodles", title: "Noodles", navLabel: "Noodles" },
  { slug: "dosa", title: "Dosa", navLabel: "Dosa" },
  { slug: "pasta", title: "Pasta", navLabel: "Pasta" },
  { slug: "cookies", title: "Cookies", navLabel: "Cookies" },
  { slug: "snacks", title: "Snacks", navLabel: "Snacks" },
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
    shortDescription: "Rice and moong khichdi mix with pepper, jeera, and ajwain.",
    longDescription:
      "A simple rice and moong dal khichdi mix from Early Foods — hand-pounded rajamudi red rice, yellow moong dal, and kodo millet with mild Indian spices. Sugar-free and made in small batches.",
    category: "Khichdi",
    collection: "khichdi",
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
      roleLine: "Traditional khichdi mix — creamy porridge or instant dosa in minutes.",
      audience: ["Baby/Toddler", "Parents"],
      occasions: ["Lunch/Dinner", "Travel-Friendly"],
      badges: ["No Sugar", "Stage 1", "Travel-Friendly"],
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
      ingredientsNote:
        "No milk powder, salt, sugar, or maltodextrin (per Early Foods).",
      allergens:
        "Free from milk, wheat, nuts, and soy in the ingredient list (per Early Foods).",
      nutritionHighlights:
        "Made with rice, moong dal, and kodo millet. No added sugar, milk powder, or maltodextrin.",
      preparation:
        "Creamy porridge: cook with water or milk until soft (about 5 minutes). Instant dosa/pancake: mix batter with water and spices; cook on a hot tawa. Follow package directions for consistency.",
      storage:
        "Store in a cool, dry place. Transfer to a clean airtight container after opening. Shelf life is 4 months from manufacturing (per Early Foods).",
      countryOfOrigin: "India",
      suggestedAge:
        "Stage 1 — for babies starting solids (per Early Foods).",
      sourceUrl: "https://www.earlyfoods.com/products/rice-moong-khichdi-mix-200g",
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
      occasions: ["Breakfast", "Travel-Friendly"],
      badges: ["With Milk", "No Added Sugar", "Ragi"],
      whySelected:
        "Slurrp Farm is a trusted name for millet-based kids' foods in India. This cereal uses ragi and date powder for sweetness — one cereal SKU for families starting solids.",
      ingredientSections: [
        {
          rows: [
            { name: "Ragi" },
            { name: "Jowar" },
            { name: "Rice" },
            { name: "Oats" },
            { name: "Real strawberry powder" },
            { name: "Milk solids" },
            { name: "Date powder (natural sweetness)" },
          ],
        },
      ],
      ingredientsNote: "Per Slurrp Farm product information.",
      allergens:
        "Contains milk (whole and skimmed milk powders). No maida, refined sugar, or artificial colours or preservatives (per Slurrp Farm). Not suitable for children with milk allergy.",
      nutritionHighlights:
        "Made with ragi, jowar, rice, and oats. Sweetened with date powder — no refined sugar (per Slurrp Farm). Rich in calcium per brand product information.",
      preparation:
        "Boil drinking water for 5 minutes; cool to lukewarm. Measure 45 ml (3 tbsp) water into a bowl, add 3 level scoops (20 g) cereal, stir, and feed immediately with a clean spoon. Consume within 30 minutes.",
      storage:
        "Keep in a cool, dry place. After opening, store airtight and use within one month or by expiry date, whichever is earlier. Shelf life 12 months (unopened).",
      countryOfOrigin: "India",
      suggestedAge:
        "For babies and toddlers who have started solids (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/no-refined-sugar-strawberry-ragi-rice-cereal",
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
    ...P(6.0, 8.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Fluffy chocolate pancakes from a millet supergrain blend.",
      audience: ["Kids", "Family", "Toddlers"],
      occasions: ["Breakfast", "Snack"],
      badges: ["No Maida", "Millet", "Chocolate"],
      whySelected:
        "Pancakes are an easy win for busy mornings. This mix uses millets and supergrains instead of refined flour — one pancake SKU that works for kids and adults eating together.",
      ingredientSections: [
        {
          rows: [
            {
              name: "Supergrain blend (jowar, oat, foxtail millet, ragi flour)",
              amount: "69%",
            },
            { name: "Jaggery", amount: "12.5%" },
            { name: "Raw unrefined sugar", amount: "12.5%" },
            { name: "Cocoa powder" },
            { name: "Baking powder" },
            { name: "Raising agent (baking soda, INS 500(ii))" },
            { name: "Natural flavour" },
            { name: "Iodised salt" },
            { name: "Cinnamon powder" },
          ],
        },
      ],
      ingredientsNote: "Per published Slurrp Farm label listings.",
      allergens:
        "Made in a facility that handles wheat (gluten) and nuts — may contain trace amounts (per Slurrp Farm label listings). Contains oats.",
      nutritionHighlights:
        "No maida, preservatives, or artificial flavours. Ragi and foxtail millet are naturally gluten-free grains (per Slurrp Farm).",
      preparation:
        "Mix with water or milk per package instructions; pour onto a hot griddle and flip when bubbles form. Ready in minutes.",
      storage:
        "Keep in a cool, dry place. Best before 12 months from date of packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "Suitable for kids and adults — quick breakfast or snack (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-pancake-choclate-and-supergrains",
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
    ...P(6.5, 8.99),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Ragi and jowar cereal shapes with cocoa and unrefined sugar.",
      audience: ["Kids", "Toddlers"],
      occasions: ["Breakfast", "Snack", "Travel-Friendly"],
      badges: ["No Maida", "Ragi", "No Palm Oil"],
      whySelected:
        "Many families want a cereal that feels familiar to kids but uses better grains. This is our one shaped cereal SKU — ragi and jowar based, without stocking multiple flavours.",
      ingredientSections: [
        {
          rows: [
            { name: "Ragi" },
            { name: "Jowar" },
            { name: "Rice" },
            { name: "Corn" },
            { name: "Cocoa" },
            { name: "Raw unrefined sugar" },
          ],
        },
      ],
      ingredientsNote:
        "No maida, salt, trans fat, palm oil, preservatives, artificial colours, or flavours (per Slurrp Farm).",
      allergens:
        "Contains corn and rice. Typically served with cow's milk — contains dairy when prepared that way. No palm oil or trans fat (per Slurrp Farm).",
      nutritionHighlights:
        "Made with ragi and jowar. Per Slurrp Farm, 30 g cereal with 200 ml cow's milk provides about 66% of daily calcium RDA.",
      preparation:
        "Serve with cold or warm milk, or eat dry as a snack.",
      storage:
        "Keep in a cool, dry place. After opening, transfer to an airtight container and consume within one month. Best before 9 months from packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For toddlers and kids who can chew and swallow this texture — not for babies without teeth (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-crunch-cereal-chocolate-stars-and-moons-healthy-millet-breakfast-300-gm",
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
    ...P(5.5, 7.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Millet noodles with a natural-spice masala sachet — serves 2.",
      audience: ["Kids", "Family", "Toddlers"],
      occasions: ["Lunch/Dinner", "Travel-Friendly"],
      badges: ["No Maida", "Not Fried", "Millet"],
      whySelected:
        "Instant noodles are a real use case in busy households. We carry one millet-based masala noodle — a cleaner alternative to typical maida noodles, without filling the shelf with flavours.",
      ingredientSections: [
        {
          heading: "Noodles",
          rows: [
            { name: "Foxtail millet flour" },
            { name: "Whole wheat flour" },
            { name: "Cluster bean powder (natural gum)" },
            { name: "Salt" },
          ],
        },
        {
          heading: "Spice mix (5%)",
          rows: [
            { name: "Coriander seeds" },
            { name: "Red chillies" },
            { name: "Onion powder" },
            { name: "Garlic powder" },
            { name: "Ginger powder" },
            { name: "Turmeric" },
            { name: "Curry leaves" },
            { name: "Fennel seeds" },
            { name: "Black pepper" },
            { name: "Cassia" },
            { name: "Fenugreek" },
            { name: "Star anise" },
            { name: "Clove" },
            { name: "Nutmeg" },
            { name: "Salt" },
            { name: "Unrefined cane sugar" },
            { name: "Citric acid (INS 330)" },
          ],
        },
      ],
      ingredientsNote: "Per Slurrp Farm label listings.",
      allergens:
        "Contains wheat (gluten). Made in a facility that processes nuts — may contain trace amounts (per Slurrp Farm).",
      nutritionHighlights:
        "Sun-dried, not fried. Foxtail millet is a source of vitamin A; whole wheat provides B-vitamins and minerals (per Slurrp Farm).",
      preparation:
        "Boil noodles, drain, and toss with the masala seasoning sachet per package directions. Also works for stir-fries, hakka-style noodles, or soup.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — mild masala, suited to lunchboxes and quick meals (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/classic-masala-serves-2-96-gms",
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
    ...P(5.5, 7.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Spinach millet dosa batter mix — no grinding from scratch.",
      audience: ["Kids", "Family", "Toddlers"],
      occasions: ["Breakfast", "Lunch/Dinner"],
      badges: ["No Maida", "Spinach", "Millet"],
      whySelected:
        "Dosa is a core Indian breakfast. This mix covers that format with millets and spinach in one SKU — faster than homemade batter on a weekday.",
      ingredientSections: [
        {
          rows: [
            { name: "Foxtail millet" },
            { name: "Urad dal" },
            { name: "Chana dal" },
            { name: "Moong dal" },
            { name: "Natural spinach powder" },
            { name: "Mild spices" },
          ],
        },
      ],
      ingredientsNote:
        "Zero maida, white rice, preservatives, stabilizers, emulsifiers, artificial colours, or flavours (per Slurrp Farm).",
      allergens:
        "Contains legumes (urad, chana, and moong dal). Zero maida or white rice (per Slurrp Farm).",
      nutritionHighlights:
        "Foxtail millet provides protein; spinach adds iron, folic acid, and vitamin K1 (per Slurrp Farm).",
      preparation:
        "Mix batter per package instructions; spread thin on a hot tawa and cook until crisp.",
      storage: "Keep in a cool, dry place. Best before 12 months from packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — everyday dosa mix once child eats regular table foods (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/millet-dosa-supergrains-and-spinach",
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
    ...P(6.0, 8.49),
    competitors: [],
    supplierId: "slurrp-farm",
    brand: "Slurrp Farm",
    origin: "India",
    pantry: {
      roleLine: "Multigrain macaroni — boil and sauce your way.",
      audience: ["Kids", "Family", "Toddlers"],
      occasions: ["Lunch/Dinner"],
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
      ingredientsNote:
        "Zero maida/wheat, no trans fats, preservatives, or artificial colours and flavours (per Slurrp Farm).",
      allergens:
        "Gluten-free and vegan (per Slurrp Farm). Made in a facility that may handle wheat and other allergens.",
      nutritionHighlights:
        "Source of dietary fibre, B-vitamins, and essential fatty acids. Less than 2 g fat per 100 g serving (per Slurrp Farm).",
      preparation:
        "Boil in salted water 9–10 minutes until tender; drain and serve with sauce, cheese, or vegetables.",
      storage:
        "Cool, dry place. Best before 18 months from date of packaging.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — gluten-free pasta for everyday meals (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/macaroni-pasta",
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
      audience: ["Kids", "Family", "Toddlers"],
      occasions: ["Snack", "Travel-Friendly"],
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
            { name: "Raw unrefined sugar", amount: "11%" },
            { name: "Cocoa powder", amount: "3.5%" },
            { name: "Chocolate chips" },
            { name: "Skimmed milk powder" },
            { name: "Corn flour" },
            { name: "Raising agent (baking soda)" },
            { name: "Iodised salt" },
            { name: "Emulsifier (sunflower lecithin)" },
            { name: "Thickener (xanthan gum)" },
            { name: "Antioxidant (natural rosemary)" },
          ],
        },
      ],
      ingredientsNote:
        "No maida, palm oil, or preservatives (per Slurrp Farm label listings).",
      allergens:
        "Contains milk and wheat (gluten). May contain nuts and seeds (per Slurrp Farm).",
      nutritionHighlights:
        "Multigrain cookies with ragi and jowar. No maida, refined sugar, or palm oil (per Slurrp Farm). High in fibre per brand listing.",
      preparation: "Ready to eat.",
      storage:
        "Cool, dry place. After opening, keep airtight and consume within one month or by expiry date, whichever is earlier.",
      countryOfOrigin: "India",
      suggestedAge:
        "For kids and family — solid snack for children who can chew biscuits safely (per Slurrp Farm).",
      sourceUrl: "https://www.slurrpfarm.com/products/the-good-cookie-tasty-no-maida-no-refined-sugar-choco-ragi-cookie",
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
      audience: ["Family", "Parents", "Kids"],
      occasions: ["Snack", "Travel-Friendly"],
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
      ingredientsNote: "Per Farmley label listings.",
      allergens:
        "Gluten-free. May contain tree nuts — processed in a facility handling nuts (per Farmley).",
      nutritionHighlights:
        "Roasted in olive oil, not fried. Low-calorie, gluten-free, cholesterol-free snack with plant protein and fibre (per Farmley).",
      preparation: "Ready to eat.",
      storage:
        "Cool, dry place away from direct sunlight. Reseal after opening. Shelf life 9 months (per Farmley).",
      countryOfOrigin: "India",
      suggestedAge:
        "For older kids and adults — supervise young children because of size and crunch (per Farmley family snack positioning).",
      sourceUrl: "https://www.farmley.com/products/peri-peri-makhana-pack-of-4",
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
      occasions: ["Snack", "Travel-Friendly"],
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
      ingredientsNote: "Per Timios/FirstCry product listing.",
      allergens:
        "Contains wheat (gluten) and oats in all four flavours (per Timios).",
      nutritionHighlights:
        "Non-fried, no maida, no preservatives or artificial colours/flavours. Whole grains supply protein, iron, and calcium (per Timios).",
      preparation:
        "Ready to eat. Supervise young children while eating.",
      storage: "Store in a cool, dry place.",
      countryOfOrigin: "India",
      suggestedAge: "From 9 months (per Timios).",
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

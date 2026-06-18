export type NutritionFactRow = {
  nutrient: string;
  per100g?: string;
  perServe?: string;
  rda?: string;
  /** Renders as a subheading row (e.g. Vitamins, Minerals). */
  isSection?: boolean;
};

export type NutritionFacts = {
  servingSize: string;
  servingsPerPack?: string;
  columns: ("per100g" | "perServe" | "rda")[];
  /** Defaults to "Per serve" when omitted. */
  perServeColumnLabel?: string;
  rows: NutritionFactRow[];
  footnotes?: string[];
};

/** Structured label data transcribed from official package images. */
export const PRODUCT_LABEL_DATA: Record<
  string,
  { nutritionFacts?: NutritionFacts }
> = {
  "early-foods-rice-moong-khichdi": {
    nutritionFacts: {
      servingSize: "2 tbsp (approx. 30 g)",
      servingsPerPack: "About 7–8",
      columns: ["perServe"],
      rows: [
        { nutrient: "Energy", perServe: "109 kcal" },
        { nutrient: "Total fat", perServe: "0.7 g" },
        { nutrient: "Fibre", perServe: "1.2 g" },
        { nutrient: "Carbohydrates", perServe: "22 g" },
        { nutrient: "Sugars", perServe: "0.6 g" },
        { nutrient: "Added sugar", perServe: "0 g" },
        { nutrient: "Protein", perServe: "4.3 g" },
        { nutrient: "Salt (NaCl)", perServe: "<0.1 g" },
        { nutrient: "Added salt", perServe: "0 g" },
        { nutrient: "Calcium", perServe: "9.5 mg" },
        { nutrient: "Iron", perServe: "0.8 mg" },
      ],
    },
  },
  "slurrp-farm-strawberry-ragi-cereal": {
    nutritionFacts: {
      servingSize: "3 scoops (approx. 20 g)",
      servingsPerPack: "10",
      perServeColumnLabel: "Per 20 g",
      columns: ["per100g", "perServe"],
      rows: [
        { nutrient: "Energy", per100g: "375.9 kcal", perServe: "75.2 kcal" },
        { nutrient: "Protein", per100g: "13.1 g", perServe: "2.6 g" },
        { nutrient: "Carbohydrate", per100g: "76.7 g", perServe: "15.3 g" },
        { nutrient: "Total sugar", per100g: "11.7 g", perServe: "2.3 g" },
        { nutrient: "Added sugar", per100g: "0.0 g", perServe: "0.0 g" },
        { nutrient: "Dietary fibre", per100g: "5.2 g", perServe: "1.0 g" },
        { nutrient: "Sodium", per100g: "80.0 mg", perServe: "16.0 mg" },
        { nutrient: "Total fat", per100g: "1.8 g", perServe: "0.4 g" },
        { nutrient: "Saturated fat", per100g: "0.9 g", perServe: "0.2 g" },
        { nutrient: "Trans fat", per100g: "0.0 g", perServe: "0.0 g" },
        { nutrient: "Cholesterol", per100g: "0.0 mg", perServe: "0.0 mg" },
        { nutrient: "Vitamins", isSection: true },
        { nutrient: "Vitamin A", per100g: "400.0 mcg", perServe: "80.0 mcg" },
        { nutrient: "Vitamin C", per100g: "40.0 mg", perServe: "8.0 mg" },
        { nutrient: "Vitamin D", per100g: "5.0 mcg", perServe: "1.0 mcg" },
        { nutrient: "Vitamin E", per100g: "2.5 mg", perServe: "0.5 mg" },
        {
          nutrient: "Vitamin B1 (Thiamine)",
          per100g: "0.5 mg",
          perServe: "0.1 mg",
        },
        {
          nutrient: "Vitamin B2 (Riboflavin)",
          per100g: "0.6 mg",
          perServe: "0.1 mg",
        },
        { nutrient: "Nicotinamide", per100g: "8.0 mg", perServe: "1.6 mg" },
        {
          nutrient: "Vitamin B6 (Pyridoxin)",
          per100g: "0.9 mg",
          perServe: "0.2 mg",
        },
        { nutrient: "Vitamin B12", per100g: "0.6 mcg", perServe: "0.1 mcg" },
        { nutrient: "Folic acid", per100g: "80.0 mcg", perServe: "16.0 mcg" },
        { nutrient: "Minerals", isSection: true },
        { nutrient: "Calcium", per100g: "600.0 mg", perServe: "120.0 mg" },
        { nutrient: "Iron", per100g: "9.0 mg", perServe: "1.8 mg" },
        { nutrient: "Zinc", per100g: "5.0 mg", perServe: "1.0 mg" },
      ],
      footnotes: [
        "Contains saturated fat not more than 5%.",
        "Approx values.",
        "Total sugar includes naturally occurring sugar from fruit powder.",
      ],
    },
  },
  "slurrp-farm-millet-pancake-chocolate": {
    nutritionFacts: {
      servingSize: "Approx. 40 g (makes two 4″ pancakes)",
      servingsPerPack: "4",
      columns: ["perServe", "rda"],
      rows: [
        { nutrient: "Energy", perServe: "153.3 kcal", rda: "7.7%" },
        { nutrient: "Protein", perServe: "3.2 g", rda: "6.5%" },
        { nutrient: "Carbohydrate", perServe: "31.9 g", rda: "10.6%" },
        { nutrient: "Total sugar", perServe: "9.9 g" },
        { nutrient: "Added sugar", perServe: "9.6 g", rda: "19.2%" },
        { nutrient: "Dietary fibre", perServe: "2.4 g", rda: "9.6%" },
        { nutrient: "Sodium", perServe: "119.0 mg", rda: "5.9%" },
        { nutrient: "Total fat", perServe: "1.4 g", rda: "2.1%" },
        { nutrient: "Saturated fat", perServe: "0.3 g", rda: "1.5%" },
        { nutrient: "Trans fat", perServe: "0.0 g", rda: "0.4%" },
        { nutrient: "Cholesterol", perServe: "0.0 mg", rda: "0.0%" },
      ],
      footnotes: [
        "Approx values. % RDA based on ICMR guidelines.",
        "Added sugar from unrefined sugar.",
      ],
    },
  },
  "slurrp-farm-choco-crunch-ragi-cereal": {
    nutritionFacts: {
      servingSize: "Approx. 20 g",
      servingsPerPack: "15",
      columns: ["perServe", "rda"],
      rows: [
        { nutrient: "Energy", perServe: "61 kcal", rda: "3.1%" },
        { nutrient: "Protein", perServe: "1.1 g", rda: "2.1%" },
        { nutrient: "Carbohydrate", perServe: "12.3 g" },
        { nutrient: "Total sugar", perServe: "4.5 g" },
        { nutrient: "Added sugar", perServe: "4.5 g", rda: "9.0%" },
        { nutrient: "Dietary fibre", perServe: "1.0 g", rda: "3.2%" },
        { nutrient: "Sodium", perServe: "0.5 mg", rda: "0.0%" },
        { nutrient: "Total fat", perServe: "0.7 g", rda: "1.0%" },
        { nutrient: "Saturated fat", perServe: "0.2 g", rda: "0.8%" },
        { nutrient: "Trans fat", perServe: "0.0 g", rda: "0.0%" },
        { nutrient: "Cholesterol", perServe: "0.0 mg" },
      ],
      footnotes: ["Approx values. % RDA based on ICMR 2024 (Sedentary Man)."],
    },
  },
  "slurrp-farm-millet-noodles-masala": {
    nutritionFacts: {
      servingSize: "Approx. 50 g (1 bowl)",
      servingsPerPack: "8",
      columns: ["per100g", "perServe", "rda"],
      rows: [
        { nutrient: "Energy", per100g: "342 kcal", perServe: "171 kcal", rda: "9.7%" },
        { nutrient: "Protein", per100g: "9.3 g", perServe: "4.7 g", rda: "19.4%" },
        { nutrient: "Carbohydrate", per100g: "73.1 g", perServe: "36.6 g" },
        { nutrient: "Total sugar", per100g: "3.0 g", perServe: "1.5 g" },
        { nutrient: "Added sugar", per100g: "0.8 g", perServe: "0.4 g", rda: "0.9%" },
        { nutrient: "Dietary fibre", per100g: "14.0 g", perServe: "7.0 g", rda: "26.9%" },
        { nutrient: "Sodium", per100g: "531.2 mg", perServe: "265.6 mg", rda: "13.3%" },
        { nutrient: "Total fat", per100g: "2.6 g", perServe: "1.3 g", rda: "2.2%" },
        { nutrient: "Saturated fat", per100g: "0.3 g", perServe: "0.1 g", rda: "0.7%" },
        { nutrient: "Trans fat", per100g: "0.0 g", perServe: "0.0 g", rda: "0.0%" },
        { nutrient: "Cholesterol", per100g: "0.0 mg", perServe: "0.0 mg" },
      ],
      footnotes: ["% RDA based on ICMR 2024 (Children 4–12 years)."],
    },
  },
  "slurrp-farm-millet-dosa-spinach": {
    nutritionFacts: {
      servingSize: "Approx. 50 g (makes two 5″ dosas)",
      servingsPerPack: "3",
      columns: ["per100g", "rda"],
      rows: [
        { nutrient: "Energy", per100g: "386.8 kcal", rda: "19.3%" },
        { nutrient: "Protein", per100g: "13.0 g", rda: "26.0%" },
        { nutrient: "Carbohydrate", per100g: "75.4 g" },
        { nutrient: "Total sugar", per100g: "1.3 g" },
        { nutrient: "Added sugar", per100g: "0.00 g" },
        { nutrient: "Dietary fibre", per100g: "6.7 g", rda: "26.8%" },
        { nutrient: "Sodium", per100g: "569.9 mg", rda: "28.5%" },
        { nutrient: "Total fat", per100g: "3.8 g", rda: "5.7%" },
        { nutrient: "Saturated fat", per100g: "0.9 g", rda: "4.5%" },
        { nutrient: "Trans fat", per100g: "0.0 g", rda: "0.0%" },
        { nutrient: "Cholesterol", per100g: "0.0 mg" },
      ],
    },
  },
  "slurrp-farm-macaroni-pasta": {
    nutritionFacts: {
      servingSize: "100 g (dry)",
      servingsPerPack: "4",
      columns: ["per100g"],
      rows: [
        { nutrient: "Energy", per100g: "359 kcal" },
        { nutrient: "Protein", per100g: "5.7 g" },
        { nutrient: "Carbohydrate", per100g: "80.4 g" },
        { nutrient: "Total sugar", per100g: "0.7 g" },
        { nutrient: "Added sugar", per100g: "0 g" },
        { nutrient: "Dietary fibre", per100g: "2.9 g" },
        { nutrient: "Sodium", per100g: "5.3 mg" },
        { nutrient: "Total fat", per100g: "1.6 g" },
        { nutrient: "Saturated fat", per100g: "0.3 g" },
        { nutrient: "Trans fat", per100g: "0 g" },
        { nutrient: "Cholesterol", per100g: "0 mg" },
      ],
      footnotes: ["Values per 100 g dry pasta, from official brand listing."],
    },
  },
  "superyou-multigrain-protein-chips": {
    nutritionFacts: {
      servingSize: "40 g",
      servingsPerPack: "1",
      columns: ["per100g", "perServe"],
      rows: [
        { nutrient: "Energy", per100g: "418 kcal", perServe: "167 kcal" },
        { nutrient: "Protein", per100g: "25 g", perServe: "10 g" },
        { nutrient: "Carbohydrate", per100g: "62.5 g", perServe: "25 g" },
        { nutrient: "Total fat", per100g: "6.5 g", perServe: "2.6 g" },
        { nutrient: "Dietary fibre", per100g: "7.5 g", perServe: "3 g" },
      ],
      footnotes: ["Per-serve values based on a 40 g pack from official listing."],
    },
  },
  "slurrp-farm-choco-ragi-cookies": {
    nutritionFacts: {
      servingSize: "4 cookies (approx. 16 g)",
      servingsPerPack: "5",
      columns: ["perServe", "rda"],
      rows: [
        { nutrient: "Energy", perServe: "59.2 kcal", rda: "3.0%" },
        { nutrient: "Protein", perServe: "1.1 g" },
        { nutrient: "Carbohydrate", perServe: "7.7 g" },
        { nutrient: "Total sugar", perServe: "3.5 g" },
        { nutrient: "Added sugar", perServe: "3.3 g", rda: "6.6%" },
        { nutrient: "Dietary fibre", perServe: "1.0 g" },
        { nutrient: "Sodium", perServe: "43.2 mg", rda: "2.2%" },
        { nutrient: "Total fat", perServe: "2.3 g", rda: "3.4%" },
        { nutrient: "Saturated fat", perServe: "0.5 g", rda: "2.3%" },
        { nutrient: "Trans fat", perServe: "0.0 g", rda: "0.0%" },
        { nutrient: "Cholesterol", perServe: "0.0 mg" },
      ],
      footnotes: [
        "Added sugar from jaggery and raw unrefined sugar.",
        "% RDA based on ICMR 2024 (Sedentary Man).",
      ],
    },
  },
};

export function getProductLabelData(slug: string) {
  return PRODUCT_LABEL_DATA[slug];
}

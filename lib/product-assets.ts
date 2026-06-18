import assets from "./product-assets.json";

export type ProductAssets = {
  gallery: string[];
  ingredientsLabelImage?: string;
  nutritionLabelImage?: string;
};

const PRODUCT_ASSETS = assets as Record<string, ProductAssets>;

export function getProductAssets(slug: string): ProductAssets | undefined {
  return PRODUCT_ASSETS[slug];
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStorefrontProduct,
  storefrontProducts,
  hasPantryMeta,
} from "@/lib/products";
import { getProductAssets } from "@/lib/product-assets";
import { getProductLabelData } from "@/lib/product-label-data";
import { getSupplierById } from "@/lib/suppliers";
import { money } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";
import { ProductMetaChips } from "@/components/ProductMetaChips";
import { IngredientsList } from "@/components/IngredientsList";
import { NutritionFactsTable } from "@/components/NutritionFactsTable";
import { ProductGallery } from "@/components/ProductGallery";
import {
  ProductDetailAccordion,
  type ProductDetailAccordionItem,
} from "@/components/ProductDetailAccordion";
import { ProductViewTracker } from "@/components/ProductViewTracker";

export const dynamicParams = false;

export function generateStaticParams() {
  return storefrontProducts().map((p) => ({ slug: p.slug }));
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-medium mb-3">{children}</h2>;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getStorefrontProduct(slug);
  if (!product || !hasPantryMeta(product)) notFound();

  const meta = product.pantry;
  const supplier = product.supplierId
    ? getSupplierById(product.supplierId)
    : null;
  const brandName = supplier?.name ?? product.brand;
  const assets = getProductAssets(slug);
  const labelData = getProductLabelData(slug);
  const gallery = assets?.gallery?.length
    ? assets.gallery
    : meta.gallery?.length
      ? meta.gallery
      : [product.image];

  const nutritionContent = labelData?.nutritionFacts ? (
    <NutritionFactsTable facts={labelData.nutritionFacts} />
  ) : (
    <div className="border border-line bg-surface px-4 py-4 sm:px-5 text-sm leading-relaxed text-muted">
      <p>See package label for nutrition information.</p>
    </div>
  );

  const labelSections: ProductDetailAccordionItem[] = [
    {
      id: "nutrition",
      title: "Nutrition information",
      content: nutritionContent,
    },
    {
      id: "ingredients",
      title: "Ingredients",
      content: (
        <IngredientsList
          sections={meta.ingredientSections}
          note={meta.ingredientsNote}
          allergens={meta.allergens}
        />
      ),
    },
    {
      id: "directions",
      title: "Directions",
      content: (
        <div className="space-y-4">
          <p>{meta.preparation}</p>
          <p className="text-muted">{meta.storage}</p>
        </div>
      ),
    },
  ];

  return (
    <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductViewTracker productId={product.id} />

      <ProductGallery
        images={gallery}
        alt={product.imageAlt ?? product.name}
      />

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl mb-2">{product.name}</h1>
          <p className="text-muted">{meta.roleLine}</p>
          <div className="mt-3">
            <ProductMetaChips
              audience={meta.audience}
              ageLabel={meta.ageLabel}
              badges={meta.badges}
            />
          </div>
        </div>

        <div className="border-b border-line pb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl tabular-nums">{money(product.ourPrice)}</span>
            <span className="text-sm text-muted">/ {product.unit}</span>
          </div>
          {brandName && (
            <p className="mt-2 text-sm text-muted">
              From{" "}
              {supplier ? (
                <Link
                  href={`/suppliers/${supplier.slug}`}
                  className="text-foreground/80 hover:text-accent hover:underline underline-offset-4"
                >
                  {brandName}
                </Link>
              ) : (
                brandName
              )}
            </p>
          )}
        </div>

        <AddToCart productId={product.id} />

        <section>
          <SectionHeading>About this item</SectionHeading>
          <div className="text-sm leading-relaxed text-foreground/85 space-y-4">
            {product.longDescription.trim() && <p>{product.longDescription}</p>}
            <p>{meta.whySelected}</p>
          </div>
        </section>

        <ProductDetailAccordion items={labelSections} />

        <Link
          href="/#pantry"
          className="text-sm text-muted hover:text-foreground underline underline-offset-4"
        >
          ← Back to pantry
        </Link>
      </div>
    </article>
  );
}

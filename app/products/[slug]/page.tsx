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
import { AudienceIcons } from "@/components/AudienceIcons";
import { BrandLogo } from "@/components/BrandLogo";
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

function ageHint(suggestedAge?: string): string | undefined {
  if (!suggestedAge) return undefined;
  const fromMonths = suggestedAge.match(/(?:from|From)\s+(\d+\s+months?\.?)/i);
  if (fromMonths) return `From ${fromMonths[1].replace(/\.$/, "")}`;
  if (/^From \d+/i.test(suggestedAge.trim())) {
    return suggestedAge.trim().replace(/\.$/, "");
  }
  if (/not for babies|supervise young children/i.test(suggestedAge)) {
    return suggestedAge;
  }
  return undefined;
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
  const assets = getProductAssets(slug);
  const labelData = getProductLabelData(slug);
  const gallery = assets?.gallery?.length
    ? assets.gallery
    : meta.gallery?.length
      ? meta.gallery
      : [product.image];

  const brandName = supplier?.name ?? product.brand ?? "—";
  const ageNote = ageHint(meta.suggestedAge);

  const nutritionContent = labelData?.nutritionFacts ? (
    <NutritionFactsTable facts={labelData.nutritionFacts} />
  ) : (
    <div className="border border-line bg-surface px-4 py-4 sm:px-5 text-sm leading-relaxed text-foreground/85">
      {meta.nutritionHighlights || (
        <p className="text-muted">
          See package label for nutrition information.
        </p>
      )}
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
          {supplier?.logo && (
            <BrandLogo supplier={supplier} linked className="relative h-8 w-24 mb-3" />
          )}
          {!supplier?.logo && product.brand && (
            <p className="text-xs uppercase tracking-wider text-muted mb-2">
              {product.brand}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl mb-2">{product.name}</h1>
          <p className="text-muted">{meta.roleLine}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.badges.map((b) => (
              <span
                key={b}
                className="text-[9px] uppercase tracking-wide border border-line px-2 py-0.5 text-muted"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-line pb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl tabular-nums">{money(product.ourPrice)}</span>
            <span className="text-sm text-muted">/ {product.unit}</span>
          </div>
        </div>

        <AddToCart productId={product.id} />

        <section>
          <SectionHeading>About this item</SectionHeading>
          <div className="text-sm leading-relaxed text-foreground/85 space-y-4">
            {product.longDescription.trim() && <p>{product.longDescription}</p>}
            <p>{meta.whySelected}</p>
          </div>
        </section>

        <section>
          <SectionHeading>Specifications</SectionHeading>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-line pt-4">
            {!supplier?.logo && (
              <div>
                <dt className="text-muted mb-0.5">Brand</dt>
                <dd>
                  {supplier ? (
                    <Link
                      href={`/suppliers/${supplier.slug}`}
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      {supplier.name}
                    </Link>
                  ) : (
                    brandName
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-muted mb-0.5">Net weight</dt>
              <dd>{product.unit}</dd>
            </div>
            <div>
              <dt className="text-muted mb-1">Suggested for</dt>
              <dd className="space-y-1.5">
                <AudienceIcons audience={meta.audience} />
                {ageNote && (
                  <p className="text-xs text-muted leading-snug">{ageNote}</p>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted mb-0.5">Also good for</dt>
              <dd>{meta.occasions.join(", ")}</dd>
            </div>
          </dl>
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

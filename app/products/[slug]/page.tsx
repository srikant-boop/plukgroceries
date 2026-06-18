import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStorefrontProduct,
  storefrontProducts,
  hasPantryMeta,
} from "@/lib/products";
import { getSupplierById } from "@/lib/suppliers";
import { money } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";
import { ProductViewTracker } from "@/components/ProductViewTracker";

export const dynamicParams = false;

export function generateStaticParams() {
  return storefrontProducts().map((p) => ({ slug: p.slug }));
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="eyebrow mb-2">{title}</h2>
      <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
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
  const gallery = meta.gallery?.length ? meta.gallery : [product.image];

  return (
    <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductViewTracker productId={product.id} />

      <div className="space-y-3">
        <div className="relative aspect-[4/5] bg-surface">
          <Image
            src={gallery[0]!}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.slice(1, 5).map((src) => (
              <div key={src} className="relative aspect-square bg-surface">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div>
          {product.brand && (
            <p className="text-xs uppercase tracking-wider text-muted mb-2">
              {product.brand}
            </p>
          )}
          <p className="eyebrow mb-3">{product.category}</p>
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

        <dl className="grid grid-cols-2 gap-4 text-sm border-y border-line py-4">
          <div>
            <dt className="eyebrow mb-1">Who it&apos;s for</dt>
            <dd>{meta.audience.join(", ")}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Also good for</dt>
            <dd>{meta.occasions.join(", ")}</dd>
          </div>
          {meta.suggestedAge && (
            <div>
              <dt className="eyebrow mb-1">Suggested age</dt>
              <dd>{meta.suggestedAge}</dd>
            </div>
          )}
          <div>
            <dt className="eyebrow mb-1">Net weight</dt>
            <dd>{product.unit}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Country of origin</dt>
            <dd>{meta.countryOfOrigin}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Brand</dt>
            <dd>
              {supplier ? (
                <Link
                  href={`/suppliers/${supplier.slug}`}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {supplier.name}
                </Link>
              ) : (
                product.brand ?? "—"
              )}
            </dd>
          </div>
        </dl>

        <DetailBlock title="Why we selected it">
          <p>{meta.whySelected}</p>
        </DetailBlock>

        {product.longDescription.trim() && (
          <DetailBlock title="About this product">
            <p>{product.longDescription}</p>
          </DetailBlock>
        )}

        <DetailBlock title="Ingredients">
          <p>{meta.ingredients}</p>
        </DetailBlock>

        <DetailBlock title="Allergen information">
          <p>{meta.allergens}</p>
        </DetailBlock>

        <DetailBlock title="Nutrition highlights">
          <p>{meta.nutritionHighlights}</p>
        </DetailBlock>

        <DetailBlock title="Preparation">
          <p>{meta.preparation}</p>
        </DetailBlock>

        <DetailBlock title="Storage">
          <p>{meta.storage}</p>
        </DetailBlock>

        {meta.sourceUrl && (
          <p className="text-sm">
            <a
              href={meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-accent"
            >
              Official product source ↗
            </a>
          </p>
        )}

        <div className="border border-line bg-surface p-4 text-xs leading-relaxed text-muted space-y-2">
          <p>
            Final Canadian label review required before sale.
          </p>
          <p>
            Product information is based on official brand/source data where
            available. Always read the package label before use, especially for
            babies, toddlers, allergies, and dietary restrictions.
          </p>
        </div>

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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, pricePerLbLabel } from "@/lib/products";
import { getSupplierById, supplierIntroLabel } from "@/lib/suppliers";
import { money } from "@/lib/format";
import { PriceCompareTable } from "@/components/PriceCompareTable";
import { AddToCart } from "@/components/AddToCart";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const hasCompetitors = product.competitors.length > 0;
  const supplier = product.supplierId
    ? getSupplierById(product.supplierId)
    : null;
  return (
    <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] bg-surface">
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow mb-3">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl mb-2">{product.name}</h1>
          <p className="text-muted">{product.shortDescription}</p>
          {product.organic && (
            <p className="mt-3 inline-block text-[10px] uppercase tracking-wider text-accent border border-accent px-2 py-1">
              Certified organic
            </p>
          )}
          {product.special && supplier && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
              <span className="inline-block w-6 border-t border-accent" />
              {product.special} · from {supplier.name}
            </p>
          )}
        </div>

        <div className="border-b border-line pb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl tabular-nums">{money(product.ourPrice)}</span>
            <span className="text-sm text-muted">/ {product.unit}</span>
            {pricePerLbLabel(product) && (
              <span className="text-sm text-muted">
                · {pricePerLbLabel(product)}
              </span>
            )}
          </div>
        </div>

        <AddToCart productId={product.id} />

        {product.special && supplier && (
          <section className="text-sm leading-relaxed text-foreground/85 space-y-3">
            <p className="eyebrow">{supplierIntroLabel(supplier)}</p>
            <p>{supplier.discoverBlurb ?? supplier.story.split(/\n\n+/)[0]}</p>
            <Link
              href={`/suppliers/${supplier.slug}`}
              className="inline-block text-xs underline underline-offset-4 hover:text-accent"
            >
              Get to know them →
            </Link>
          </section>
        )}

        {product.longDescription.trim() && (
          <div className="text-sm leading-relaxed text-foreground/85 space-y-3">
            {product.longDescription.split(/\n\n+/).map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-4 text-sm border-y border-line py-4">
          <div>
            <dt className="eyebrow mb-1">Unit</dt>
            <dd>{product.unit}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">
              {supplier?.type === "wholesaler"
                ? "Wholesaler"
                : supplier?.type === "maker"
                  ? "Maker"
                  : "Farmer"}
            </dt>
            <dd>
              {supplier ? (
                <Link
                  href={`/suppliers/${supplier.slug}`}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {supplier.name}
                </Link>
              ) : (
                <span className="text-muted">—</span>
              )}
            </dd>
          </div>
        </dl>

        {/* Comparison table is savings framing — wrong frame for Discover items. */}
        {!product.special && hasCompetitors && (
          <PriceCompareTable product={product} />
        )}

        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground underline underline-offset-4"
        >
          ← Back to shop
        </Link>
      </div>
    </article>
  );
}

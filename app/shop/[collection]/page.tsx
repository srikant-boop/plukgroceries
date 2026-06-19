import Link from "next/link";
import { notFound } from "next/navigation";
import { activePantryCollections, PANTRY_COLLECTIONS } from "@/lib/pantry-catalog";
import { productsInCollection } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Leaf } from "@/components/Leaf";

export const dynamicParams = false;

export function generateStaticParams() {
  return activePantryCollections().map(({ slug }) => ({ collection: slug }));
}

export default async function ShopCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const section = PANTRY_COLLECTIONS.find((c) => c.slug === collection);
  if (!section) notFound();

  const items = productsInCollection(collection as (typeof PANTRY_COLLECTIONS)[number]["slug"]);

  return (
    <div>
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Leaf size={14} className="text-accent" aria-hidden />
          Shop · À la carte
        </p>
        <h1 className="text-3xl sm:text-4xl mb-3">{section.title}</h1>
        <p className="text-sm text-muted max-w-xl">
          Individual products — add any item to your cart. No bundles required.
        </p>
      </header>

      <div className="grid grid-cols-2 items-stretch gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <Link
        href="/"
        className="inline-block mt-12 text-sm text-muted hover:text-foreground underline underline-offset-4"
      >
        ← Back to pantry
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { products, categories, specialProducts } from "@/lib/products";
import { getSupplierById } from "@/lib/suppliers";
import { currentDropNote } from "@/lib/drop";
import { SITE_TITLE } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaf } from "@/components/Leaf";

export default function Home() {
  const cats = categories();
  const specials = specialProducts();
  const specialSupplierIds = Array.from(
    new Set(specials.map((p) => p.supplierId).filter(Boolean)),
  );
  const sharedSupplier =
    specialSupplierIds.length === 1
      ? getSupplierById(specialSupplierIds[0]!)
      : null;
  return (
    <div>
      <section className="relative -mx-6 -mt-10 mb-12 overflow-hidden border-b border-line">
        <div className="relative min-h-[400px] sm:min-h-[440px]">
          <Image
            src="/hero-weekly-drops.jpg"
            alt="Fresh vegetables and honey on a linen table in warm morning light"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-background from-30% via-background/92 via-50% to-transparent"
          />
        </div>
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div className="max-w-xl py-10">
            <p className="eyebrow mb-4 inline-flex items-center gap-2">
              <Leaf size={14} className="text-accent" aria-hidden />
              Oakville · Weekly drops
            </p>
            <h1 className="text-3xl sm:text-[3.25rem] leading-[1.06] mb-5">
              {SITE_TITLE}.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
              A weekly drop of good food — a short list of produce, pantry,
              and sometimes something from a neighbour: a jar of honey, a
              bottle you haven&apos;t tried yet. We keep our prices low and show
              how we compare for each item against the big national chains.
            </p>
          </div>
        </div>
      </section>
      <HowItWorks />

      {specials.length > 0 && (
        <section id="this-week" className="mb-16">
          <div className="mb-6 flex items-baseline justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-baseline gap-3">
              <Leaf size={16} className="text-accent" />
              <h2 className="text-2xl">This week</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:items-start">
            <div className="col-span-2 sm:col-span-3 lg:col-span-2 text-sm leading-relaxed text-foreground/85">
              <p>{currentDropNote}</p>
              {sharedSupplier && (
                <Link
                  href={`/suppliers/${sharedSupplier.slug}`}
                  className="mt-3 inline-block text-xs underline underline-offset-4 hover:text-accent"
                >
                  Read their story →
                </Link>
              )}
            </div>
            {specials.map((p, i) => (
              <div
                key={p.id}
                className={i === 0 ? "lg:col-start-3" : i === 1 ? "lg:col-start-4" : undefined}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        {cats.map((cat) => {
          // Specials are already featured in the Discover section above —
          // don't double-list them in their category section.
          const items = products.filter(
            (p) => p.category === cat && !p.special,
          );
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-16">
              <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                <div className="flex items-baseline gap-3">
                  <Leaf size={16} className="text-accent" />
                  <h2 className="text-2xl">{cat}</h2>
                </div>
                <span className="eyebrow">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

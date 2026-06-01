import Image from "next/image";
import Link from "next/link";
import { products, categories, specialProducts } from "@/lib/products";
import { getSupplierById } from "@/lib/suppliers";
import { currentDropNote } from "@/lib/drop";
import { ProductCard } from "@/components/ProductCard";
import { Leaf } from "@/components/Leaf";

export default function Home() {
  const cats = categories();
  const specials = specialProducts();
  // If all the special items share one supplier, surface a "read full story"
  // link to their profile. Multiple suppliers → skip the link.
  const specialSupplierIds = Array.from(
    new Set(specials.map((p) => p.supplierId).filter(Boolean)),
  );
  const sharedSupplier =
    specialSupplierIds.length === 1
      ? getSupplierById(specialSupplierIds[0]!)
      : null;
  return (
    <div>
      <section className="relative -mx-6 -mt-10 mb-12 overflow-hidden">
        <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1768734837803-54eb8c83e080?auto=format&fit=crop&w=2000&q=80"
            alt="Baskets of fresh vegetables at a farmers market stall"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/30"
          />
        </div>
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Weekly drops · Top-grade fresh</p>
            <h1 className="text-3xl sm:text-5xl leading-[1.05] mb-5">
              Real food and the makers behind it.
            </h1>
            <p className="text-foreground/85 text-base sm:text-lg leading-relaxed max-w-xl mb-6">
              Top-grade produce, pantry, and the occasional handmade thing.
              Picked up at a community spot each week.
            </p>
            <a
              href="https://www.facebook.com/share/g/1cRmroAoyr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-2 text-sm border-b border-foreground pb-0.5 hover:opacity-70"
            >
              Join the Oakville group for the next drop date
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {specials.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-baseline justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-baseline gap-3">
              <Leaf size={16} className="text-accent" />
              <h2 className="text-2xl">Discover</h2>
            </div>
            <span className="eyebrow">This drop</span>
          </div>
          <div className="grid gap-8 sm:grid-cols-[1fr_2fr] mb-2">
            <div className="text-sm leading-relaxed text-foreground/85">
              <p>{currentDropNote}</p>
              {sharedSupplier && (
                <Link
                  href={`/suppliers/${sharedSupplier.slug}`}
                  className="mt-3 inline-block text-xs underline underline-offset-4 hover:text-accent"
                >
                  Meet {sharedSupplier.name} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {specials.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
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

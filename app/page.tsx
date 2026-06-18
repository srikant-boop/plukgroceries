import Link from "next/link";
import { storefrontProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks, HowWeChoose } from "@/components/HowItWorks";
import { Leaf } from "@/components/Leaf";

export default function Home() {
  const products = storefrontProducts();

  return (
    <div>
      <section className="relative -mx-6 -mt-10 mb-12 overflow-hidden border-b border-line bg-surface">
        <div className="px-6 sm:px-10 py-14 sm:py-20 max-w-3xl">
          <p className="eyebrow mb-4 inline-flex items-center gap-2">
            <Leaf size={14} className="text-accent" aria-hidden />
            Curated Indian family pantry · Canada
          </p>
          <h1 className="text-3xl sm:text-[2.75rem] leading-[1.08] mb-5">
            Clean Indian foods for babies, kids, and families in Canada.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-foreground/80 mb-8">
            A small à la carte pantry of carefully selected Indian breakfast,
            snack, and quick-meal products — chosen for parents who want cleaner
            options without hunting across expensive import sites.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#pantry" className="btn px-6 py-3 text-sm">
              Shop the Pantry
            </Link>
            <Link
              href="#how-we-choose"
              className="inline-flex items-center px-6 py-3 text-sm border border-line hover:bg-background"
            >
              How We Choose Products
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12 text-sm leading-relaxed text-foreground/80 max-w-2xl">
        <p>
          Browse a small à la carte shelf — not a full Indian grocery store.
          Each product is individually purchasable. The shelf is intentionally
          small so you are not comparing endless options.
        </p>
      </section>

      <HowItWorks />

      <section id="pantry" className="mb-16 scroll-mt-24">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
          <div className="flex items-baseline gap-3">
            <Leaf size={16} className="text-accent" />
            <h2 className="text-2xl">Shop the pantry</h2>
          </div>
          <span className="eyebrow">{products.length} products</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <HowWeChoose />

      <section className="mb-8 border-t border-line pt-12">
        <h2 className="text-xl mb-3">Why this exists</h2>
        <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
          Indian-Canadian parents often want familiar breakfast and snack options
          for their kids — without paying import-site premiums or wading through
          a full ethnic aisle. PLUK is a small pantry: limited selection, trusted
          brands, buy what you need, one product at a time.
        </p>
      </section>
    </div>
  );
}

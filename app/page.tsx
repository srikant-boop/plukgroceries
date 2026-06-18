import Link from "next/link";
import { storefrontProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaf } from "@/components/Leaf";

export default function Home() {
  const products = storefrontProducts();

  return (
    <div>
      <section className="relative -mx-6 -mt-10 mb-12 overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url('/hero-pantry-bg-mobile.webp')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-[center_40%] bg-no-repeat md:block"
          style={{ backgroundImage: "url('/hero-pantry-bg.webp')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/35 sm:via-background/88 sm:to-background/20"
          aria-hidden
        />
        <div className="relative px-6 sm:px-10 py-14 sm:py-20 max-w-3xl">
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
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 text-sm border border-line bg-surface/85 backdrop-blur-sm hover:bg-surface"
            >
              How it works
            </Link>
          </div>
        </div>
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
    </div>
  );
}

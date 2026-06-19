import Link from "next/link";
import { storefrontProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaf } from "@/components/Leaf";

export default function Home() {
  const products = storefrontProducts();

  return (
    <div>
      <section className="relative -mx-6 -mt-10 mb-12 overflow-hidden">
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
        <div className="absolute inset-x-0 bottom-0 h-36 overflow-hidden sm:h-44" aria-hidden>
          <div
            className="absolute -inset-x-6 top-0 h-full backdrop-blur-[2px] sm:backdrop-blur-sm"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 75%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 75%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/75 to-background" />
        </div>
        <div className="relative px-6 sm:px-10 py-14 sm:py-20 max-w-3xl">
          <h1 className="text-3xl sm:text-[2.75rem] leading-[1.08] mb-5">
            Clean Indian foods for the whole family.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-foreground/80 mb-8">
            A short à la carte shelf of trusted breakfast, snack, and quick-meal
            brands — preorder one product or build your basket.
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

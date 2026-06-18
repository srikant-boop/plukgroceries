import Link from "next/link";
import { carriedBrands } from "@/lib/suppliers";
import { BrandLogo } from "@/components/BrandLogo";
import { Leaf } from "@/components/Leaf";

export default function BrandsPage() {
  const brands = carriedBrands();

  return (
    <div>
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Leaf size={14} className="text-accent" aria-hidden />
          Brands we carry
        </p>
        <h1 className="text-3xl sm:text-4xl mb-3">Trusted Indian brands</h1>
        <p className="text-sm text-muted max-w-xl">
          A short list of brands on our curated shelf — not every product they
          make, only the SKUs that earn a place for Canadian families.
        </p>
      </header>

      <ul className="space-y-6">
        {brands.map((b) => (
          <li key={b.id}>
            <Link
              href={`/suppliers/${b.slug}`}
              className="flex gap-5 border border-line p-6 hover:bg-surface transition-colors"
            >
              <BrandLogo supplier={b} className="relative h-12 w-24 shrink-0" />
              <div className="min-w-0">
              <h2 className="text-xl mb-1">{b.name}</h2>
              <p className="text-sm text-muted mb-3">{b.tagline}</p>
              <p className="text-sm text-foreground/80 line-clamp-2">
                {b.story.split("\n\n")[0]}
              </p>
              <span className="inline-block mt-3 text-xs underline underline-offset-4">
                View brand & products →
              </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/#pantry"
        className="inline-block mt-12 text-sm text-muted hover:text-foreground underline underline-offset-4"
      >
        ← Shop the pantry
      </Link>
    </div>
  );
}

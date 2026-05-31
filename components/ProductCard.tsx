import Image from "next/image";
import Link from "next/link";
import { type Product, cheapestCompetitor } from "@/lib/products";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  // Strike through the CHEAPEST competitor — not the highest — so we only
  // signal a saving when we beat the most honest peer comparison. When we
  // lose to the cheapest, show nothing.
  const cheapest = cheapestCompetitor(product);
  const showCompare =
    !product.special && cheapest && cheapest.price > product.ourPrice;
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-lg leading-tight">{product.name}</h3>
          <p className="text-xs text-muted mt-0.5">{product.unit}</p>
          {product.organic && (
            <p className="text-[10px] uppercase tracking-wider text-accent mt-1">
              Organic
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-base tabular-nums">{money(product.ourPrice)}</p>
          {showCompare && (
            <p className="text-[11px] text-price-cut line-through tabular-nums">
              {money(cheapest!.price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

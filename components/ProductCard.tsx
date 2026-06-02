"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product, cheapestCompetitor } from "@/lib/products";
import { money } from "@/lib/format";
import { track } from "@/lib/analytics-client";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const qty = useCart(
    (s) => s.lines.find((l) => l.productId === product.id)?.qty ?? 0,
  );

  // Strike through the CHEAPEST competitor — not the highest — so we only
  // signal a saving when we beat the most honest peer comparison. When we
  // lose to the cheapest, show nothing.
  const cheapest = cheapestCompetitor(product);
  const showCompare =
    !product.special && cheapest && cheapest.price > product.ourPrice;

  const handleAdd = () => {
    add(product.id, 1);
    track("add_to_cart", { productId: product.id, qty: 1 });
  };

  const increment = () => {
    const next = qty + 1;
    setQty(product.id, next);
    track("add_to_cart", { productId: product.id, qty: 1 });
  };

  const decrement = () => {
    setQty(product.id, qty - 1);
  };

  return (
    <div className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link
          href={`/products/${product.slug}`}
          onClick={() => track("product_click", { productId: product.id })}
        >
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="hover:underline underline-offset-4"
            onClick={() => track("product_click", { productId: product.id })}
          >
            <h3 className="text-lg leading-tight">{product.name}</h3>
          </Link>
          <p className="text-xs text-muted mt-0.5">{product.unit}</p>
          {product.organic && (
            <p className="text-[10px] uppercase tracking-wider text-accent mt-1">
              Organic
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base tabular-nums whitespace-nowrap">
            {money(product.ourPrice)}
          </p>
          {showCompare && (
            <p className="text-[11px] text-price-cut line-through tabular-nums">
              {money(cheapest!.price)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3">
        {qty <= 0 ? (
          <button
            type="button"
            className="btn h-10 w-full text-sm"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to cart
          </button>
        ) : (
          <div className="inline-flex h-10 w-full items-center justify-between border border-line bg-surface">
            <button
              type="button"
              className="px-3 py-2 text-lg leading-none hover:bg-background"
              onClick={decrement}
              aria-label={`Decrease ${product.name} quantity`}
            >
              −
            </button>
            <span className="text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              className="px-3 py-2 text-lg leading-none hover:bg-background"
              onClick={increment}
              aria-label={`Increase ${product.name} quantity`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

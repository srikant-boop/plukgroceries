"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type Product,
  cheapestCompetitor,
  hasPantryMeta,
} from "@/lib/products";
import { cardBadges, type PantryProduct } from "@/lib/pantry-catalog";
import { money } from "@/lib/format";
import { track } from "@/lib/analytics-client";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const qty = useCart(
    (s) => s.lines.find((l) => l.productId === product.id)?.qty ?? 0,
  );

  const cheapest = cheapestCompetitor(product);
  const showCompare = cheapest && cheapest.price > product.ourPrice;

  const pantry = hasPantryMeta(product) ? product.pantry : null;
  const badges = pantry ? cardBadges(product as PantryProduct) : [];

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
    <div className="group flex h-full flex-col">
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
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="hover:underline underline-offset-4"
              onClick={() => track("product_click", { productId: product.id })}
            >
              <h3 className="text-lg leading-tight line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
            </Link>
            {pantry && (
              <p className="text-xs text-foreground/75 mt-1 leading-snug line-clamp-2 min-h-[2.5rem]">
                {pantry.roleLine}
              </p>
            )}
            <p className="text-xs text-muted mt-0.5 min-h-[1rem]">{product.unit}</p>
            <div className="mt-2 min-h-[2.75rem] flex flex-wrap content-start gap-1">
              {badges.map((b) => (
                <span
                  key={b}
                  className="text-[9px] uppercase tracking-wide border border-line px-1.5 py-0.5 text-muted"
                >
                  {b}
                </span>
              ))}
            </div>
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
        <div className="mt-3 mt-auto pt-1">
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
    </div>
  );
}

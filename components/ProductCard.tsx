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
import { AudienceIcons } from "@/components/AudienceIcons";

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
          <Link
            href={`/products/${product.slug}`}
            className="min-w-0 flex-1 hover:underline underline-offset-4"
            onClick={() => track("product_click", { productId: product.id })}
          >
            <h3 className="text-lg leading-tight line-clamp-2 min-h-[2.75rem]">
              {product.name}
            </h3>
          </Link>
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
        {pantry && (
          <p className="mt-1 text-xs text-foreground/75 leading-snug line-clamp-2 min-h-[2.125rem]">
            {pantry.roleLine}
          </p>
        )}
        {pantry && (
          <div className="mt-2 flex min-h-[1.25rem] flex-wrap gap-1">
            <AudienceIcons audience={pantry.audience} variant="chip" />
          </div>
        )}
        {pantry?.suggestedAge && (
          <p className="mt-1.5 text-[11px] text-muted leading-snug line-clamp-2">
            {pantry.suggestedAge}
          </p>
        )}
        <p className="mt-1 text-xs text-muted leading-none min-h-4">
          {product.unit}
        </p>
        {pantry && (
          <div className="mt-2 flex min-h-[2.75rem] flex-wrap content-start gap-1">
            {Array.from({ length: 3 }, (_, i) => {
              const badge = badges[i];
              return (
                <span
                  key={badge ?? `badge-slot-${i}`}
                  className={
                    badge
                      ? "text-[9px] uppercase tracking-wide border border-line px-1.5 py-0.5 text-muted leading-tight"
                      : "invisible border border-transparent px-1.5 py-0.5 text-[9px] uppercase tracking-wide leading-tight"
                  }
                  aria-hidden={!badge}
                >
                  {badge ?? "Millet"}
                </span>
              );
            })}
          </div>
        )}
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

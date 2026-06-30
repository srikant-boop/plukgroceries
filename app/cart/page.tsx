"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart, hydrateLines, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { CartSavings } from "@/components/CartSavings";
import { track } from "@/lib/analytics-client";

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const [hydrated, setHydrated] = useState(false);
  const trackedView = useRef(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated || lines.length === 0 || trackedView.current) return;
    trackedView.current = true;
    track("view_cart", { qty: lines.length });
  }, [hydrated, lines.length]);

  if (!hydrated) {
    return <div className="py-20 text-center text-muted">Loading…</div>;
  }

  const items = hydrateLines(lines);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h1 className="text-3xl mb-4">Your cart is empty</h1>
        <p className="text-muted mb-8">
          Add individual products from the curated shelf — no bundles required.
        </p>
        <Link href="/#pantry" className="btn">
          Shop the Pantry
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="text-3xl mb-8">Your cart</h1>
        <ul className="border-t border-line">
          {items.map((item) => (
            <li
              key={item.productId}
              className="border-b border-line py-5 flex gap-4"
            >
              <div className="relative h-24 w-24 flex-shrink-0 bg-surface">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-lg hover:underline underline-offset-4"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-1">
                      {item.product.unit}
                    </p>
                  </div>
                  <span className="tabular-nums">
                    {money(item.product.ourPrice * item.qty)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border border-line">
                    <button
                      type="button"
                      className="px-3 py-1.5 hover:bg-background"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums text-sm">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 hover:bg-background"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="text-xs text-muted hover:text-foreground underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="lg:sticky lg:top-10 lg:self-start">
        <div className="border border-line p-6 bg-surface">
          <h2 className="text-xl mb-5">Reservation summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{money(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-muted">Home delivery in Oakville · free</dd>
            </div>
          </dl>
          <div className="mt-5 pt-5 border-t border-line flex justify-between text-lg">
            <span>Estimated total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <p className="text-[11px] text-muted mt-2 leading-relaxed">
            Not billed today. Each item ships only if its group-buy case fills;
            total may adjust slightly if import costs shift before we confirm.
          </p>
          <CartSavings items={items} />
          <Link href="/checkout" className="btn w-full mt-6">
            Reserve preorder
          </Link>
          <Link
            href="/"
            className="block text-center text-xs text-muted hover:text-foreground mt-4 underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}

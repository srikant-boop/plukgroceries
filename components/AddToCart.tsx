"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCart({ productId }: { productId: string }) {
  const add = useCart((s) => s.add);
  const inCart = useCart(
    (s) => s.lines.find((l) => l.productId === productId)?.qty ?? 0,
  );
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center border border-line">
          <button
            type="button"
            className="px-3 py-2 hover:bg-background"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center tabular-nums">{qty}</span>
          <button
            type="button"
            className="px-3 py-2 hover:bg-background"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn flex-1 sm:flex-none"
          onClick={() => add(productId, qty)}
        >
          Add to cart
        </button>
      </div>
      {inCart > 0 && (
        <p className="text-sm text-muted" aria-live="polite">
          <span className="text-foreground tabular-nums">{inCart}</span> in your
          cart ·{" "}
          <Link
            href="/cart"
            className="underline underline-offset-4 hover:text-accent"
          >
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

export function AddToCart({ productId }: { productId: string }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  return (
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
        disabled={adding}
        onClick={() => {
          setAdding(true);
          add(productId, qty);
          setTimeout(() => {
            setAdding(false);
            router.push("/cart");
          }, 150);
        }}
      >
        {adding ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}

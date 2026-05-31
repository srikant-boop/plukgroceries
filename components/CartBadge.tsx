"use client";

import { useEffect, useState } from "react";
import { useCart, cartCount } from "@/lib/cart";

export function CartBadge() {
  const lines = useCart((s) => s.lines);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const n = hydrated ? cartCount(lines) : 0;
  if (n === 0) return null;
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] text-background">
      {n}
    </span>
  );
}

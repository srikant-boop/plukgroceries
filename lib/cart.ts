"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, isStorefrontProduct, type Product } from "./products";

export type CartLine = {
  productId: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === productId ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...s.lines, { productId, qty }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) =>
                  l.productId === productId ? { ...l, qty } : l,
                ),
        })),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "pluk-cart" },
  ),
);

export type CartItem = CartLine & { product: Product };

export const hydrateLines = (lines: CartLine[]): CartItem[] =>
  lines
    .map((l) => {
      const product = products.find((p) => p.id === l.productId);
      return product && isStorefrontProduct(product) ? { ...l, product } : null;
    })
    .filter((x): x is CartItem => x !== null);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.product.ourPrice * i.qty, 0);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.qty, 0);

// Cart cost if every line had been bought at the named competitor. Lines
// where that competitor doesn't carry the item fall back to our price (so
// the line contributes zero savings instead of being silently dropped).
export const cartCostAtCompetitor = (
  items: CartItem[],
  store: string,
): number =>
  items.reduce((sum, i) => {
    const c = i.product.competitors.find((x) => x.store === store);
    return sum + (c ? c.price : i.product.ourPrice) * i.qty;
  }, 0);

export type CompetitorSavings = {
  store: string;
  theirTotal: number;
  saving: number;
  pct: number;
};

export const competitorSavings = (
  items: CartItem[],
  stores: string[],
): CompetitorSavings[] => {
  const ours = cartTotal(items);
  return stores.map((store) => {
    const theirTotal = cartCostAtCompetitor(items, store);
    const saving = theirTotal - ours;
    const pct = theirTotal > 0 ? (saving / theirTotal) * 100 : 0;
    return { store, theirTotal, saving, pct };
  });
};

export const cartCompetitorStores = (items: CartItem[]): string[] => {
  const set = new Set<string>();
  items.forEach((i) => i.product.competitors.forEach((c) => set.add(c.store)));
  return Array.from(set);
};

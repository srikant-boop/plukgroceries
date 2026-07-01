"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { rememberSkipActivityForOrder } from "@/components/group-buy-live-context";

export function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? undefined;

  useEffect(() => {
    clear();
    rememberSkipActivityForOrder(orderId);
  }, [clear, orderId]);

  return null;
}

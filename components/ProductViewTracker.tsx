"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics-client";

export function ProductViewTracker({
  productId,
}: {
  productId: string;
}) {
  useEffect(() => {
    track("product_view", { productId });
  }, [productId]);

  return null;
}

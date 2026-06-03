"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { clearStoredInviteRef } from "@/lib/invite-client";

export function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
    clearStoredInviteRef();
  }, [clear]);
  return null;
}

"use client";

import type { AnalyticsEventType } from "@/lib/analytics";

const SESSION_KEY = "pluk_sid";

function sessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type TrackProps = {
  path?: string;
  productId?: string;
  qty?: number;
};

/** Fire-and-forget client event (never blocks UI). */
export function track(type: AnalyticsEventType, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      sessionId: sessionId(),
      path: props.path ?? window.location.pathname,
      productId: props.productId,
      qty: props.qty,
    }),
    keepalive: true,
  }).catch(() => {});
}

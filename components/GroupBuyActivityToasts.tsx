"use client";

import { useGroupBuyLive } from "@/components/group-buy-live-context";

export function GroupBuyActivityToasts() {
  const live = useGroupBuyLive();
  if (!live || live.toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 flex max-w-sm flex-col gap-2 sm:bottom-6 sm:left-6"
      aria-live="polite"
      aria-label="Recent reservations"
    >
      {live.toasts.map((toast) => (
        <div
          key={toast.key}
          className="group-buy-activity-toast pointer-events-auto border border-line bg-surface px-4 py-3 text-sm leading-snug shadow-[0_8px_30px_rgba(26,26,26,0.08)]"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted mb-1">
            Live group buy
          </p>
          <p>{toast.headline}</p>
        </div>
      ))}
    </div>
  );
}

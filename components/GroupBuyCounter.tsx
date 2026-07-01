"use client";

import { useEffect, useRef, useState } from "react";
import { useGroupBuyLive } from "@/components/group-buy-live-context";
import type { GroupBuyProgress } from "@/lib/group-buy-config";

type Props = {
  productId: string;
  target?: number;
  initial?: GroupBuyProgress;
  compact?: boolean;
};

export function GroupBuyCounter({
  productId,
  target,
  initial,
  compact = false,
}: Props) {
  const live = useGroupBuyLive();
  const liveProgress = live?.getProgress(productId);
  const [local, setLocal] = useState<GroupBuyProgress | null>(initial ?? null);
  const [pulse, setPulse] = useState(false);
  const prevReserved = useRef<number | null>(null);

  useEffect(() => {
    if (liveProgress) {
      setLocal(liveProgress);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/group-buy?productId=${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { progress?: GroupBuyProgress };
        if (!cancelled && data.progress) setLocal(data.progress);
      } catch {
        /* ignore */
      }
    }

    load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [productId, liveProgress]);

  const progress = liveProgress ?? local;
  const resolvedTarget = progress?.target ?? target ?? 12;
  const reserved = progress?.reserved ?? 0;
  const pct = progress?.pct ?? 0;
  const filled = progress?.filled ?? reserved >= resolvedTarget;

  useEffect(() => {
    if (prevReserved.current == null) {
      prevReserved.current = reserved;
      return;
    }
    if (reserved !== prevReserved.current) {
      prevReserved.current = reserved;
      setPulse(true);
      const id = window.setTimeout(() => setPulse(false), 700);
      return () => window.clearTimeout(id);
    }
  }, [reserved]);

  if (compact) {
    return (
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
          <span>Group buy</span>
          <span className="tabular-nums">
            {reserved} / {resolvedTarget}
            {filled ? " · locked" : ""}
          </span>
        </div>
        <div
          className={`h-1 w-full bg-background ${pulse ? "group-buy-bar-pulse" : ""}`}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${reserved} of ${resolvedTarget} reserved`}
        >
          <div
            className={`h-full transition-all duration-500 ${filled ? "bg-accent" : "bg-foreground/40"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface px-4 py-4 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">Group buy progress</p>
        <p className="text-sm tabular-nums">
          <span className={filled ? "text-accent" : ""}>{reserved}</span>
          <span className="text-muted"> / {resolvedTarget} reserved</span>
        </p>
      </div>
      <div
        className={`h-2 w-full bg-background ${pulse ? "group-buy-bar-pulse" : ""}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-500 ${filled ? "bg-accent" : "bg-foreground/50"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted leading-relaxed">
        {filled
          ? "Case minimum reached — wholesale price is locked for this round."
          : "We only get distributor pricing when the case fills. Reserve now; pay only if the round confirms."}
      </p>
    </div>
  );
}

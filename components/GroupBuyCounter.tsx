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

function GroupBuyBar({
  pct,
  filled,
  pulse,
  compact,
  reserved,
  resolvedTarget,
}: {
  pct: number;
  filled: boolean;
  pulse: boolean;
  compact: boolean;
  reserved: number;
  resolvedTarget: number;
}) {
  const showSliver = reserved > 0 && pct < 4;
  const width = showSliver ? 4 : pct;

  return (
    <div
      className={`group-buy-track ${compact ? "group-buy-track--compact" : ""} ${pulse ? "group-buy-bar-pulse" : ""}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${reserved} of ${resolvedTarget} reserved`}
    >
      <div
        className={`group-buy-fill ${filled ? "group-buy-fill--filled" : "group-buy-fill--active"}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

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
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
          <span>Group buy</span>
          <span className="tabular-nums">
            {reserved} / {resolvedTarget}
            {filled ? " · locked" : ""}
          </span>
        </div>
        <GroupBuyBar
          pct={pct}
          filled={filled}
          pulse={pulse}
          compact
          reserved={reserved}
          resolvedTarget={resolvedTarget}
        />
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
      <GroupBuyBar
        pct={pct}
        filled={filled}
        pulse={pulse}
        compact={false}
        reserved={reserved}
        resolvedTarget={resolvedTarget}
      />
      <p className="text-xs text-muted leading-relaxed">
        {filled
          ? "Case minimum reached — wholesale price is locked for this round."
          : "We only get distributor pricing when the case fills. Reserve now; pay only if the round confirms."}
      </p>
    </div>
  );
}

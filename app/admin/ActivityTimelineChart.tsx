"use client";

import { useMemo, useState } from "react";

export type TimelineBucket = {
  startMs: number;
  label: string;
  shortLabel: string;
  pageViews: number;
  adds: number;
  checkouts: number;
  purchases: number;
  totalEvents: number;
  sessions: number;
};

type Metric = "pageViews" | "adds" | "checkouts" | "totalEvents";

const METRICS: { id: Metric; label: string }[] = [
  { id: "pageViews", label: "Page views" },
  { id: "adds", label: "Add to cart" },
  { id: "checkouts", label: "Checkout steps" },
  { id: "totalEvents", label: "All events" },
];

export function ActivityTimelineChart({
  buckets,
  rangeLabel,
}: {
  buckets: TimelineBucket[];
  rangeLabel: string;
}) {
  const [metric, setMetric] = useState<Metric>("pageViews");

  const values = useMemo(
    () => buckets.map((b) => b[metric]),
    [buckets, metric],
  );
  const max = Math.max(1, ...values);

  if (buckets.length === 0) {
    return (
      <p className="text-sm text-muted border border-line p-4">
        No timeline data for {rangeLabel.toLowerCase()} yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {METRICS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMetric(m.id)}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              metric === m.id
                ? "border-foreground bg-foreground text-background"
                : "border-line text-muted hover:border-foreground/40"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="border border-line p-4 pt-6">
        <div
          className="flex items-end gap-px sm:gap-1 h-44"
          role="img"
          aria-label={`${METRICS.find((m) => m.id === metric)?.label} over ${rangeLabel.toLowerCase()}`}
        >
          {buckets.map((bucket, i) => {
            const value = values[i] ?? 0;
            const heightPct = value > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0;
            return (
              <div
                key={`${bucket.startMs}-${bucket.label}`}
                className="flex-1 min-w-0 flex flex-col items-center justify-end h-full group"
              >
                <span className="text-[10px] tabular-nums text-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {value > 0 ? value : ""}
                </span>
                <div
                  className="w-full max-w-8 bg-accent/75 hover:bg-accent transition-colors rounded-t-sm"
                  style={{ height: `${heightPct}%` }}
                  title={`${bucket.label}\n${METRICS.find((m) => m.id === metric)?.label}: ${value}\nSessions: ${bucket.sessions}\nPage views: ${bucket.pageViews}\nAdds: ${bucket.adds}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-px sm:gap-1 mt-2 border-t border-line/60 pt-2">
          {buckets.map((bucket) => (
            <div
              key={`label-${bucket.startMs}`}
              className="flex-1 min-w-0 text-center"
            >
              <span className="text-[9px] sm:text-[10px] text-muted tabular-nums leading-tight block truncate">
                {bucket.shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

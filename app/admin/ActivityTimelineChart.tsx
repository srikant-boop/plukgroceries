"use client";

import { useMemo, useState } from "react";

/** Mirrors AnalyticsEventType — kept here so this client component avoids server imports. */
type EventType =
  | "page_view"
  | "product_click"
  | "product_view"
  | "add_to_cart"
  | "view_cart"
  | "begin_checkout"
  | "checkout_start"
  | "purchase";

export type TimelineEventCounts = Record<EventType, number>;

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
  events: TimelineEventCounts;
};

type Metric = "pageViews" | "adds" | "checkouts" | "totalEvents";

const METRICS: { id: Metric; label: string }[] = [
  { id: "totalEvents", label: "All events (stacked)" },
  { id: "pageViews", label: "Page views" },
  { id: "adds", label: "Add to cart" },
  { id: "checkouts", label: "Checkout steps" },
];

/** Bottom → top stack order (funnel-ish). Distinct hues on the Pluk palette. */
const EVENT_LAYERS: { id: EventType; label: string; color: string }[] = [
  { id: "page_view", label: "Page view", color: "#d4ddd0" },
  { id: "product_click", label: "Product click", color: "#a8b89e" },
  { id: "product_view", label: "Product page", color: "#7d9474" },
  { id: "add_to_cart", label: "Add to cart", color: "#4a5c42" },
  { id: "view_cart", label: "Cart viewed", color: "#c4b896" },
  { id: "begin_checkout", label: "Checkout opened", color: "#9a8555" },
  { id: "checkout_start", label: "Pay clicked", color: "#6b5a32" },
  { id: "purchase", label: "Order paid", color: "#1a1a1a" },
];

function bucketMetricValue(bucket: TimelineBucket, metric: Metric): number {
  if (metric === "totalEvents") return bucket.totalEvents;
  return bucket[metric];
}

function formatStackTooltip(bucket: TimelineBucket): string {
  const lines = EVENT_LAYERS.filter((l) => bucket.events[l.id] > 0).map(
    (l) => `${l.label}: ${bucket.events[l.id]}`,
  );
  return [`${bucket.label}`, ...lines, `Sessions: ${bucket.sessions}`].join("\n");
}

export function ActivityTimelineChart({
  buckets,
  rangeLabel,
}: {
  buckets: TimelineBucket[];
  rangeLabel: string;
}) {
  const [metric, setMetric] = useState<Metric>("totalEvents");
  const stacked = metric === "totalEvents";

  const values = useMemo(
    () => buckets.map((b) => bucketMetricValue(b, metric)),
    [buckets, metric],
  );
  const max = Math.max(1, ...values);
  const labelStep =
    buckets.length <= 12 ? 1 : buckets.length <= 24 ? 2 : Math.ceil(buckets.length / 12);

  const activeLayers = useMemo(
    () =>
      stacked
        ? EVENT_LAYERS.filter((l) =>
            buckets.some((b) => b.events[l.id] > 0),
          )
        : [],
    [buckets, stacked],
  );

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

      {stacked && activeLayers.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] text-muted">
          {activeLayers.map((layer) => (
            <span key={layer.id} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: layer.color }}
              />
              {layer.label}
            </span>
          ))}
        </div>
      )}

      <div className="border border-line p-4 pt-6">
        <div
          className="flex items-end gap-px sm:gap-1 h-44"
          role="img"
          aria-label={`${METRICS.find((m) => m.id === metric)?.label} over ${rangeLabel.toLowerCase()}`}
        >
          {buckets.map((bucket, i) => {
            const value = values[i] ?? 0;
            const heightPct =
              value > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0;

            return (
              <div
                key={`${bucket.startMs}-${bucket.label}`}
                className="flex-1 min-w-0 flex flex-col items-center justify-end h-full group"
              >
                <span className="text-[10px] tabular-nums text-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {value > 0 ? value : ""}
                </span>
                {stacked && value > 0 ? (
                  <div
                    className="w-full max-w-8 flex flex-col-reverse overflow-hidden rounded-t-sm"
                    style={{ height: `${heightPct}%` }}
                    title={formatStackTooltip(bucket)}
                  >
                    {EVENT_LAYERS.map((layer) => {
                      const seg = bucket.events[layer.id];
                      if (seg <= 0) return null;
                      return (
                        <div
                          key={layer.id}
                          style={{
                            flexGrow: seg,
                            flexBasis: 0,
                            backgroundColor: layer.color,
                          }}
                          title={`${layer.label}: ${seg}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="w-full max-w-8 bg-accent/75 hover:bg-accent transition-colors rounded-t-sm"
                    style={{ height: `${heightPct}%` }}
                    title={`${bucket.label}\n${METRICS.find((m) => m.id === metric)?.label}: ${value}\nSessions: ${bucket.sessions}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-px sm:gap-1 mt-2 border-t border-line/60 pt-2">
          {buckets.map((bucket, i) => (
            <div
              key={`label-${bucket.startMs}`}
              className="flex-1 min-w-0 text-center"
            >
              <span className="text-[9px] sm:text-[10px] text-muted tabular-nums leading-tight block truncate">
                {i % labelStep === 0 || i === buckets.length - 1
                  ? bucket.shortLabel
                  : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

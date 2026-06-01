"use client";

import { useMemo, useState } from "react";
import {
  bucketSkuValue,
  formatMarkupPct,
  MARKUP_BAR_SCALE_PCT,
  type MarkupMetric,
  type MarkupSkuMeta,
  type MarkupTimelineBucket,
} from "@/lib/markup-insights";

const METRICS: { id: MarkupMetric; label: string }[] = [
  { id: "markupPct", label: "Markup % (by SKU)" },
  { id: "units", label: "Units sold (stacked)" },
  { id: "revenue", label: "Revenue (stacked)" },
];

function formatMetricValue(metric: MarkupMetric, value: number): string {
  if (metric === "markupPct") return `${formatMarkupPct(value)}%`;
  if (metric === "revenue") return `$${value.toFixed(2)}`;
  return String(value);
}

export function MarkupTimelineChart({
  buckets,
  skus,
  rangeLabel,
}: {
  buckets: MarkupTimelineBucket[];
  skus: MarkupSkuMeta[];
  rangeLabel: string;
}) {
  const [metric, setMetric] = useState<MarkupMetric>("markupPct");
  const stacked = metric !== "markupPct";

  const activeSkus = useMemo(() => {
    if (metric === "markupPct") {
      return skus.filter(
        (s) =>
          !s.passThrough &&
          buckets.some((b) => (b.markupPct[s.productId] ?? 0) > 0),
      );
    }
    return skus.filter((s) =>
      buckets.some((b) => bucketSkuValue(b, s.productId, metric) > 0),
    );
  }, [buckets, skus, metric]);

  const max = useMemo(() => {
    if (metric === "markupPct") {
      return MARKUP_BAR_SCALE_PCT;
    }
    return Math.max(
      1,
      ...buckets.map((b) =>
        activeSkus.reduce(
          (sum, s) => sum + bucketSkuValue(b, s.productId, metric),
          0,
        ),
      ),
    );
  }, [buckets, activeSkus, metric]);

  const labelStep =
    buckets.length <= 12 ? 1 : buckets.length <= 24 ? 2 : Math.ceil(buckets.length / 12);

  if (buckets.length === 0) {
    return (
      <p className="text-sm text-muted border border-line p-4 mb-6">
        No markup timeline for {rangeLabel.toLowerCase()} yet.
      </p>
    );
  }

  return (
    <div className="mb-8">
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

      {activeSkus.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] text-muted">
          {activeSkus.map((sku) => (
            <span key={sku.productId} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: sku.color }}
              />
              {sku.name}
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
            const total = activeSkus.reduce(
              (sum, s) => sum + bucketSkuValue(bucket, s.productId, metric),
              0,
            );
            const heightPct =
              total > 0 ? Math.max(8, Math.round((total / max) * 100)) : 0;

            return (
              <div
                key={`${bucket.startMs}-${bucket.label}`}
                className="flex-1 min-w-0 flex flex-col items-center justify-end h-full group"
              >
                <span className="text-[10px] tabular-nums text-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-full px-px">
                  {total > 0 ? formatMetricValue(metric, total) : ""}
                </span>
                {stacked && total > 0 ? (
                  <div
                    className="w-full max-w-8 flex flex-col-reverse overflow-hidden rounded-t-sm"
                    style={{ height: `${heightPct}%` }}
                    title={[
                      bucket.label,
                      ...activeSkus
                        .filter(
                          (s) =>
                            bucketSkuValue(bucket, s.productId, metric) > 0,
                        )
                        .map(
                          (s) =>
                            `${s.name}: ${formatMetricValue(
                              metric,
                              bucketSkuValue(bucket, s.productId, metric),
                            )}`,
                        ),
                    ].join("\n")}
                  >
                    {activeSkus.map((sku) => {
                      const seg = bucketSkuValue(bucket, sku.productId, metric);
                      if (seg <= 0) return null;
                      return (
                        <div
                          key={sku.productId}
                          style={{
                            flexGrow: seg,
                            flexBasis: 0,
                            backgroundColor: sku.color,
                          }}
                          title={`${sku.name}: ${formatMetricValue(metric, seg)}`}
                        />
                      );
                    })}
                  </div>
                ) : metric === "markupPct" ? (
                  <div
                    className="w-full flex items-end justify-center gap-px h-full max-h-full"
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  >
                    {activeSkus.map((sku) => {
                      const pct = bucket.markupPct[sku.productId] ?? 0;
                      if (pct <= 0) return null;
                      const barH = Math.max(
                        4,
                        Math.round((pct / MARKUP_BAR_SCALE_PCT) * 100),
                      );
                      return (
                        <div
                          key={sku.productId}
                          className="flex-1 max-w-[6px] min-w-[2px] rounded-t-sm"
                          style={{
                            height: `${barH}%`,
                            backgroundColor: sku.color,
                          }}
                          title={`${sku.name}: ${formatMarkupPct(pct)}%`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="w-full max-w-8 bg-accent/75 rounded-t-sm"
                    style={{ height: `${heightPct}%` }}
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

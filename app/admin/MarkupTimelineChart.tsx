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
  { id: "markupPct", label: "Markup % (lines)" },
  { id: "units", label: "Units sold (stacked)" },
  { id: "revenue", label: "Revenue (stacked)" },
];

const CHART_H = 176;
const PAD = { top: 12, right: 8, bottom: 4, left: 32 };

function formatMetricValue(metric: MarkupMetric, value: number): string {
  if (metric === "markupPct") return `${formatMarkupPct(value)}%`;
  if (metric === "revenue") return `$${value.toFixed(2)}`;
  return String(value);
}

function MarkupLineChart({
  buckets,
  skus,
}: {
  buckets: MarkupTimelineBucket[];
  skus: MarkupSkuMeta[];
}) {
  const activeSkus = useMemo(
    () =>
      skus.filter(
        (s) =>
          !s.passThrough &&
          buckets.some((b) => (b.markupPct[s.productId] ?? 0) > 0),
      ),
    [buckets, skus],
  );

  const yMax = useMemo(() => {
    const peak = Math.max(
      0,
      ...buckets.flatMap((b) =>
        activeSkus.map((s) => b.markupPct[s.productId] ?? 0),
      ),
    );
    return Math.max(MARKUP_BAR_SCALE_PCT, Math.ceil(peak / 5) * 5);
  }, [buckets, activeSkus]);

  const innerW = 1000 - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const xAt = (i: number) =>
    PAD.left +
    (buckets.length <= 1 ? innerW / 2 : (i / (buckets.length - 1)) * innerW);

  const yAt = (pct: number) => PAD.top + innerH - (pct / yMax) * innerH;

  const yTicks = useMemo(() => {
    const step = yMax <= 25 ? 5 : 10;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    return ticks;
  }, [yMax]);

  return (
    <svg
      viewBox={`0 0 1000 ${CHART_H}`}
      className="w-full h-44"
      role="img"
      aria-label="Markup percent by SKU over time"
    >
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            y1={yAt(tick)}
            x2={1000 - PAD.right}
            y2={yAt(tick)}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
          <text
            x={PAD.left - 6}
            y={yAt(tick) + 3}
            textAnchor="end"
            className="fill-muted text-[10px]"
            style={{ fontSize: 10 }}
          >
            {tick}%
          </text>
        </g>
      ))}

      {activeSkus.map((sku) => {
        const points = buckets.map((b, i) => ({
          x: xAt(i),
          y: yAt(b.markupPct[sku.productId] ?? 0),
          pct: b.markupPct[sku.productId] ?? 0,
          label: b.label,
        }));

        const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

        return (
          <g key={sku.productId}>
            {buckets.length > 1 && (
              <polyline
                points={polyline}
                fill="none"
                stroke={sku.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {points.map((p, i) =>
              p.pct > 0 ? (
                <circle
                  key={`${sku.productId}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={buckets.length > 24 ? 2.5 : 3.5}
                  fill={sku.color}
                  stroke="var(--background, #fff)"
                  strokeWidth={1}
                >
                  <title>{`${p.label}\n${sku.name}: ${formatMarkupPct(p.pct)}%`}</title>
                </circle>
              ) : null,
            )}
          </g>
        );
      })}
    </svg>
  );
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
  const isLine = metric === "markupPct";

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
    if (isLine) return 1;
    return Math.max(
      1,
      ...buckets.map((b) =>
        activeSkus.reduce(
          (sum, s) => sum + bucketSkuValue(b, s.productId, metric),
          0,
        ),
      ),
    );
  }, [buckets, activeSkus, metric, isLine]);

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
        {isLine ? (
          <MarkupLineChart buckets={buckets} skus={skus} />
        ) : (
          <div
            className="flex items-end gap-px sm:gap-1 h-44"
            role="img"
            aria-label={`${METRICS.find((m) => m.id === metric)?.label} over ${rangeLabel.toLowerCase()}`}
          >
            {buckets.map((bucket) => {
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
                  {total > 0 ? (
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
                  ) : (
                    <div className="w-full max-w-8 h-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
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

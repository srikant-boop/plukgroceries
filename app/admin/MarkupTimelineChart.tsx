"use client";

import { useMemo, useState } from "react";
import {
  bucketSkuValue,
  formatMarkupPct,
  isMarkupChartSku,
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

function markupSeriesKey(
  productId: string,
  buckets: MarkupTimelineBucket[],
): string {
  return buckets.map((b) => b.markupPct[productId] ?? 0).join("|");
}

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
  const [hoverBucketIdx, setHoverBucketIdx] = useState<number | null>(null);

  const activeSkus = useMemo(
    () => skus.filter(isMarkupChartSku),
    [skus],
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

  const lineGroups = useMemo(() => {
    const byKey = new Map<string, MarkupSkuMeta[]>();
    for (const sku of activeSkus) {
      const key = markupSeriesKey(sku.productId, buckets);
      const list = byKey.get(key) ?? [];
      list.push(sku);
      byKey.set(key, list);
    }
    return [...byKey.values()].map((group) => {
      const lead = group[0]!;
      return {
        skus: group,
        color: lead.color,
        points: buckets.map((b, i) => {
          const pct = b.markupPct[lead.productId] ?? 0;
          return {
            i,
            x: xAt(i),
            y: yAt(pct),
            pct,
          };
        }),
      };
    });
  }, [activeSkus, buckets, innerW, innerH, yMax]);

  const yTicks = useMemo(() => {
    const step = yMax <= 25 ? 5 : 10;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    return ticks;
  }, [yMax]);

  const pickBucketIdx = (mx: number) => {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < buckets.length; i++) {
      const d = Math.abs(xAt(i) - mx);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const handlePointerMove = (
    e: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>,
  ) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 1000;
    setHoverBucketIdx(pickBucketIdx(mx));
  };

  const hoverBucket =
    hoverBucketIdx != null ? buckets[hoverBucketIdx] : null;
  const hoverX = hoverBucketIdx != null ? xAt(hoverBucketIdx) : 0;
  const hoverXPct = (hoverX / 1000) * 100;

  const hoverRows = useMemo(() => {
    if (hoverBucketIdx == null) return [];
    const bucket = buckets[hoverBucketIdx];
    if (!bucket) return [];
    return activeSkus
      .map((sku) => ({
        sku,
        pct: bucket.markupPct[sku.productId] ?? 0,
      }))
      .sort((a, b) => b.pct - a.pct || a.sku.name.localeCompare(b.sku.name));
  }, [hoverBucketIdx, buckets, activeSkus]);

  return (
    <div className="relative">
      {hoverBucket && hoverRows.length > 0 && (
        <div
          className="absolute z-10 pointer-events-none -translate-x-1/2 px-2.5 py-2 text-xs bg-foreground text-background shadow-sm border border-line/20 min-w-[180px] max-w-[260px] max-h-52 overflow-y-auto"
          style={{ left: `${hoverXPct}%`, top: 0 }}
        >
          <div className="font-medium mb-1.5 pb-1 border-b border-background/20">
            {hoverBucket.label}
          </div>
          <ul className="space-y-1">
            {hoverRows.map(({ sku, pct }) => (
              <li
                key={sku.productId}
                className="flex items-center justify-between gap-3 tabular-nums"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: sku.color }}
                  />
                  <span className="truncate">{sku.name}</span>
                </span>
                <span className="text-background/80 shrink-0">
                  {formatMarkupPct(pct)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <svg
        viewBox={`0 0 1000 ${CHART_H}`}
        className="w-full h-44 cursor-crosshair"
        role="img"
        aria-label="Markup percent by SKU over time"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setHoverBucketIdx(null)}
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

        {hoverBucketIdx != null && (
          <line
            x1={hoverX}
            y1={PAD.top}
            x2={hoverX}
            y2={CHART_H - PAD.bottom}
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeDasharray="4 3"
            pointerEvents="none"
          />
        )}

        {lineGroups.map((group) => {
          const polyline = group.points.map((p) => `${p.x},${p.y}`).join(" ");
          const groupKey = group.skus.map((s) => s.productId).join("-");

          return (
            <g key={groupKey}>
              {buckets.length > 1 && (
                <polyline
                  points={polyline}
                  fill="none"
                  stroke={group.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              )}
              {group.points.map((p) => {
                const active = hoverBucketIdx === p.i;
                return (
                  <circle
                    key={`${groupKey}-${p.i}`}
                    cx={p.x}
                    cy={p.y}
                    r={active ? 5 : 3.5}
                    fill={group.color}
                    stroke="var(--background, #fff)"
                    strokeWidth={active ? 2 : 1.5}
                    pointerEvents="none"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
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
      return skus.filter(isMarkupChartSku);
    }
    return skus.filter(
      (s) =>
        isMarkupChartSku(s) &&
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

      {activeSkus.length > 0 && metric !== "markupPct" && (
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

      {metric === "markupPct" && (
        <p className="text-[10px] text-muted mb-4">
          SKUs on the same markup tier share one line. Hover any bucket to see every
          product and its markup %.
        </p>
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

import { money } from "@/lib/format";
import {
  formatMarkupChangePp,
  formatMarkupPct,
  MARKUP_BAR_SCALE_PCT,
  markupTargetLabel,
  type MarkupTimeSeries,
  type ProductMarkupInsight,
} from "@/lib/markup-insights";
import { MarkupTimelineChart } from "@/app/admin/MarkupTimelineChart";

function barWidth(pct: number): string {
  const clamped = Math.max(0, Math.min(pct, MARKUP_BAR_SCALE_PCT));
  return `${Math.max(clamped > 0 ? 4 : 0, Math.round((clamped / MARKUP_BAR_SCALE_PCT) * 100))}%`;
}

function MarkupBar({
  pct,
  tone,
  title,
}: {
  pct: number;
  tone: "previous" | "current";
  title: string;
}) {
  return (
    <div
      className="h-2.5 bg-surface rounded overflow-hidden min-w-[72px] flex-1"
      title={title}
    >
      <div
        className={`h-full rounded ${
          tone === "previous" ? "bg-muted/50" : "bg-accent/80"
        }`}
        style={{ width: barWidth(pct) }}
      />
    </div>
  );
}

export function MarkupInsightsPanel({
  rows,
  paidOrderCount,
  timeSeries,
  rangeLabel,
}: {
  rows: ProductMarkupInsight[];
  paidOrderCount: number;
  timeSeries: MarkupTimeSeries;
  rangeLabel: string;
}) {
  const changed = rows.filter((r) => r.markupChangePp !== 0);
  const passThrough = rows.filter((r) => r.passThrough);

  return (
    <section className="mb-12">
      <h2 className="text-xl mb-2">Markup &amp; price changes</h2>
      <p className="text-xs text-muted mb-4 max-w-3xl">
        Internal only. Bars show markup on wholesale cost (target{" "}
        {markupTargetLabel}, Aldi ballpark). Grey = previous catalogue tier; green
        = live. Timeline uses one line per SKU (markup %) or stacked bars for
        units/revenue — catalogue tier before the reduction, order snapshots when
        units sold. Order columns split paid units by price at checkout.
        {paidOrderCount === 0 && " No paid orders yet to correlate."}
      </p>

      <MarkupTimelineChart
        buckets={timeSeries.buckets}
        skus={timeSeries.skus}
        rangeLabel={rangeLabel}
      />

      <div className="border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[720px] table-fixed">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="p-3 font-normal w-[28%]">Product</th>
              <th className="p-3 font-normal w-[18%]">Prev markup</th>
              <th className="p-3 font-normal w-[18%]">Now</th>
              <th className="p-3 font-normal text-right w-[10%]">Δ markup</th>
              <th className="p-3 font-normal text-right w-[14%]">Price</th>
              <th className="p-3 font-normal text-right w-[6%]">Units @ old</th>
              <th className="p-3 font-normal text-right w-[6%]">Units @ new</th>
            </tr>
          </thead>
          <tbody>
            {changed.map((row) => (
              <tr key={row.productId} className="border-b border-line/60">
                <td className="p-3">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-muted">{row.category}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <MarkupBar
                      pct={row.previousMarkupPct}
                      tone="previous"
                      title={`${formatMarkupPct(row.previousMarkupPct)}% on cost`}
                    />
                    <span className="text-xs tabular-nums text-muted shrink-0 w-11 text-right">
                      {formatMarkupPct(row.previousMarkupPct)}%
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <MarkupBar
                      pct={row.currentMarkupPct}
                      tone="current"
                      title={`${formatMarkupPct(row.currentMarkupPct)}% on cost`}
                    />
                    <span className="text-xs tabular-nums shrink-0 w-11 text-right">
                      {formatMarkupPct(row.currentMarkupPct)}%
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right tabular-nums text-accent whitespace-nowrap">
                  {formatMarkupChangePp(row.markupChangePp)}
                </td>
                <td className="p-3 text-right tabular-nums whitespace-nowrap">
                  <span className="text-muted line-through">
                    {money(row.previousPrice)}
                  </span>
                  <span className="mx-1 text-muted">→</span>
                  {money(row.currentPrice)}
                </td>
                <td className="p-3 text-right tabular-nums">
                  {row.unitsAtPreviousMarkup || "—"}
                </td>
                <td className="p-3 text-right tabular-nums">
                  {row.unitsAtCurrentMarkup || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {passThrough.length > 0 && (
        <div className="mt-6 border border-line p-4">
          <h3 className="text-sm font-medium mb-2">Pass-through (no markup)</h3>
          <p className="text-xs text-muted mb-3">
            Discover / partner items — wholesale equals shelf price; unchanged by
            the produce markup reduction.
          </p>
          <ul className="text-sm space-y-1">
            {passThrough.map((row) => (
              <li key={row.productId} className="flex justify-between gap-4">
                <span>{row.name}</span>
                <span className="tabular-nums text-muted">
                  {money(row.currentPrice)} ·{" "}
                  {row.unitsAtPreviousMarkup + row.unitsAtCurrentMarkup} units
                  sold
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

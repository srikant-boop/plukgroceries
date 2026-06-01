import {
  markupTargetLabel,
  type MarkupTimeSeries,
  type ProductMarkupInsight,
} from "@/lib/markup-insights";
import { MarkupTimelineChart } from "@/app/admin/MarkupTimelineChart";

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
  const orderSplit = rows.filter(
    (r) => r.unitsAtPreviousMarkup > 0 || r.unitsAtCurrentMarkup > 0,
  );

  return (
    <section className="mb-12">
      <h2 className="text-xl mb-2">Markup &amp; price changes</h2>
      <p className="text-xs text-muted mb-4 max-w-3xl">
        Internal only. Target {markupTargetLabel} on wholesale (Aldi ballpark).
        Lines show markup % per SKU over the selected range; hover a bucket to
        compare all SKUs at once. Stacked bars for units and revenue.
        {paidOrderCount === 0 && " No paid orders yet — use Units / Revenue toggles when sales land."}
      </p>

      <MarkupTimelineChart
        buckets={timeSeries.buckets}
        skus={timeSeries.skus}
        rangeLabel={rangeLabel}
      />

      {orderSplit.length > 0 && (
        <div className="mt-6 border border-line overflow-x-auto">
          <p className="text-xs text-muted px-3 pt-3">
            Paid units split by shelf price at checkout (old vs new markup tier).
          </p>
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="p-3 font-normal">Product</th>
                <th className="p-3 font-normal text-right">Units @ old price</th>
                <th className="p-3 font-normal text-right">Units @ new price</th>
              </tr>
            </thead>
            <tbody>
              {orderSplit.map((row) => (
                <tr key={row.productId} className="border-b border-line/60">
                  <td className="p-3 font-medium">{row.name}</td>
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
      )}
    </section>
  );
}

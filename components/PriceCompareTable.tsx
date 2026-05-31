import { type Product } from "@/lib/products";
import { money } from "@/lib/format";
import { Leaf } from "./Leaf";

export function PriceCompareTable({ product }: { product: Product }) {
  // Pluk row always anchors the top — it's the headline "you pay" number.
  // Competitor rows sort ascending below it for an easy read.
  const competitorRows = product.competitors
    .map((c) => ({
      label: c.store,
      price: c.price,
      unit: c.unit,
      url: c.url,
      delta: c.price - product.ourPrice, // positive = Pluk is cheaper
    }))
    .sort((a, b) => a.price - b.price);

  return (
    <div className="border border-line">
      <div className="border-b border-line px-5 py-3">
        <span className="eyebrow">Price comparison</span>
      </div>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-line bg-background">
            <td className="px-5 py-3">
              <span className="inline-flex items-center gap-2">
                <Leaf size={16} className="text-accent" />
                <span className="text-[10px] uppercase tracking-wider text-accent">
                  You pay
                </span>
              </span>
            </td>
            <td className="px-5 py-3 text-xs text-muted">{product.unit}</td>
            <td className="px-5 py-3 text-right tabular-nums">
              {money(product.ourPrice)}
            </td>
            <td className="px-5 py-3 text-right text-xs tabular-nums text-muted">
              —
            </td>
          </tr>
          {competitorRows.map((r) => {
            const plukIsCheaper = r.delta > 0;
            const plukIsMore = r.delta < 0;
            return (
              <tr
                key={r.label}
                className="border-b border-line last:border-0"
              >
                <td className="px-5 py-3">
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      {r.label}
                    </a>
                  ) : (
                    r.label
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-muted">{r.unit}</td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {money(r.price)}
                </td>
                <td className="px-5 py-3 text-right text-xs tabular-nums">
                  {plukIsCheaper ? (
                    <span className="text-accent">
                      Save {money(r.delta)}
                    </span>
                  ) : plukIsMore ? (
                    <span className="text-price-cut">
                      {money(-r.delta)} cheaper
                    </span>
                  ) : (
                    <span className="text-muted">same</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

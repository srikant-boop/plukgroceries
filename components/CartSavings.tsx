import {
  type CartItem,
  competitorSavings,
  cartCompetitorStores,
} from "@/lib/cart";
import { money } from "@/lib/format";

export function CartSavings({ items }: { items: CartItem[] }) {
  if (items.length === 0) return null;
  const stores = cartCompetitorStores(items);
  const rows = competitorSavings(items, stores).filter((r) => r.saving !== 0);
  if (rows.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-line">
      <p className="eyebrow mb-3">You&apos;re saving</p>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => {
          const ahead = r.saving > 0;
          return (
            <li
              key={r.store}
              className="flex items-baseline justify-between gap-3"
            >
              <span>{ahead ? `vs ${r.store}` : `more than ${r.store}`}</span>
              <span
                className={`tabular-nums ${ahead ? "text-accent" : "text-price-cut"}`}
              >
                {ahead
                  ? `${money(r.saving)} (${Math.round(r.pct)}%)`
                  : `+${money(-r.saving)}`}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted mt-3 leading-relaxed">
        Same basket priced at each store, using the unit sizes shown on each
        product page.
      </p>
    </div>
  );
}

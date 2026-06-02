import {
  type CartItem,
  competitorSavings,
  cartCompetitorStores,
} from "@/lib/cart";
import { money } from "@/lib/format";
import { SOBEYS_STORE, sobeysDeliveryNote } from "@/lib/sobeys";

export function CartSavings({
  items,
  showSobeysDeliveryNote = false,
}: {
  items: CartItem[];
  /** Checkout only — Sobeys shelf prices exclude their delivery fee. */
  showSobeysDeliveryNote?: boolean;
}) {
  if (items.length === 0) return null;
  const stores = cartCompetitorStores(items);
  const rows = competitorSavings(items, stores).filter((r) => r.saving !== 0);
  if (rows.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-line">
      <p className="eyebrow mb-3">Savings vs same cart</p>
      <ul className="space-y-3 text-sm">
        {rows.map((r) => {
          const ahead = r.saving > 0;
          return (
            <li
              key={r.store}
              className="flex items-start justify-between gap-4"
            >
              <div>
                <span className="block">{r.store}</span>
                <span className="text-xs text-muted tabular-nums">
                  Shelf total {money(r.theirTotal)}
                </span>
              </div>
              <span
                className={`text-right tabular-nums shrink-0 ${ahead ? "text-accent" : "text-price-cut"}`}
              >
                {ahead ? (
                  <>
                    <span className="block font-medium">
                      Save {money(r.saving)}
                    </span>
                    <span className="text-xs">({Math.round(r.pct)}%)</span>
                  </>
                ) : (
                  <span className="block">
                    {money(-r.saving)} more at {r.store}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted mt-3 leading-relaxed">
        Same basket priced at each store, using the unit sizes shown on each
        product page.
        {showSobeysDeliveryNote && stores.includes(SOBEYS_STORE) && (
          <>
            {" "}
            {sobeysDeliveryNote}
          </>
        )}
      </p>
    </div>
  );
}

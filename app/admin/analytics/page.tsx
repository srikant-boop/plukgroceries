import Link from "next/link";
import {
  ANALYTICS_EVENTS,
  funnelRate,
  getAnalyticsSummary,
} from "@/lib/analytics";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STEP_LABELS: Record<(typeof ANALYTICS_EVENTS)[number], string> = {
  page_view: "Page views",
  product_click: "Product clicks (shop grid)",
  product_view: "Product page views",
  add_to_cart: "Add to cart",
  view_cart: "Cart viewed",
  begin_checkout: "Checkout opened",
  checkout_start: "Pay clicked (→ Stripe)",
  purchase: "Orders paid",
};

export default async function AdminAnalyticsPage() {
  let summary = null;
  let orderCount = 0;
  let error: string | null = null;

  try {
    summary = await getAnalyticsSummary(7);
    const orders = await listOrders(500);
    orderCount = orders.filter((o) => o.paid).length;
  } catch (e) {
    error = e instanceof Error ? e.message : "Storage unavailable";
  }

  const t = summary?.totals;
  const visitors = summary?.days.reduce((s, d) => s + d.visitors, 0) ?? 0;

  return (
    <div>
      <header className="mb-10 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="text-3xl">Insights</h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Last 7 days · Toronto time · anonymous sessions (no names). Use this
            to spot drop-off: views → cart → checkout → pay.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link
            href="/admin"
            className="underline underline-offset-4 hover:text-accent"
          >
            ← Orders
          </Link>
        </div>
      </header>

      {error && (
        <div className="border border-price-cut p-4 mb-8 text-sm text-price-cut">
          Couldn&apos;t load analytics: {error}
        </div>
      )}

      {summary && t && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatCard label="Unique sessions (7d)" value={String(visitors)} />
            <StatCard label="Add to cart (7d)" value={String(t.add_to_cart)} />
            <StatCard
              label="Checkout → paid"
              value={funnelRate(t.purchase, t.checkout_start)}
              hint={`${t.purchase} paid / ${t.checkout_start} started pay`}
            />
            <StatCard
              label="All-time paid orders"
              value={String(orderCount)}
              hint="From order storage"
            />
          </section>

          <section className="mb-12">
            <h2 className="text-xl mb-4">Funnel (7 days)</h2>
            <div className="border border-line overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th className="p-3 font-normal">Step</th>
                    <th className="p-3 font-normal text-right">Count</th>
                    <th className="p-3 font-normal text-right">From prior step</th>
                  </tr>
                </thead>
                <tbody>
                  {ANALYTICS_EVENTS.map((event, i) => {
                    const count = t[event];
                    const prev =
                      i === 0 ? count : t[ANALYTICS_EVENTS[i - 1]!] ?? 0;
                    return (
                      <tr key={event} className="border-b border-line/60">
                        <td className="p-3">{STEP_LABELS[event]}</td>
                        <td className="p-3 text-right tabular-nums">{count}</td>
                        <td className="p-3 text-right tabular-nums text-muted">
                          {i === 0 ? "—" : funnelRate(count, prev)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3 max-w-2xl">
              <strong>Cart abandonment</strong> usually shows up between{" "}
              <em>Add to cart</em> and <em>Pay clicked</em>. If checkout opens
              but pay is low, people may be leaving on the form. If pay is high
              but orders are low, check Stripe failures.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl mb-4">Daily breakdown</h2>
            <div className="border border-line overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="p-2 text-left font-normal">Date</th>
                    <th className="p-2 text-right font-normal">Sessions</th>
                    <th className="p-2 text-right font-normal">Views</th>
                    <th className="p-2 text-right font-normal">Adds</th>
                    <th className="p-2 text-right font-normal">Checkout</th>
                    <th className="p-2 text-right font-normal">Pay</th>
                    <th className="p-2 text-right font-normal">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.days.map((d) => (
                    <tr key={d.date} className="border-b border-line/60">
                      <td className="p-2">{d.date}</td>
                      <td className="p-2 text-right tabular-nums">
                        {d.visitors}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {d.counts.product_view}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {d.counts.add_to_cart}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {d.counts.begin_checkout}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {d.counts.checkout_start}
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {d.counts.purchase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">Top products (7 days)</h2>
            {summary.topProducts.length === 0 ? (
              <p className="text-sm text-muted">No product activity yet.</p>
            ) : (
              <div className="border border-line overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-muted">
                      <th className="p-3 font-normal">Product</th>
                      <th className="p-3 font-normal text-right">Page views</th>
                      <th className="p-3 font-normal text-right">Add to cart</th>
                      <th className="p-3 font-normal text-right">Add rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.topProducts.map((p) => (
                      <tr key={p.productId} className="border-b border-line/60">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3 text-right tabular-nums">{p.views}</td>
                        <td className="p-3 text-right tabular-nums">{p.adds}</td>
                        <td className="p-3 text-right tabular-nums text-muted">
                          {funnelRate(p.adds, p.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-line p-4">
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-2xl tabular-nums">{value}</div>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

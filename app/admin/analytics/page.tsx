import Link from "next/link";
import { Suspense } from "react";
import { ActivityTimelineChart } from "@/app/admin/ActivityTimelineChart";
import { AnalyticsRangeSelect } from "@/app/admin/AnalyticsRangeSelect";
import { EventLogTable } from "@/app/admin/EventLogTable";
import { MarkupInsightsPanel } from "@/app/admin/MarkupInsightsPanel";
import {
  ANALYTICS_EVENTS,
  funnelRate,
  getAnalyticsSummary,
  parseAnalyticsRange,
} from "@/lib/analytics";
import { listOrders } from "@/lib/orders";
import { buildProductMarkupInsights, buildMarkupTimeSeries } from "@/lib/markup-insights";

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

type PageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const range = parseAnalyticsRange(params.range);

  let summary = null;
  let orderCount = 0;
  let paidOrders: Awaited<ReturnType<typeof listOrders>> = [];
  let error: string | null = null;

  try {
    summary = await getAnalyticsSummary(range);
  } catch (e) {
    error = e instanceof Error ? e.message : "Storage unavailable";
  }

  try {
    paidOrders = (await listOrders(500)).filter((o) => o.paid);
    orderCount = paidOrders.length;
  } catch {
    // Orders optional for markup panel if analytics already failed
  }

  const t = summary?.totals;
  const visitors = summary?.visitors ?? 0;
  const peakMax = summary?.peakHours[0]?.total ?? 1;
  const rangeLabel = summary?.rangeLabel ?? "Last 7 days";
  const isRolling = range === "30m" || range === "1h" || range === "6h" || range === "24h";
  const markupRows = buildProductMarkupInsights(paidOrders);
  const markupTimeSeries = buildMarkupTimeSeries(
    paidOrders,
    summary?.timeline?.map((b) => ({
      startMs: b.startMs,
      label: b.label,
      shortLabel: b.shortLabel,
    })),
  );

  return (
    <div>
      <header className="mb-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="text-3xl">Insights</h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            {rangeLabel} · Toronto (ET) · anonymous sessions. Per-event log
            since <strong>{summary?.trackingSinceLabel ?? "—"} ET</strong>.
            {summary?.windowUnifiedToTracking && (
              <>
                {" "}
                All time ranges show the same window until enough history
                exists beyond that start.
              </>
            )}{" "}
            Updated {summary?.nowToronto ?? "—"}.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm">
          <Suspense fallback={null}>
            <AnalyticsRangeSelect current={range} />
          </Suspense>
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

      {summary && t && summary.totals.page_view === 0 && isRolling && (
        <p className="text-sm text-muted mb-8 border border-line p-4">
          No activity in this window yet (since{" "}
          {summary.trackingSinceLabel} ET). Browse the shop to generate a test
          event, or try a longer range.
        </p>
      )}

      {markupRows.length > 0 && (
        <MarkupInsightsPanel
          rows={markupRows}
          paidOrderCount={orderCount}
          timeSeries={markupTimeSeries}
          rangeLabel={rangeLabel}
        />
      )}

      {summary && t && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatCard
              label={`Unique sessions (${rangeLabel.toLowerCase()})`}
              value={String(visitors)}
            />
            <StatCard
              label={`Add to cart (${rangeLabel.toLowerCase()})`}
              value={String(t.add_to_cart)}
            />
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
            <h2 className="text-xl mb-2">Activity over time</h2>
            <p className="text-xs text-muted mb-4">
              How traffic changes across the selected window. Hover a bar for
              counts; switch metrics with the buttons below the title.
            </p>
            <ActivityTimelineChart
              buckets={summary.timeline}
              rangeLabel={rangeLabel}
            />
          </section>

          {summary.sessionInsights && (
            <section className="mb-12">
              <h2 className="text-xl mb-2">Drop-off &amp; abandonment</h2>
              <p className="text-xs text-muted mb-4">
                Per anonymous session in this range (from event log). Paid orders
                from Stripe may not share the same session ID as the browser.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <AbandonCard
                  label="Browsed, never added"
                  count={summary.sessionInsights.browsedNoAdd}
                  total={summary.sessionInsights.totalSessions}
                  hint="Saw a product, no add to cart"
                />
                <AbandonCard
                  label="Added, never checkout"
                  count={summary.sessionInsights.addedNoCheckout}
                  total={summary.sessionInsights.reachedAdd}
                  hint="Cart abandonment (no checkout page)"
                />
                <AbandonCard
                  label="Checkout, never Pay"
                  count={summary.sessionInsights.checkoutNoPay}
                  total={summary.sessionInsights.reachedCheckout}
                  hint="Opened checkout, didn’t click Pay"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm border border-line p-4">
                <MiniStat
                  label="Sessions tracked"
                  value={String(summary.sessionInsights.totalSessions)}
                />
                <MiniStat
                  label="Reached add to cart"
                  value={String(summary.sessionInsights.reachedAdd)}
                />
                <MiniStat
                  label="Opened cart page"
                  value={String(summary.sessionInsights.reachedCart)}
                />
                <MiniStat
                  label="Clicked Pay"
                  value={String(summary.sessionInsights.clickedPay)}
                />
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-xl mb-4">Event log</h2>
            <EventLogTable
              events={summary.eventLog}
              totalInRange={summary.eventLog.length}
            />
          </section>

          {summary.peakHours.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl mb-2">
                Busiest hours ({rangeLabel.toLowerCase()})
              </h2>
              <p className="text-xs text-muted mb-4">
                {isRolling
                  ? "Activity in the selected window, grouped by hour of day (ET)."
                  : "When Oakville shoppers tend to hit the site — all days in range rolled up by hour."}
              </p>
              <div className="border border-line overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-muted">
                      <th className="p-3 font-normal">Hour (ET)</th>
                      <th className="p-3 font-normal">Activity</th>
                      <th className="p-3 font-normal text-right">Views</th>
                      <th className="p-3 font-normal text-right">Adds</th>
                      <th className="p-3 font-normal text-right">Checkout</th>
                      <th className="p-3 font-normal text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.peakHours.map((h) => (
                      <tr key={h.hour} className="border-b border-line/60">
                        <td className="p-3 whitespace-nowrap">{h.label}</td>
                        <td className="p-3 min-w-[140px]">
                          <div className="h-2 bg-surface rounded overflow-hidden">
                            <div
                              className="h-full bg-accent/70"
                              style={{
                                width: `${Math.max(4, Math.round((h.total / peakMax) * 100))}%`,
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right tabular-nums">
                          {h.pageViews}
                        </td>
                        <td className="p-3 text-right tabular-nums">{h.adds}</td>
                        <td className="p-3 text-right tabular-nums">
                          {h.checkouts}
                        </td>
                        <td className="p-3 text-right tabular-nums">
                          {h.purchases}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-xl mb-4">Funnel ({rangeLabel.toLowerCase()})</h2>
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
          </section>

          <section className="mb-12">
            <h2 className="text-xl mb-4">
              {isRolling && summary.days.length === 1
                ? "Window summary"
                : "Daily breakdown"}
            </h2>
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

          <section className="mb-12">
            <h2 className="text-xl mb-2">Hourly breakdown</h2>
            <p className="text-xs text-muted mb-4">
              Only buckets with activity are shown. Times are Eastern (Toronto).
            </p>
            {summary.hourlyByDay.every((d) => d.hours.length === 0) ? (
              <p className="text-sm text-muted">
                No hourly data yet — browse the shop after deploy to populate
                this (older events before this update won&apos;t have times).
              </p>
            ) : (
              <div className="space-y-8">
                {summary.hourlyByDay.map((day) =>
                  day.hours.length === 0 ? null : (
                    <div key={day.date}>
                      <h3 className="text-sm font-medium mb-2">{day.date}</h3>
                      <div className="border border-line overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-line text-muted">
                              <th className="p-2 text-left font-normal">
                                {isRolling && (range === "30m" || range === "1h")
                                  ? "Time (ET)"
                                  : "Hour (ET)"}
                              </th>
                              <th className="p-2 text-right font-normal">
                                Sessions
                              </th>
                              <th className="p-2 text-right font-normal">
                                Pages
                              </th>
                              <th className="p-2 text-right font-normal">
                                Product
                              </th>
                              <th className="p-2 text-right font-normal">
                                Adds
                              </th>
                              <th className="p-2 text-right font-normal">
                                Cart
                              </th>
                              <th className="p-2 text-right font-normal">
                                Checkout
                              </th>
                              <th className="p-2 text-right font-normal">
                                Pay
                              </th>
                              <th className="p-2 text-right font-normal">
                                Paid
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.hours.map((slot) => (
                              <tr
                                key={`${day.date}-${slot.hour}-${slot.label}`}
                                className="border-b border-line/60"
                              >
                                <td className="p-2 whitespace-nowrap">
                                  {slot.label}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.sessions}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.page_view}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.product_view +
                                    slot.counts.product_click}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.add_to_cart}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.view_cart}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.begin_checkout}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.checkout_start}
                                </td>
                                <td className="p-2 text-right tabular-nums">
                                  {slot.counts.purchase}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl mb-4">
              Top products ({rangeLabel.toLowerCase()})
            </h2>
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

function AbandonCard({
  label,
  count,
  total,
  hint,
}: {
  label: string;
  count: number;
  total: number;
  hint: string;
}) {
  return (
    <div className="border border-line p-4">
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-2xl tabular-nums">{count}</div>
      <p className="text-xs text-muted mt-1">
        {funnelRate(count, total)} of {total} · {hint}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted text-xs mb-0.5">{label}</div>
      <div className="tabular-nums text-lg">{value}</div>
    </div>
  );
}

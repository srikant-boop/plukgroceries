import { listOrders, type Order } from "@/lib/orders";
import { getPickupSpot } from "@/lib/pickup";
import { money } from "@/lib/format";
import { getAdminPassword } from "@/lib/admin-auth";
import { AdminClearOrders } from "./AdminClearOrders";
import { AdminLogoutLink } from "./AdminLogoutLink";
import { AdminRegisterSession } from "./AdminRegisterSession";
import { AdminDeleteOrder } from "./AdminDeleteOrder";
import { AdminFulfillToggle } from "./AdminFulfillToggle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const adminConfigured = Boolean(getAdminPassword());
  let orders: Order[] = [];
  let error: string | null = null;
  try {
    orders = await listOrders(200);
  } catch (e) {
    error = e instanceof Error ? e.message : "Storage unavailable";
  }

  const pending = orders.filter((o) => !o.fulfilled);
  const done = orders.filter((o) => o.fulfilled);
  const revenue = orders
    .filter((o) => o.paid)
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <AdminRegisterSession />
      <header className="mb-10 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="text-3xl">Orders</h1>
        </div>
        <div className="flex gap-6 text-sm">
          <Stat label="Pending" value={String(pending.length)} />
          <Stat label="Fulfilled" value={String(done.length)} />
          <Stat label="Revenue" value={money(revenue)} />
          <a
            href="/admin/analytics"
            className="self-end underline underline-offset-4 hover:text-accent"
          >
            Insights →
          </a>
          <AdminLogoutLink />
        </div>
      </header>

      {!adminConfigured && (
        <div className="border border-price-cut p-4 mb-8 text-sm text-price-cut">
          Set <code className="text-xs">ADMIN_PASSWORD</code> in Vercel (Production),
          redeploy, then sign in at /admin/login — otherwise &ldquo;Mark
          fulfilled&rdquo; cannot save.
        </div>
      )}

      {error && (
        <div className="border border-price-cut p-4 mb-8 text-sm text-price-cut">
          Couldn&apos;t load orders: {error}. Make sure Vercel Storage / REDIS_URL
          is connected.
        </div>
      )}

      {orders.length === 0 && !error && (
        <p className="text-muted text-sm">No orders yet.</p>
      )}

      <OrderTable title="Pending" orders={pending} emptyText="Nothing pending." />
      <div className="mt-12">
        <OrderTable
          title="Fulfilled"
          orders={done}
          emptyText="Nothing fulfilled yet."
        />
      </div>

      <AdminClearOrders orderCount={orders.length} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="eyebrow">{label}</div>
      <div className="text-lg tabular-nums">{value}</div>
    </div>
  );
}

function OrderTable({
  title,
  orders,
  emptyText,
}: {
  title: string;
  orders: Awaited<ReturnType<typeof listOrders>>;
  emptyText: string;
}) {
  return (
    <section>
      <h2 className="text-xl mb-4">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <ul className="border-t border-line">
          {orders.map((o) => {
            const spot = getPickupSpot(o.pickupSpotId);
            return (
              <li
                key={o.id}
                className="border-b border-line py-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-medium">{o.customer.name}</span>
                    <a
                      href={`tel:${o.customer.phone.replace(/[^+\d]/g, "")}`}
                      className="text-sm text-muted hover:text-foreground"
                    >
                      {o.customer.phone}
                    </a>
                    {o.customer.email && (
                      <a
                        href={`mailto:${o.customer.email}`}
                        className="text-sm text-muted hover:text-foreground"
                      >
                        {o.customer.email}
                      </a>
                    )}
                    <span className="text-xs text-muted ml-auto">
                      {new Date(o.createdAt).toLocaleString("en-CA", {
                        timeZone: "America/Toronto",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-accent mt-1">
                    {spot?.name ?? o.pickupSpotId} · {spot?.slot ?? ""}
                  </p>
                  {o.customer.notes && (
                    <p className="text-sm text-muted mt-1 italic">
                      &ldquo;{o.customer.notes}&rdquo;
                    </p>
                  )}
                  <ul className="text-sm mt-2 space-y-0.5">
                    {o.lines.map((l) => (
                      <li key={l.productId}>
                        {l.qty}× {l.name}{" "}
                        <span className="text-muted">({l.unit})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg tabular-nums">
                    {money(o.total)}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider ${o.paid ? "text-accent" : "text-price-cut"}`}
                  >
                    {o.paid ? "Paid" : "Unpaid"}
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <AdminFulfillToggle id={o.id} fulfilled={o.fulfilled} />
                    <AdminDeleteOrder
                      id={o.id}
                      customerName={o.customer.name}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

import { deleteKeys, getKv, listZsetMembers, zremMember } from "./kv";
import {
  normalizeOrderLine,
  orderLineSubtotal,
  orderLineTotals,
  type OrderLine,
} from "./order-snapshot";

export type { OrderLine, OrderLineCompetitorSnapshot } from "./order-snapshot";
export { orderLineSubtotal, snapshotOrderLine, orderLineTotals } from "./order-snapshot";

export type Order = {
  id: string; // Stripe Checkout Session id (cs_...) — guaranteed unique
  createdAt: number; // ms epoch
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    deliveryAddress?: string;
  };
  pickupSpotId: string;
  paymentMethod?: "card" | "cod" | "etransfer";
  lines: OrderLine[];
  subtotal: number; // CAD — sum of line subtotals
  total: number; // CAD — Stripe amount charged
  /** Sum of wholesaler cost × qty at order time. */
  totalWholesaleCost: number;
  /** Sum of margin on lines at order time. */
  totalMargin: number;
  paid: boolean;
  fulfilled: boolean;
  stripePaymentIntentId?: string;
  /** ISO — when catalogue prices were frozen for this order. */
  catalogSnapshotAt: string;
  /** Invite code used at checkout (invitee). */
  inviteRef?: string;
  /** Inviter's Stripe session id when this order came through a ref link. */
  invitedByOrderId?: string;
};

const ORDERS_KEY = "pluk:orders";
const ORDER_KEY = (id: string) => `pluk:order:${id}`;

function hydrateOrder(raw: Order): Order {
  const lines = raw.lines.map(normalizeOrderLine);
  const totals = orderLineTotals(lines);
  return {
    ...raw,
    lines,
    subtotal: raw.subtotal ?? totals.subtotal,
    totalWholesaleCost: raw.totalWholesaleCost ?? totals.totalWholesaleCost,
    totalMargin: raw.totalMargin ?? totals.totalMargin,
    catalogSnapshotAt:
      raw.catalogSnapshotAt ?? lines[0]?.snapshotAt ?? new Date(raw.createdAt).toISOString(),
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const existing = await getOrder(order.id);
  if (existing) return;

  const r = await getKv();
  await Promise.all([
    r.set(ORDER_KEY(order.id), JSON.stringify(order)),
    r.zadd(ORDERS_KEY, order.createdAt, order.id),
  ]);
}

export async function getOrder(id: string): Promise<Order | null> {
  const r = await getKv();
  const raw = await r.get(ORDER_KEY(id));
  if (!raw) return null;
  return hydrateOrder(JSON.parse(raw) as Order);
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const r = await getKv();
  const ids = await r.zrangeRev(ORDERS_KEY, 0, limit - 1);
  if (ids.length === 0) return [];
  const raws = await r.mget(ids.map((id) => ORDER_KEY(id)));
  return raws
    .map((raw) =>
      raw == null ? null : hydrateOrder(JSON.parse(raw) as Order),
    )
    .filter((o): o is Order => o !== null);
}

export async function markFulfilled(id: string, value: boolean): Promise<void> {
  const order = await getOrder(id);
  if (!order) return;
  order.fulfilled = value;
  const r = await getKv();
  await r.set(ORDER_KEY(id), JSON.stringify(order));
}

/** Remove one order from storage (does not refund in Stripe). */
export async function deleteOrder(id: string): Promise<boolean> {
  const existing = await getOrder(id);
  if (!existing) return false;
  await deleteKeys(ORDER_KEY(id));
  await zremMember(ORDERS_KEY, id);
  return true;
}

/** Remove every saved order (test reset before launch). */
export async function clearAllOrders(): Promise<{ deleted: number }> {
  const ids = await listZsetMembers(ORDERS_KEY);
  const keys = ids.map((id) => ORDER_KEY(id));
  await deleteKeys(...keys, ORDERS_KEY);
  return { deleted: ids.length };
}

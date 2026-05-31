import { getRedis } from "./storage";

export type OrderLine = {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string; // Stripe Checkout Session id (cs_...) — guaranteed unique
  createdAt: number; // ms epoch
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  pickupSpotId: string;
  lines: OrderLine[];
  subtotal: number; // CAD
  total: number; // CAD (= subtotal for now; no shipping/tax line)
  paid: boolean;
  fulfilled: boolean;
  stripePaymentIntentId?: string;
};

const ORDERS_KEY = "pluk:orders"; // sorted set, score = createdAt
const ORDER_KEY = (id: string) => `pluk:order:${id}`;

export async function saveOrder(order: Order): Promise<void> {
  const r = getRedis();
  await Promise.all([
    r.set(ORDER_KEY(order.id), JSON.stringify(order)),
    r.zadd(ORDERS_KEY, { score: order.createdAt, member: order.id }),
  ]);
}

export async function getOrder(id: string): Promise<Order | null> {
  const r = getRedis();
  const raw = await r.get<string | Order>(ORDER_KEY(id));
  if (!raw) return null;
  return typeof raw === "string" ? (JSON.parse(raw) as Order) : raw;
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const r = getRedis();
  // Newest first
  const ids = (await r.zrange<string[]>(ORDERS_KEY, 0, limit - 1, {
    rev: true,
  })) as string[];
  if (ids.length === 0) return [];
  const raws = await r.mget<(string | Order | null)[]>(
    ...ids.map((id) => ORDER_KEY(id)),
  );
  return raws
    .map((raw) =>
      raw == null
        ? null
        : typeof raw === "string"
          ? (JSON.parse(raw) as Order)
          : raw,
    )
    .filter((o): o is Order => o !== null);
}

export async function markFulfilled(id: string, value: boolean): Promise<void> {
  const order = await getOrder(id);
  if (!order) return;
  order.fulfilled = value;
  await getRedis().set(ORDER_KEY(id), JSON.stringify(order));
}

import { getProductById } from "@/lib/products";
import { getKv, isStorageConfigured } from "@/lib/kv";

/** Funnel steps stored as daily counters in Redis (America/Toronto dates). */
export const ANALYTICS_EVENTS = [
  "page_view",
  "product_click",
  "product_view",
  "add_to_cart",
  "view_cart",
  "begin_checkout",
  "checkout_start",
  "purchase",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsPayload = {
  type: AnalyticsEventType;
  sessionId?: string;
  path?: string;
  productId?: string;
  qty?: number;
};

const TTL_SECONDS = 90 * 24 * 60 * 60;

function dateKey(d = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
}

function datesBack(days: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push(dateKey(d));
  }
  return out;
}

function countKey(date: string, event: AnalyticsEventType) {
  return `pluk:analytics:${date}:count:${event}`;
}

function sessionsKey(date: string) {
  return `pluk:analytics:${date}:sessions`;
}

function productKey(date: string, event: "product_view" | "add_to_cart") {
  return `pluk:analytics:${date}:product:${event}`;
}

async function touchTtl(kv: Awaited<ReturnType<typeof getKv>>, ...keys: string[]) {
  await Promise.all(keys.map((k) => kv.expire(k, TTL_SECONDS)));
}

/** Record a client or server analytics event. Fails silently if storage is down. */
export async function recordAnalytics(payload: AnalyticsPayload): Promise<void> {
  if (!isStorageConfigured()) return;
  if (payload.type === "purchase") return; // server-only via recordPurchase()

  try {
    const kv = await getKv();
    const day = dateKey();
    const keys = [countKey(day, payload.type)];

    await kv.incr(countKey(day, payload.type));

    if (payload.sessionId) {
      keys.push(sessionsKey(day));
      await kv.sadd(sessionsKey(day), payload.sessionId);
    }

    if (
      payload.productId &&
      (payload.type === "product_view" ||
        payload.type === "product_click" ||
        payload.type === "add_to_cart")
    ) {
      const hashEvent =
        payload.type === "add_to_cart" ? "add_to_cart" : "product_view";
      const pk = productKey(day, hashEvent);
      keys.push(pk);
      await kv.hincrby(pk, payload.productId, payload.qty ?? 1);
    }

    await touchTtl(kv, ...keys);
  } catch (err) {
    console.error("[analytics] record failed", err);
  }
}

/** Called from Stripe webhook after a paid order is saved. */
export async function recordPurchase(): Promise<void> {
  if (!isStorageConfigured()) return;
  try {
    const kv = await getKv();
    const day = dateKey();
    const key = countKey(day, "purchase");
    await kv.incr(key);
    await touchTtl(kv, key);
  } catch (err) {
    console.error("[analytics] purchase record failed", err);
  }
}

export type DayFunnel = {
  date: string;
  visitors: number;
  counts: Record<AnalyticsEventType, number>;
};

export type ProductStat = {
  productId: string;
  name: string;
  views: number;
  adds: number;
};

export type AnalyticsSummary = {
  days: DayFunnel[];
  totals: Record<AnalyticsEventType, number>;
  topProducts: ProductStat[];
};

async function readDay(kv: Awaited<ReturnType<typeof getKv>>, day: string): Promise<DayFunnel> {
  const counts = {} as Record<AnalyticsEventType, number>;
  for (const event of ANALYTICS_EVENTS) {
    const raw = await kv.get(countKey(day, event));
    counts[event] = raw ? Number.parseInt(raw, 10) || 0 : 0;
  }
  const visitors = await kv.scard(sessionsKey(day));
  return { date: day, visitors, counts };
}

function mergeProductHash(
  acc: Map<string, { views: number; adds: number }>,
  productId: string,
  field: "views" | "adds",
  n: number,
) {
  const cur = acc.get(productId) ?? { views: 0, adds: 0 };
  cur[field] += n;
  acc.set(productId, cur);
}

/** Admin dashboard: last N calendar days (Toronto), aggregated funnel + top products. */
export async function getAnalyticsSummary(days = 7): Promise<AnalyticsSummary> {
  const kv = await getKv();
  const dayList = datesBack(days);
  const funnelDays: DayFunnel[] = [];
  const totals = Object.fromEntries(
    ANALYTICS_EVENTS.map((e) => [e, 0]),
  ) as Record<AnalyticsEventType, number>;
  const productAcc = new Map<string, { views: number; adds: number }>();

  for (const day of dayList) {
    const row = await readDay(kv, day);
    funnelDays.push(row);
    for (const event of ANALYTICS_EVENTS) {
      totals[event] += row.counts[event];
    }

    const views = await kv.hgetall(productKey(day, "product_view"));
    for (const [productId, raw] of Object.entries(views)) {
      mergeProductHash(productAcc, productId, "views", Number.parseInt(raw, 10) || 0);
    }
    const adds = await kv.hgetall(productKey(day, "add_to_cart"));
    for (const [productId, raw] of Object.entries(adds)) {
      mergeProductHash(productAcc, productId, "adds", Number.parseInt(raw, 10) || 0);
    }
  }

  const topProducts: ProductStat[] = [...productAcc.entries()]
    .map(([productId, { views, adds }]) => {
      const p = getProductById(productId);
      return {
        productId,
        name: p?.name ?? productId,
        views,
        adds,
      };
    })
    .sort((a, b) => b.views + b.adds * 2 - (a.views + a.adds * 2))
    .slice(0, 12);

  return { days: funnelDays, totals, topProducts };
}

export function funnelRate(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

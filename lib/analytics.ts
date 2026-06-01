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
const RECENT_KEY = "pluk:analytics:recent";
const RECENT_MAX = 400;
const TORONTO = "America/Toronto";

type TorontoParts = { date: string; hour: number; time: string };

function torontoParts(d = new Date()): TorontoParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = Number.parseInt(get("hour"), 10);
  const time = `${get("hour")}:${get("minute")}`;
  return { date, hour, time };
}

function dateKey(d = new Date()): string {
  return torontoParts(d).date;
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

function hourlyCountKey(date: string, hour: number, event: AnalyticsEventType) {
  const h = hour.toString().padStart(2, "0");
  return `pluk:analytics:${date}:h${h}:count:${event}`;
}

function sessionsKey(date: string) {
  return `pluk:analytics:${date}:sessions`;
}

function hourlySessionsKey(date: string, hour: number) {
  const h = hour.toString().padStart(2, "0");
  return `pluk:analytics:${date}:h${h}:sessions`;
}

function productKey(date: string, event: "product_view" | "add_to_cart") {
  return `pluk:analytics:${date}:product:${event}`;
}

async function touchTtl(kv: Awaited<ReturnType<typeof getKv>>, ...keys: string[]) {
  await Promise.all(keys.map((k) => kv.expire(k, TTL_SECONDS)));
}

async function appendRecent(
  kv: Awaited<ReturnType<typeof getKv>>,
  at: number,
  payload: AnalyticsPayload,
) {
  const member = JSON.stringify({
    at,
    type: payload.type,
    path: payload.path,
    productId: payload.productId,
  });
  await kv.zadd(RECENT_KEY, at, member);
  await kv.expire(RECENT_KEY, TTL_SECONDS);
  const n = await kv.zcard(RECENT_KEY);
  if (n > RECENT_MAX) {
    await kv.zremrangebyrank(RECENT_KEY, 0, n - RECENT_MAX - 1);
  }
}

async function bumpMetrics(
  kv: Awaited<ReturnType<typeof getKv>>,
  payload: AnalyticsPayload,
  at = Date.now(),
): Promise<void> {
  const { date, hour } = torontoParts(new Date(at));
  const keys: string[] = [];

  keys.push(countKey(date, payload.type));
  await kv.incr(countKey(date, payload.type));

  keys.push(hourlyCountKey(date, hour, payload.type));
  await kv.incr(hourlyCountKey(date, hour, payload.type));

  if (payload.sessionId) {
    keys.push(sessionsKey(date), hourlySessionsKey(date, hour));
    await kv.sadd(sessionsKey(date), payload.sessionId);
    await kv.sadd(hourlySessionsKey(date, hour), payload.sessionId);
  }

  if (
    payload.productId &&
    (payload.type === "product_view" ||
      payload.type === "product_click" ||
      payload.type === "add_to_cart")
  ) {
    const hashEvent =
      payload.type === "add_to_cart" ? "add_to_cart" : "product_view";
    const pk = productKey(date, hashEvent);
    keys.push(pk);
    await kv.hincrby(pk, payload.productId, payload.qty ?? 1);
  }

  await appendRecent(kv, at, payload);
  await touchTtl(kv, ...keys);
}

/** Record a client or server analytics event. Fails silently if storage is down. */
export async function recordAnalytics(payload: AnalyticsPayload): Promise<void> {
  if (!isStorageConfigured()) return;
  if (payload.type === "purchase") return;

  try {
    const kv = await getKv();
    await bumpMetrics(kv, payload);
  } catch (err) {
    console.error("[analytics] record failed", err);
  }
}

/** Called from Stripe webhook after a paid order is saved. */
export async function recordPurchase(): Promise<void> {
  if (!isStorageConfigured()) return;
  try {
    const kv = await getKv();
    await bumpMetrics(kv, { type: "purchase" });
  } catch (err) {
    console.error("[analytics] purchase record failed", err);
  }
}

export type DayFunnel = {
  date: string;
  visitors: number;
  counts: Record<AnalyticsEventType, number>;
};

export type HourSlot = {
  hour: number;
  label: string;
  sessions: number;
  counts: Record<AnalyticsEventType, number>;
};

export type DayHourly = {
  date: string;
  hours: HourSlot[];
};

export type PeakHour = {
  hour: number;
  label: string;
  pageViews: number;
  adds: number;
  checkouts: number;
  purchases: number;
  total: number;
};

export type RecentActivity = {
  at: number;
  date: string;
  time: string;
  type: AnalyticsEventType;
  detail: string;
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
  hourlyByDay: DayHourly[];
  peakHours: PeakHour[];
  recentActivity: RecentActivity[];
  nowToronto: string;
};

export function formatHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export function formatTorontoDateTime(at: number): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(at));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
  };
}

async function readDay(kv: Awaited<ReturnType<typeof getKv>>, day: string): Promise<DayFunnel> {
  const counts = {} as Record<AnalyticsEventType, number>;
  for (const event of ANALYTICS_EVENTS) {
    const raw = await kv.get(countKey(day, event));
    counts[event] = raw ? Number.parseInt(raw, 10) || 0 : 0;
  }
  const visitors = await kv.scard(sessionsKey(day));
  return { date: day, visitors, counts };
}

async function readDayHours(
  kv: Awaited<ReturnType<typeof getKv>>,
  day: string,
): Promise<HourSlot[]> {
  const slots: HourSlot[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const counts = {} as Record<AnalyticsEventType, number>;
    let any = 0;
    for (const event of ANALYTICS_EVENTS) {
      const raw = await kv.get(hourlyCountKey(day, hour, event));
      counts[event] = raw ? Number.parseInt(raw, 10) || 0 : 0;
      any += counts[event];
    }
    const sessions = await kv.scard(hourlySessionsKey(day, hour));
    if (any > 0 || sessions > 0) {
      slots.push({
        hour,
        label: formatHourLabel(hour),
        sessions,
        counts,
      });
    }
  }
  return slots;
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

const EVENT_LABELS: Record<AnalyticsEventType, string> = {
  page_view: "Page view",
  product_click: "Product click",
  product_view: "Product page",
  add_to_cart: "Add to cart",
  view_cart: "Cart viewed",
  begin_checkout: "Checkout opened",
  checkout_start: "Pay clicked",
  purchase: "Order paid",
};

function recentDetail(type: AnalyticsEventType, productId?: string, path?: string): string {
  if (productId) {
    const p = getProductById(productId);
    const name = p?.name ?? productId;
    return `${EVENT_LABELS[type]} · ${name}`;
  }
  if (path) return `${EVENT_LABELS[type]} · ${path}`;
  return EVENT_LABELS[type];
}

async function readRecentActivity(
  kv: Awaited<ReturnType<typeof getKv>>,
  limit = 40,
): Promise<RecentActivity[]> {
  const raw = await kv.zrangeRev(RECENT_KEY, 0, limit - 1);
  const out: RecentActivity[] = [];
  for (const line of raw) {
    try {
      const row = JSON.parse(line) as {
        at: number;
        type: AnalyticsEventType;
        path?: string;
        productId?: string;
      };
      if (!row.at || !row.type) continue;
      const { date, time } = formatTorontoDateTime(row.at);
      out.push({
        at: row.at,
        date,
        time,
        type: row.type,
        detail: recentDetail(row.type, row.productId, row.path),
      });
    } catch {
      // skip corrupt rows
    }
  }
  return out;
}

/** Admin dashboard: last N calendar days (Toronto), funnel + time breakdown. */
export async function getAnalyticsSummary(days = 7): Promise<AnalyticsSummary> {
  const kv = await getKv();
  const dayList = datesBack(days);
  const funnelDays: DayFunnel[] = [];
  const hourlyByDay: DayHourly[] = [];
  const peakAcc = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: formatHourLabel(hour),
    pageViews: 0,
    adds: 0,
    checkouts: 0,
    purchases: 0,
    total: 0,
  }));
  const totals = Object.fromEntries(
    ANALYTICS_EVENTS.map((e) => [e, 0]),
  ) as Record<AnalyticsEventType, number>;
  const productAcc = new Map<string, { views: number; adds: number }>();

  for (const day of dayList) {
    const row = await readDay(kv, day);
    funnelDays.push(row);
    const hours = await readDayHours(kv, day);
    hourlyByDay.push({ date: day, hours });

    for (const slot of hours) {
      const ph = peakAcc[slot.hour]!;
      ph.pageViews += slot.counts.page_view;
      ph.adds += slot.counts.add_to_cart;
      ph.checkouts +=
        slot.counts.begin_checkout + slot.counts.checkout_start;
      ph.purchases += slot.counts.purchase;
      ph.total += ANALYTICS_EVENTS.reduce((s, e) => s + slot.counts[e], 0);
    }

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

  const peakHours = peakAcc
    .filter((h) => h.total > 0)
    .sort((a, b) => b.total - a.total);

  const now = formatTorontoDateTime(Date.now());

  return {
    days: funnelDays,
    totals,
    topProducts,
    hourlyByDay,
    peakHours,
    recentActivity: await readRecentActivity(kv),
    nowToronto: `${now.date} ${now.time} ET`,
  };
}

export function funnelRate(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

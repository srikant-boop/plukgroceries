import { getProductById } from "@/lib/products";
import { deleteKeys, getKv, isStorageConfigured, listZsetMembers, zremMember } from "@/lib/kv";
import type { VisitorGeo, VisitorGeoPoint, VisitorGeoSummary } from "@/lib/visitor-geo";
import {
  geoDistanceMeters,
  isSameApproxLocation,
  resolveVisitorCity,
} from "@/lib/visitor-geo";
import {
  analyticsRangeLabel,
  analyticsRangeMs,
  type AnalyticsRange,
  analyticsTrackingSinceFromEnv,
  getAnalyticsTrackingSinceMs,
  RANGE_DAYS,
  timelineBucketCount,
  timelineGranularity,
  type TimelineGranularity,
} from "@/lib/analytics-ranges";

export type { AnalyticsRange } from "@/lib/analytics-ranges";
export {
  ANALYTICS_RANGE_OPTIONS,
  analyticsRangeLabel,
  parseAnalyticsRange,
} from "@/lib/analytics-ranges";

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

type StoredEvent = {
  at: number;
  type: AnalyticsEventType;
  path?: string;
  productId?: string;
  sessionId?: string;
};

export type AnalyticsPayload = {
  type: AnalyticsEventType;
  sessionId?: string;
  path?: string;
  productId?: string;
  qty?: number;
  geo?: VisitorGeo | null;
};

const TTL_SECONDS = 90 * 24 * 60 * 60;
const RECENT_KEY = "pluk:analytics:recent";
const GEO_RECENT_KEY = "pluk:analytics:geo:recent";
const ADMIN_SESSIONS_KEY = "pluk:analytics:admin_sessions";
const RECENT_MAX = 2000;
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

function sessionGeoKey(sessionId: string) {
  return `pluk:analytics:geo:session:${sessionId}`;
}

const GEO_CITY_CACHE_PREFIX = "pluk:analytics:geo:city:v1";
const GEO_CITY_CACHE_TTL_SECONDS = 180 * 24 * 60 * 60;

function geoCityCacheKey(lat: number, lng: number): string {
  // ~110m buckets reduce API calls while staying city-accurate.
  const latBucket = (Math.round(lat * 1000) / 1000).toFixed(3);
  const lngBucket = (Math.round(lng * 1000) / 1000).toFixed(3);
  return `${GEO_CITY_CACHE_PREFIX}:${latBucket}:${lngBucket}`;
}

function isGenericCityLabel(city: string | undefined): boolean {
  if (!city) return true;
  const normalized = city.trim().toLowerCase();
  return (
    !normalized ||
    normalized === "unknown" ||
    normalized === "west gta" ||
    normalized === "outside west gta" ||
    normalized === "ontario"
  );
}

async function fetchReverseGeocodedCity(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const url = new URL(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
    );
    url.searchParams.set("latitude", lat.toString());
    url.searchParams.set("longitude", lng.toString());
    url.searchParams.set("localityLanguage", "en");
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
    };
    const raw = data.city ?? data.locality ?? data.principalSubdivision;
    const city = raw?.trim();
    return city ? city : null;
  } catch {
    return null;
  }
}

async function resolveVisitorCityWithApi(
  kv: Awaited<ReturnType<typeof getKv>>,
  geo: Pick<VisitorGeo, "lat" | "lng" | "city" | "region">,
): Promise<string> {
  const baseCity = resolveVisitorCity(geo);
  if (!isGenericCityLabel(geo.city) || !isGenericCityLabel(baseCity)) {
    return isGenericCityLabel(geo.city) ? baseCity : geo.city!.trim();
  }

  const cacheKey = geoCityCacheKey(geo.lat, geo.lng);
  const cached = await kv.get(cacheKey);
  if (cached?.trim()) return cached.trim();

  const fromApi = await fetchReverseGeocodedCity(geo.lat, geo.lng);
  if (fromApi) {
    await kv.set(cacheKey, fromApi);
    await kv.expire(cacheKey, GEO_CITY_CACHE_TTL_SECONDS);
    return fromApi;
  }
  return baseCity;
}

async function recordSessionGeo(
  kv: Awaited<ReturnType<typeof getKv>>,
  sessionId: string,
  geo: VisitorGeo,
  at: number,
): Promise<void> {
  const markerKey = sessionGeoKey(sessionId);
  const existing = await kv.get(markerKey);
  if (existing) return;

  const point: VisitorGeoPoint = {
    sessionId,
    lat: geo.lat,
    lng: geo.lng,
    city: await resolveVisitorCityWithApi(kv, geo),
    region: geo.region,
    at,
  };

  await kv.set(markerKey, JSON.stringify(point));
  await kv.expire(markerKey, TTL_SECONDS);
  await kv.zadd(GEO_RECENT_KEY, at, JSON.stringify(point));
  await kv.expire(GEO_RECENT_KEY, TTL_SECONDS);
  const n = await kv.zcard(GEO_RECENT_KEY);
  if (n > RECENT_MAX) {
    await kv.zremrangebyrank(GEO_RECENT_KEY, 0, n - RECENT_MAX - 1);
  }
}

async function readVisitorGeoInWindow(
  kv: Awaited<ReturnType<typeof getKv>>,
  windowStartMs: number,
  windowEndMs: number,
  excludeNear?: VisitorGeo | null,
): Promise<VisitorGeoSummary> {
  const rows = await kv.zrangeWithScores(GEO_RECENT_KEY, 0, -1);
  const bySession = new Map<string, VisitorGeoPoint>();
  const cityCounts = new Map<string, number>();

  for (const { member, score } of rows) {
    if (score < windowStartMs || score >= windowEndMs) continue;
    try {
      const row = JSON.parse(member) as VisitorGeoPoint;
      if (!row.sessionId || !Number.isFinite(row.lat) || !Number.isFinite(row.lng))
        continue;
      if (excludeNear && isSameApproxLocation(row, excludeNear)) continue;
      if (!bySession.has(row.sessionId)) {
        const city = await resolveVisitorCityWithApi(kv, row);
        bySession.set(row.sessionId, { ...row, city, at: score });
        cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
      }
    } catch {
      // skip
    }
  }

  const points = [...bySession.values()];
  return {
    points,
    withGeo: points.length,
    cityCounts: [...cityCounts.entries()]
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count),
  };
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
    sessionId: payload.sessionId,
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
  if (payload.sessionId && payload.geo) {
    await recordSessionGeo(kv, payload.sessionId, payload.geo, at);
  }
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

export type EventLogEntry = RecentActivity & {
  sessionId?: string;
  path?: string;
  productId?: string;
};

export type TimelineEventCounts = Record<AnalyticsEventType, number>;

export type TimelineBucket = {
  /** Start of bucket (ms) */
  startMs: number;
  label: string;
  shortLabel: string;
  pageViews: number;
  adds: number;
  checkouts: number;
  purchases: number;
  totalEvents: number;
  sessions: number;
  /** Count per funnel event for stacked charts */
  events: TimelineEventCounts;
};

export type SessionInsights = {
  /** Sessions with at least one tracked event */
  totalSessions: number;
  /** Viewed a product but never added to cart */
  browsedNoAdd: number;
  /** Added to cart but never opened checkout */
  addedNoCheckout: number;
  /** Opened checkout but never clicked Pay */
  checkoutNoPay: number;
  /** Clicked Pay (Stripe) — purchase may not tie to same session */
  clickedPay: number;
  /** Sessions that reached add_to_cart */
  reachedAdd: number;
  /** Sessions that opened cart page */
  reachedCart: number;
  /** Sessions that opened checkout */
  reachedCheckout: number;
};

export type ProductStat = {
  productId: string;
  name: string;
  views: number;
  adds: number;
};

export type AnalyticsSummary = {
  range: AnalyticsRange;
  rangeLabel: string;
  /** Per-event tracking start, formatted for display (Toronto ET). */
  trackingSinceLabel: string;
  /** False until the first event exists in the log (no clamping yet). */
  trackingActive: boolean;
  /** True when the selected range would extend before tracking started. */
  windowClampedToTracking: boolean;
  /** When clamped, every range uses the same window (since tracking started → now). */
  windowUnifiedToTracking: boolean;
  visitors: number;
  days: DayFunnel[];
  totals: Record<AnalyticsEventType, number>;
  topProducts: ProductStat[];
  hourlyByDay: DayHourly[];
  peakHours: PeakHour[];
  recentActivity: RecentActivity[];
  timeline: TimelineBucket[];
  eventLog: EventLogEntry[];
  sessionInsights: SessionInsights | null;
  visitorGeo: VisitorGeoSummary;
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

export function formatTrackingSinceLabel(atMs: number): string {
  const { date, time } = formatTorontoDateTime(atMs);
  return `${date} ${time.slice(0, 5)}`;
}

function torontoDayStartMs(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  let ms = Date.UTC(y, m - 1, d, 17, 0, 0);
  for (let n = 0; n < 72; n++) {
    const p = torontoParts(new Date(ms));
    if (p.date === date && p.hour === 0) {
      const parts = p.time.split(":").map((x) => Number.parseInt(x, 10));
      const mm = parts[1] ?? 0;
      const ss = parts[2] ?? 0;
      return ms - (mm * 60 + ss) * 1000;
    }
    let adjustHours = 0 - p.hour;
    if (p.date < date) adjustHours += 24;
    if (p.date > date) adjustHours -= 24;
    ms += adjustHours * 3_600_000;
  }
  return ms;
}

function resolveAnalyticsTrackingSince(): {
  ms: number;
  label: string;
} {
  const ms = getAnalyticsTrackingSinceMs();
  return { ms, label: formatTrackingSinceLabel(ms) };
}

function resolveEffectiveWindow(
  range: AnalyticsRange,
  trackingSinceMs: number,
  nowMs: number,
): { windowStartMs: number; windowEndMs: number; clamped: boolean } {
  const rangeMs = analyticsRangeMs(range);
  const requestedStart =
    rangeMs != null
      ? nowMs - rangeMs
      : torontoDayStartMs(datesBack(RANGE_DAYS[range]).at(-1) ?? dateKey());
  const clamped = requestedStart < trackingSinceMs;
  return {
    windowStartMs: clamped ? trackingSinceMs : requestedStart,
    windowEndMs: nowMs,
    clamped,
  };
}

/** Full axis span for the selected range (not clamped to tracking start). */
function resolveRequestedTimelineWindow(
  range: AnalyticsRange,
  nowMs: number,
): { startMs: number; endMs: number } {
  const rangeMs = analyticsRangeMs(range);
  if (rangeMs != null) {
    return { startMs: nowMs - rangeMs, endMs: nowMs };
  }
  const oldest = datesBack(RANGE_DAYS[range]).at(-1) ?? dateKey();
  return { startMs: torontoDayStartMs(oldest), endMs: nowMs };
}

function calendarDaysOldestFirst(count: number): string[] {
  return [...datesBack(count)].reverse();
}

function dayFunnelFromEvents(date: string, events: StoredEvent[]): DayFunnel {
  const counts = emptyTotals();
  const sessions = new Set<string>();
  for (const e of events) {
    const { date: eventDate } = formatTorontoDateTime(e.at);
    if (eventDate !== date) continue;
    counts[e.type] += 1;
    if (e.sessionId) sessions.add(e.sessionId);
  }
  return { date, visitors: sessions.size, counts };
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

async function getAdminSessionIds(
  kv: Awaited<ReturnType<typeof getKv>>,
): Promise<Set<string>> {
  const members = await kv.smembers(ADMIN_SESSIONS_KEY);
  return new Set(members);
}

/** Remember browser sessions used while logged in as admin (excluded from Insights). */
async function purgeSessionStorage(
  kv: Awaited<ReturnType<typeof getKv>>,
  sessionId: string,
): Promise<void> {
  for (const line of await listZsetMembers(RECENT_KEY)) {
    try {
      const row = JSON.parse(line) as StoredEvent;
      if (row.sessionId === sessionId) {
        await zremMember(RECENT_KEY, line);
      }
    } catch {
      // skip
    }
  }

  await deleteKeys(sessionGeoKey(sessionId));

  const geoRows = await kv.zrangeWithScores(GEO_RECENT_KEY, 0, -1);
  for (const { member } of geoRows) {
    try {
      const row = JSON.parse(member) as VisitorGeoPoint;
      if (row.sessionId === sessionId) {
        await zremMember(GEO_RECENT_KEY, member);
      }
    } catch {
      // skip
    }
  }
}

export async function markAdminSession(sessionId: string | undefined): Promise<void> {
  if (!sessionId || !isStorageConfigured()) return;
  const id = sessionId.slice(0, 64);
  try {
    const kv = await getKv();
    await kv.sadd(ADMIN_SESSIONS_KEY, id);
    await kv.expire(ADMIN_SESSIONS_KEY, TTL_SECONDS);
    await purgeSessionStorage(kv, id);
  } catch (err) {
    console.error("[analytics] mark admin session failed", err);
  }
}

function isAdminSession(sessionId: string | undefined, adminIds: Set<string>): boolean {
  return Boolean(sessionId && adminIds.has(sessionId));
}

async function readAllRecentEvents(
  kv: Awaited<ReturnType<typeof getKv>>,
): Promise<StoredEvent[]> {
  const adminIds = await getAdminSessionIds(kv);
  const raw = await kv.zrangeRev(RECENT_KEY, 0, RECENT_MAX - 1);
  const out: StoredEvent[] = [];
  for (const line of raw) {
    try {
      const row = JSON.parse(line) as StoredEvent;
      if (row.at && row.type && !isAdminSession(row.sessionId, adminIds)) {
        out.push(row);
      }
    } catch {
      // skip
    }
  }
  return out;
}

function emptyTotals(): Record<AnalyticsEventType, number> {
  return Object.fromEntries(ANALYTICS_EVENTS.map((e) => [e, 0])) as Record<
    AnalyticsEventType,
    number
  >;
}

function eventToLogEntry(row: StoredEvent): EventLogEntry {
  const { date, time } = formatTorontoDateTime(row.at);
  return {
    at: row.at,
    date,
    time,
    type: row.type,
    detail: recentDetail(row.type, row.productId, row.path),
    sessionId: row.sessionId,
    path: row.path,
    productId: row.productId,
  };
}

function emptyEventCounts(): TimelineEventCounts {
  return Object.fromEntries(ANALYTICS_EVENTS.map((e) => [e, 0])) as TimelineEventCounts;
}

function torontoDatesInWindow(windowStartMs: number, windowEndMs: number): string[] {
  const dates: string[] = [];
  const seen = new Set<string>();
  for (let ms = windowStartMs; ms < windowEndMs; ms += 3_600_000) {
    const { date } = formatTorontoDateTime(ms);
    if (!seen.has(date)) {
      seen.add(date);
      dates.push(date);
    }
  }
  const endDate = formatTorontoDateTime(Math.max(windowStartMs, windowEndMs - 1)).date;
  if (!seen.has(endDate)) dates.push(endDate);
  return dates.sort();
}

function formatDayBucketLabel(date: string): { label: string; shortLabel: string } {
  const startMs = torontoDayStartMs(date);
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO,
    month: "short",
    day: "numeric",
  }).format(new Date(startMs));
  const [month, day] = date.slice(5).split("-");
  const shortLabel = `${Number(month)}/${Number(day)}`;
  return { label, shortLabel };
}

function formatHourBucketLabel(atMs: number): { label: string; shortLabel: string } {
  const { date, time } = formatTorontoDateTime(atMs);
  const hour = Number.parseInt(time.slice(0, 2), 10);
  const hourLabel = formatHourLabel(hour);
  return { label: `${date} ${hourLabel}`, shortLabel: hourLabel };
}

function formatMinuteBucketLabel(atMs: number): { label: string; shortLabel: string } {
  const { date, time } = formatTorontoDateTime(atMs);
  const hour = Number.parseInt(time.slice(0, 2), 10);
  const minute = time.slice(3, 5);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? "AM" : "PM";
  const shortLabel = `${hour12}:${minute}`;
  return { label: `${date} ${hour12}:${minute} ${ampm}`, shortLabel };
}

/** Floor an instant to a Toronto wall-clock step (5 min, 60 min, etc.). */
function torontoWallClockFloorMs(atMs: number, stepMinutes: number): number {
  const { time } = formatTorontoDateTime(atMs);
  const parts = time.split(":").map((x) => Number.parseInt(x, 10));
  const minute = parts[1] ?? 0;
  const second = parts[2] ?? 0;
  const flooredMinute =
    stepMinutes >= 60 ? 0 : Math.floor(minute / stepMinutes) * stepMinutes;
  const minuteDelta = minute - flooredMinute;
  return atMs - (minuteDelta * 60 + second) * 1000 - (atMs % 1000);
}

function assignEventsToAlignedBuckets(
  events: StoredEvent[],
  buckets: TimelineBucket[],
  bucketMs: number,
  axisEndMs: number,
): void {
  const sessionSets = buckets.map(() => new Set<string>());
  const rangeStart = buckets[0]?.startMs ?? 0;

  for (const row of events) {
    if (row.at < rangeStart || row.at >= axisEndMs) continue;
    let idx = buckets.length - 1;
    for (let i = 0; i < buckets.length; i++) {
      const start = buckets[i]!.startMs;
      const end = i < buckets.length - 1 ? buckets[i + 1]!.startMs : axisEndMs;
      if (row.at >= start && row.at < end) {
        idx = i;
        break;
      }
    }
    addEventToBucket(buckets[idx]!, row, sessionSets[idx]!);
  }

  for (let i = 0; i < buckets.length; i++) {
    buckets[i]!.sessions = sessionSets[i]!.size;
  }
}

function resolveTimelineBucketCount(
  range: AnalyticsRange,
  granularity: TimelineGranularity,
): number {
  if (granularity === "day") {
    return RANGE_DAYS[range];
  }
  return timelineBucketCount(range);
}

function emptyTimelineBucket(
  startMs: number,
  label: string,
  shortLabel: string,
): TimelineBucket {
  return {
    startMs,
    label,
    shortLabel,
    pageViews: 0,
    adds: 0,
    checkouts: 0,
    purchases: 0,
    totalEvents: 0,
    sessions: 0,
    events: emptyEventCounts(),
  };
}

function addEventToBucket(b: TimelineBucket, row: StoredEvent, sessionSet: Set<string>) {
  b.totalEvents += 1;
  b.events[row.type] += 1;
  if (row.type === "page_view") b.pageViews += 1;
  if (row.type === "add_to_cart") b.adds += 1;
  if (row.type === "begin_checkout" || row.type === "checkout_start") {
    b.checkouts += 1;
  }
  if (row.type === "purchase") b.purchases += 1;
  if (row.sessionId) sessionSet.add(row.sessionId);
}

function buildTimelineByDay(
  events: StoredEvent[],
  range: AnalyticsRange,
  axisStartMs: number,
  axisEndMs: number,
): TimelineBucket[] {
  const dates =
    range === "7d"
      ? calendarDaysOldestFirst(RANGE_DAYS["7d"])
      : torontoDatesInWindow(axisStartMs, axisEndMs);
  const buckets = dates.map((date) => {
    const { label, shortLabel } = formatDayBucketLabel(date);
    return emptyTimelineBucket(torontoDayStartMs(date), label, shortLabel);
  });
  const dateIndex = new Map(dates.map((d, i) => [d, i]));
  const sessionSets = buckets.map(() => new Set<string>());

  for (const row of events) {
    if (row.at < axisStartMs || row.at >= axisEndMs) continue;
    const { date } = formatTorontoDateTime(row.at);
    const idx = dateIndex.get(date);
    if (idx == null) continue;
    addEventToBucket(buckets[idx]!, row, sessionSets[idx]!);
  }

  for (let i = 0; i < buckets.length; i++) {
    buckets[i]!.sessions = sessionSets[i]!.size;
  }
  return buckets;
}

function buildTimelineFromEvents(
  events: StoredEvent[],
  range: AnalyticsRange,
  axisStartMs: number,
  axisEndMs: number,
): TimelineBucket[] {
  const granularity = timelineGranularity(range);
  if (granularity === "day") {
    return buildTimelineByDay(events, range, axisStartMs, axisEndMs);
  }

  const bucketCount = resolveTimelineBucketCount(range, granularity);

  if (granularity === "hour") {
    const hourMs = 3_600_000;
    const endHourStart = torontoWallClockFloorMs(axisEndMs, 60);
    const buckets: TimelineBucket[] = Array.from({ length: bucketCount }, (_, i) => {
      const startMs = endHourStart - (bucketCount - 1 - i) * hourMs;
      const { label, shortLabel } = formatHourBucketLabel(startMs);
      return emptyTimelineBucket(startMs, label, shortLabel);
    });
    assignEventsToAlignedBuckets(events, buckets, hourMs, axisEndMs);
    return buckets;
  }

  const stepMinutes = 5;
  const stepMs = stepMinutes * 60 * 1000;
  const endStepStart = torontoWallClockFloorMs(axisEndMs, stepMinutes);
  const buckets: TimelineBucket[] = Array.from({ length: bucketCount }, (_, i) => {
    const startMs = endStepStart - (bucketCount - 1 - i) * stepMs;
    const { label, shortLabel } = formatMinuteBucketLabel(startMs);
    return emptyTimelineBucket(startMs, label, shortLabel);
  });
  assignEventsToAlignedBuckets(events, buckets, stepMs, axisEndMs);
  return buckets;
}

function buildTimelineFromDays(days: DayFunnel[], range: AnalyticsRange): TimelineBucket[] {
  const datesOldestFirst =
    range === "7d"
      ? calendarDaysOldestFirst(RANGE_DAYS["7d"])
      : [...days].reverse().map((d) => d.date);
  const byDate = new Map(days.map((d) => [d.date, d]));

  return datesOldestFirst.map((date) => {
    const d = byDate.get(date) ?? {
      date,
      visitors: 0,
      counts: emptyTotals(),
    };
    const { label, shortLabel } = formatDayBucketLabel(date);
    return {
      startMs: torontoDayStartMs(date),
      label,
      shortLabel,
      pageViews: d.counts.page_view,
      adds: d.counts.add_to_cart,
      checkouts: d.counts.begin_checkout + d.counts.checkout_start,
      purchases: d.counts.purchase,
      totalEvents: ANALYTICS_EVENTS.reduce((s, e) => s + d.counts[e], 0),
      sessions: d.visitors,
      events: { ...d.counts },
    };
  });
}

function computeSessionInsights(events: StoredEvent[]): SessionInsights | null {
  const bySession = new Map<string, Set<AnalyticsEventType>>();
  for (const e of events) {
    if (!e.sessionId) continue;
    const set = bySession.get(e.sessionId) ?? new Set();
    set.add(e.type);
    bySession.set(e.sessionId, set);
  }
  if (bySession.size === 0) return null;

  const hasProductInterest = (s: Set<AnalyticsEventType>) =>
    s.has("product_view") || s.has("product_click");
  const hasCheckout = (s: Set<AnalyticsEventType>) =>
    s.has("begin_checkout") || s.has("checkout_start");

  let browsedNoAdd = 0;
  let addedNoCheckout = 0;
  let checkoutNoPay = 0;
  let clickedPay = 0;
  let reachedAdd = 0;
  let reachedCart = 0;
  let reachedCheckout = 0;

  for (const steps of bySession.values()) {
    if (steps.has("add_to_cart")) reachedAdd++;
    if (steps.has("view_cart")) reachedCart++;
    if (hasCheckout(steps)) reachedCheckout++;
    if (steps.has("checkout_start")) clickedPay++;

    if (hasProductInterest(steps) && !steps.has("add_to_cart")) browsedNoAdd++;
    if (steps.has("add_to_cart") && !hasCheckout(steps)) addedNoCheckout++;
    if (steps.has("begin_checkout") && !steps.has("checkout_start")) {
      checkoutNoPay++;
    }
  }

  return {
    totalSessions: bySession.size,
    browsedNoAdd,
    addedNoCheckout,
    checkoutNoPay,
    clickedPay,
    reachedAdd,
    reachedCart,
    reachedCheckout,
  };
}

function eventsInWindow(
  events: StoredEvent[],
  opts: { cutoffMs?: number; dayList?: string[] },
): StoredEvent[] {
  const daySet = opts.dayList ? new Set(opts.dayList) : null;
  return events.filter((row) => {
    if (opts.cutoffMs != null && row.at < opts.cutoffMs) return false;
    if (daySet) {
      const { date } = formatTorontoDateTime(row.at);
      if (!daySet.has(date)) return false;
    }
    return true;
  });
}

function eventToActivity(row: StoredEvent): RecentActivity {
  const { date, time } = formatTorontoDateTime(row.at);
  return {
    at: row.at,
    date,
    time,
    type: row.type,
    detail: recentDetail(row.type, row.productId, row.path),
  };
}

function aggregateRollingEvents(
  events: StoredEvent[],
  range: AnalyticsRange,
  axisStartMs: number,
  axisEndMs: number,
): Pick<
  AnalyticsSummary,
  | "totals"
  | "topProducts"
  | "hourlyByDay"
  | "peakHours"
  | "recentActivity"
  | "visitors"
  | "days"
  | "timeline"
  | "eventLog"
  | "sessionInsights"
> {
  const totals = emptyTotals();
  const sessions = new Set<string>();
  const productAcc = new Map<string, { views: number; adds: number }>();
  const hourMap = new Map<
    string,
    { date: string; hour: number; label: string; sessions: Set<string>; counts: Record<AnalyticsEventType, number> }
  >();
  const peakAcc = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: formatHourLabel(hour),
    pageViews: 0,
    adds: 0,
    checkouts: 0,
    purchases: 0,
    total: 0,
  }));

  const useMinuteBuckets = range === "30m" || range === "1h";

  for (const row of events) {
    totals[row.type] += 1;
    if (row.sessionId) sessions.add(row.sessionId);

    if (row.productId) {
      if (row.type === "add_to_cart") {
        mergeProductHash(productAcc, row.productId, "adds", 1);
      } else if (
        row.type === "product_view" ||
        row.type === "product_click"
      ) {
        mergeProductHash(productAcc, row.productId, "views", 1);
      }
    }

    const { date, time } = formatTorontoDateTime(row.at);
    const hour = Number.parseInt(time.slice(0, 2), 10);
    const bucketKey = useMinuteBuckets
      ? `${date} ${time.slice(0, 5)}`
      : `${date}-${hour}`;
    const bucketLabel = useMinuteBuckets ? time.slice(0, 5) : formatHourLabel(hour);

    let slot = hourMap.get(bucketKey);
    if (!slot) {
      slot = {
        date,
        hour,
        label: bucketLabel,
        sessions: new Set(),
        counts: emptyTotals(),
      };
      hourMap.set(bucketKey, slot);
    }
    slot.counts[row.type] += 1;
    if (row.sessionId) slot.sessions.add(row.sessionId);

    const ph = peakAcc[hour]!;
    ph.total += 1;
    if (row.type === "page_view") ph.pageViews += 1;
    if (row.type === "add_to_cart") ph.adds += 1;
    if (row.type === "begin_checkout" || row.type === "checkout_start") {
      ph.checkouts += 1;
    }
    if (row.type === "purchase") ph.purchases += 1;
  }

  const byDate = new Map<string, HourSlot[]>();
  for (const slot of hourMap.values()) {
    const list = byDate.get(slot.date) ?? [];
    list.push({
      hour: slot.hour,
      label: slot.label,
      sessions: slot.sessions.size,
      counts: slot.counts,
    });
    byDate.set(slot.date, list);
  }

  const hourlyByDay: DayHourly[] = [...byDate.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, hours]) => ({
      date,
      hours: hours.sort((a, b) => a.label.localeCompare(b.label)),
    }));

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

  const days: DayFunnel[] = [
    {
      date: "Selected window",
      visitors: sessions.size,
      counts: totals,
    },
  ];

  const timeline = buildTimelineFromEvents(
    events,
    range,
    axisStartMs,
    axisEndMs,
  );
  const eventLog = [...events]
    .sort((a, b) => b.at - a.at)
    .map(eventToLogEntry);
  const sessionInsights = computeSessionInsights(events);

  return {
    totals,
    visitors: sessions.size,
    days,
    topProducts,
    hourlyByDay,
    peakHours,
    recentActivity: eventLog.slice(0, 50),
    timeline,
    eventLog,
    sessionInsights,
  };
}

async function readRecentActivity(
  kv: Awaited<ReturnType<typeof getKv>>,
  opts: { limit?: number; dayList?: string[]; cutoffMs?: number } = {},
): Promise<RecentActivity[]> {
  const { limit = 40, dayList, cutoffMs } = opts;
  const events = await readAllRecentEvents(kv);
  const daySet = dayList ? new Set(dayList) : null;

  const filtered = events.filter((row) => {
    if (cutoffMs != null && row.at < cutoffMs) return false;
    if (daySet) {
      const { date } = formatTorontoDateTime(row.at);
      if (!daySet.has(date)) return false;
    }
    return true;
  });

  return filtered.slice(0, limit).map(eventToActivity);
}

async function getCalendarSummary(
  kv: Awaited<ReturnType<typeof getKv>>,
  days: number,
  range: AnalyticsRange,
  trackingSinceMs: number,
): Promise<
  Pick<
    AnalyticsSummary,
    | "days"
    | "totals"
    | "topProducts"
    | "hourlyByDay"
    | "peakHours"
    | "recentActivity"
    | "visitors"
    | "timeline"
    | "eventLog"
    | "sessionInsights"
  >
> {
  const trackingStartDate = formatTorontoDateTime(trackingSinceMs).date;
  const dayList = datesBack(days).filter((d) => d >= trackingStartDate);
  const allEvents = await readAllRecentEvents(kv);
  const rangedEvents = eventsInWindow(allEvents, {
    cutoffMs: trackingSinceMs,
    dayList,
  });

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
  const totals = emptyTotals();
  const productAcc = new Map<string, { views: number; adds: number }>();

  for (const day of dayList) {
    const row =
      day === trackingStartDate
        ? dayFunnelFromEvents(day, rangedEvents)
        : await readDay(kv, day);
    funnelDays.push(row);
    const hours = await readDayHours(kv, day);
    if (day === trackingStartDate) {
      const startHour = Number.parseInt(
        formatTorontoDateTime(trackingSinceMs).time.slice(0, 2),
        10,
      );
      hourlyByDay.push({
        date: day,
        hours: hours.filter((slot) => slot.hour >= startHour),
      });
    } else {
      hourlyByDay.push({ date: day, hours });
    }

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

  const visitors = funnelDays.reduce((s, d) => s + d.visitors, 0);
  const timeline = buildTimelineFromDays(funnelDays, range);
  const eventLog = rangedEvents
    .sort((a, b) => b.at - a.at)
    .map(eventToLogEntry);
  const sessionInsights = computeSessionInsights(rangedEvents);

  return {
    days: funnelDays,
    totals,
    visitors,
    topProducts,
    hourlyByDay,
    peakHours,
    recentActivity: eventLog.slice(0, 50),
    timeline,
    eventLog,
    sessionInsights,
  };
}

/** Admin dashboard for a selected time window (Toronto ET). */
export type AnalyticsSummaryOptions = {
  /** Omit geo points near this location (e.g. hide the admin viewer's IP). */
  excludeGeoNear?: VisitorGeo | null;
};

export async function getAnalyticsSummary(
  range: AnalyticsRange = "7d",
  options: AnalyticsSummaryOptions = {},
): Promise<AnalyticsSummary> {
  const kv = await getKv();
  const now = formatTorontoDateTime(Date.now());
  const { ms: trackingSinceMs, label: trackingSinceLabel } =
    resolveAnalyticsTrackingSince();
  const nowMs = Date.now();
  const { windowStartMs, windowEndMs, clamped: windowClampedToTracking } =
    resolveEffectiveWindow(range, trackingSinceMs, nowMs);
  const timelineWindow = resolveRequestedTimelineWindow(range, nowMs);
  const windowUnifiedToTracking = windowClampedToTracking;
  const rangeLabel = windowClampedToTracking
    ? `Since ${trackingSinceLabel} ET`
    : analyticsRangeLabel(range);

  const useEventWindow =
    windowClampedToTracking || analyticsRangeMs(range) != null;

  if (useEventWindow) {
    const all = await readAllRecentEvents(kv);
    const filtered = all.filter(
      (e) => e.at >= windowStartMs && e.at < windowEndMs,
    );
    const rolled = aggregateRollingEvents(
      filtered,
      range,
      timelineWindow.startMs,
      timelineWindow.endMs,
    );
    const visitorGeo = await readVisitorGeoInWindow(
      kv,
      windowStartMs,
      windowEndMs,
      options.excludeGeoNear,
    );
    return {
      range,
      rangeLabel,
      trackingSinceLabel,
      trackingActive: true,
      windowClampedToTracking,
      windowUnifiedToTracking,
      ...rolled,
      visitorGeo,
      nowToronto: `${now.date} ${now.time} ET`,
    };
  }

  const cal = await getCalendarSummary(
    kv,
    RANGE_DAYS[range],
    range,
    trackingSinceMs,
  );
  const calWindowStart = torontoDayStartMs(
    datesBack(RANGE_DAYS[range]).at(-1) ?? dateKey(),
  );
  const visitorGeo = await readVisitorGeoInWindow(
    kv,
    calWindowStart,
    nowMs,
    options.excludeGeoNear,
  );
  return {
    range,
    rangeLabel,
    trackingSinceLabel,
    trackingActive: true,
    windowClampedToTracking: false,
    windowUnifiedToTracking: false,
    ...cal,
    visitorGeo,
    nowToronto: `${now.date} ${now.time} ET`,
  };
}

/** Remove all stored visitor map points (geo zset + per-session keys). */
export async function clearAllVisitorGeo(): Promise<{
  removed: number;
  sessionKeysDeleted: number;
}> {
  if (!isStorageConfigured()) {
    return { removed: 0, sessionKeysDeleted: 0 };
  }

  const kv = await getKv();
  const rows = await kv.zrangeWithScores(GEO_RECENT_KEY, 0, -1);
  let removed = 0;
  let sessionKeysDeleted = 0;

  for (const { member } of rows) {
    try {
      const row = JSON.parse(member) as VisitorGeoPoint;
      await zremMember(GEO_RECENT_KEY, member);
      removed += 1;
      if (row.sessionId) {
        await deleteKeys(sessionGeoKey(row.sessionId));
        sessionKeysDeleted += 1;
      }
    } catch {
      await zremMember(GEO_RECENT_KEY, member);
      removed += 1;
    }
  }

  return { removed, sessionKeysDeleted };
}

/** Remove map points within radiusM of a location (e.g. your current IP). */
export async function purgeVisitorGeoNear(
  center: { lat: number; lng: number },
  radiusM = 2_500,
): Promise<{ removed: number; sessionKeysDeleted: number }> {
  if (!isStorageConfigured()) {
    return { removed: 0, sessionKeysDeleted: 0 };
  }

  const kv = await getKv();
  const rows = await kv.zrangeWithScores(GEO_RECENT_KEY, 0, -1);
  let removed = 0;
  let sessionKeysDeleted = 0;

  for (const { member } of rows) {
    try {
      const row = JSON.parse(member) as VisitorGeoPoint;
      if (!Number.isFinite(row.lat) || !Number.isFinite(row.lng)) continue;
      if (geoDistanceMeters(row, center) > radiusM) continue;
      await zremMember(GEO_RECENT_KEY, member);
      removed += 1;
      if (row.sessionId) {
        await deleteKeys(sessionGeoKey(row.sessionId));
        sessionKeysDeleted += 1;
      }
    } catch {
      // skip malformed
    }
  }

  return { removed, sessionKeysDeleted };
}

export function funnelRate(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

/** Time window options for admin Insights (client-safe — no Redis imports). */
export type AnalyticsRange = "30m" | "1h" | "6h" | "24h" | "7d";

export const ANALYTICS_RANGE_OPTIONS: {
  id: AnalyticsRange;
  label: string;
}[] = [
  { id: "30m", label: "Last 30 minutes" },
  { id: "1h", label: "Last 1 hour" },
  { id: "6h", label: "Last 6 hours" },
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
];

const RANGE_MS: Record<AnalyticsRange, number | null> = {
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": null,
};

export const RANGE_DAYS: Record<AnalyticsRange, number> = {
  "30m": 1,
  "1h": 1,
  "6h": 1,
  "24h": 2,
  "7d": 7,
};

export function parseAnalyticsRange(raw?: string): AnalyticsRange {
  if (raw && raw in RANGE_MS) return raw as AnalyticsRange;
  return "7d";
}

export function analyticsRangeLabel(range: AnalyticsRange): string {
  return ANALYTICS_RANGE_OPTIONS.find((o) => o.id === range)?.label ?? range;
}

export function analyticsRangeMs(range: AnalyticsRange): number | null {
  return RANGE_MS[range];
}

export function isRollingAnalyticsRange(range: AnalyticsRange): boolean {
  return RANGE_MS[range] != null;
}

/** Target number of timeline bars for each range (metrics over time). */
export function timelineBucketCount(range: AnalyticsRange): number {
  switch (range) {
    case "30m":
      return 6;
    case "1h":
      return 12;
    case "6h":
      return 12;
    case "24h":
      return 24;
    case "7d":
      return 7;
    default:
      return 12;
  }
}

/** When the per-event log went live (Toronto). Override with ANALYTICS_TRACKING_SINCE. */
export const ANALYTICS_TRACKING_SINCE_DEFAULT_MS = Date.parse(
  "2026-06-01T17:45:00-04:00",
);

/** Optional override for when per-event tracking started (ISO 8601). */
export function analyticsTrackingSinceFromEnv(): number | null {
  const raw = process.env.ANALYTICS_TRACKING_SINCE?.trim();
  if (!raw) return null;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : null;
}

export function getAnalyticsTrackingSinceMs(): number {
  return analyticsTrackingSinceFromEnv() ?? ANALYTICS_TRACKING_SINCE_DEFAULT_MS;
}

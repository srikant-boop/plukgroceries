/** Time window options for admin Insights (client-safe — no Redis imports). */
export type AnalyticsRange = "30m" | "1h" | "6h" | "24h" | "7d" | "30d";

export const ANALYTICS_RANGE_OPTIONS: {
  id: AnalyticsRange;
  label: string;
}[] = [
  { id: "30m", label: "Last 30 minutes" },
  { id: "1h", label: "Last 1 hour" },
  { id: "6h", label: "Last 6 hours" },
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const RANGE_MS: Record<AnalyticsRange, number | null> = {
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": null,
  "30d": null,
};

export const RANGE_DAYS: Record<AnalyticsRange, number> = {
  "30m": 1,
  "1h": 1,
  "6h": 1,
  "24h": 2,
  "7d": 7,
  "30d": 30,
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

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRange,
} from "@/lib/analytics-ranges";

export function AnalyticsRangeSelect({ current }: { current: AnalyticsRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted whitespace-nowrap">Time range</span>
      <select
        className="border border-line bg-background px-3 py-1.5 text-sm rounded-none"
        value={current}
        onChange={(e) => {
          const next = e.target.value as AnalyticsRange;
          const params = new URLSearchParams(searchParams.toString());
          if (next === "7d") {
            params.delete("range");
          } else {
            params.set("range", next);
          }
          const q = params.toString();
          router.push(q ? `/admin/analytics?${q}` : "/admin/analytics");
        }}
      >
        {ANALYTICS_RANGE_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

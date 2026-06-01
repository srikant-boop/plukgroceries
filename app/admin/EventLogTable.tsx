import type { EventLogEntry } from "@/lib/analytics";

const TYPE_LABELS: Record<EventLogEntry["type"], string> = {
  page_view: "Page view",
  product_click: "Product click",
  product_view: "Product view",
  add_to_cart: "Add to cart",
  view_cart: "Cart viewed",
  begin_checkout: "Checkout opened",
  checkout_start: "Pay clicked",
  purchase: "Order paid",
};

function shortSession(id?: string): string {
  if (!id) return "—";
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export function EventLogTable({
  events,
  totalInRange,
}: {
  events: EventLogEntry[];
  totalInRange: number;
}) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted border border-line p-4">
        No events logged in this range yet.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted mb-3">
        {events.length === totalInRange
          ? `${events.length} events in range (newest first).`
          : `Showing ${events.length} of ${totalInRange} events in range (newest first).`}
        {" "}Session IDs are anonymous browser tokens, not customer names.
      </p>
      <div className="border border-line overflow-x-auto max-h-[28rem] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b border-line text-left text-muted">
              <th className="p-2 font-normal whitespace-nowrap">Date</th>
              <th className="p-2 font-normal whitespace-nowrap">Time (ET)</th>
              <th className="p-2 font-normal">Event</th>
              <th className="p-2 font-normal whitespace-nowrap">Session</th>
              <th className="p-2 font-normal">Detail</th>
            </tr>
          </thead>
          <tbody>
            {events.map((row) => (
              <tr
                key={`${row.at}-${row.type}-${row.sessionId ?? ""}-${row.detail}`}
                className="border-b border-line/60 hover:bg-surface/80"
              >
                <td className="p-2 tabular-nums whitespace-nowrap">{row.date}</td>
                <td className="p-2 tabular-nums whitespace-nowrap">{row.time}</td>
                <td className="p-2 whitespace-nowrap">{TYPE_LABELS[row.type]}</td>
                <td
                  className="p-2 font-mono text-[10px] text-muted whitespace-nowrap"
                  title={row.sessionId}
                >
                  {shortSession(row.sessionId)}
                </td>
                <td className="p-2">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

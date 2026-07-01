import { randomUUID } from "crypto";
import { buildGroupBuyProgress } from "./group-buy-config";
import { getReservedQuantities } from "./group-buy";
import { getKv } from "./kv";
import type { Order } from "./orders";
import type {
  GroupBuyActivityEvent,
  GroupBuyActivityLine,
} from "./group-buy-activity-types";

export type {
  GroupBuyActivityEvent,
  GroupBuyActivityLine,
} from "./group-buy-activity-types";
export { formatActivityHeadline } from "./group-buy-activity-types";

const ACTIVITY_ZSET = "pluk:group-buy:activity";
const ACTIVITY_PAYLOAD = (id: string) => `pluk:group-buy:activity:${id}`;
const ACTIVITY_MAX = 100;
const PAYLOAD_TTL_SEC = 7 * 24 * 60 * 60;

function activityLabel(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  if (!first) return "Someone nearby";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/** Publish a reservation to the live feed (after order is saved). */
export async function recordGroupBuyReservation(order: Order): Promise<void> {
  try {
    const reserved = await getReservedQuantities();
    const lines: GroupBuyActivityLine[] = order.lines.map((line) => {
      const total = reserved[line.productId] ?? line.qty;
      const progress = buildGroupBuyProgress(line.productId, total);
      return {
        productId: line.productId,
        name: line.name,
        qty: line.qty,
        reserved: progress.reserved,
        target: progress.target,
        filled: progress.filled,
      };
    });

    const event: GroupBuyActivityEvent = {
      id: `evt-${randomUUID()}`,
      at: Date.now(),
      orderId: order.id,
      label: activityLabel(order.customer.name),
      lines,
    };

    const kv = await getKv();
    await kv.set(ACTIVITY_PAYLOAD(event.id), JSON.stringify(event));
    await kv.expire(ACTIVITY_PAYLOAD(event.id), PAYLOAD_TTL_SEC);
    await kv.zadd(ACTIVITY_ZSET, event.at, event.id);

    const count = await kv.zcard(ACTIVITY_ZSET);
    if (count > ACTIVITY_MAX) {
      await kv.zremrangebyrank(ACTIVITY_ZSET, 0, count - ACTIVITY_MAX - 1);
    }
  } catch (err) {
    console.error("[group-buy-activity] record failed", err);
  }
}

export async function listGroupBuyActivitySince(
  since: number,
  limit = 15,
): Promise<GroupBuyActivityEvent[]> {
  try {
    const kv = await getKv();
    const rows = await kv.zrangeWithScores(ACTIVITY_ZSET, 0, -1);
    const ids = rows
      .filter((row) => row.score > since)
      .slice(-limit)
      .map((row) => row.member);

    if (ids.length === 0) return [];

    const payloads = await kv.mget(ids.map((id) => ACTIVITY_PAYLOAD(id)));
    const events: GroupBuyActivityEvent[] = [];
    for (const raw of payloads) {
      if (!raw) continue;
      try {
        events.push(JSON.parse(raw) as GroupBuyActivityEvent);
      } catch {
        /* skip corrupt payload */
      }
    }
    return events.sort((a, b) => a.at - b.at);
  } catch {
    return [];
  }
}

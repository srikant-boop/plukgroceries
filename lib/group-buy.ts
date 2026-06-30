import { listOrders } from "./orders";
import { CURATED_SHELF_IDS } from "./staple-shelf";
import {
  buildGroupBuyProgress,
  type GroupBuyProgress,
} from "./group-buy-config";

export type { GroupBuyProgress } from "./group-buy-config";
export {
  GROUP_BUY_TARGETS,
  DEFAULT_GROUP_BUY_TARGET,
  getGroupBuyTarget,
  buildGroupBuyProgress,
} from "./group-buy-config";

/** Sum reserved qty across all saved orders (current preorder round). */
export async function getReservedQuantities(): Promise<Record<string, number>> {
  try {
    const orders = await listOrders(500);
    const counts: Record<string, number> = {};

    for (const order of orders) {
      for (const line of order.lines) {
        counts[line.productId] = (counts[line.productId] ?? 0) + line.qty;
      }
    }

    return counts;
  } catch {
    return {};
  }
}

export async function getGroupBuyProgressForShelf(): Promise<GroupBuyProgress[]> {
  const reserved = await getReservedQuantities();
  return CURATED_SHELF_IDS.map((id) =>
    buildGroupBuyProgress(id, reserved[id] ?? 0),
  );
}

export async function getGroupBuyProgressMap(): Promise<
  Record<string, GroupBuyProgress>
> {
  const list = await getGroupBuyProgressForShelf();
  return Object.fromEntries(list.map((p) => [p.productId, p]));
}

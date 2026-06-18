import { randomUUID } from "crypto";
import {
  orderLineTotals,
  saveOrder,
  snapshotOrderLine,
  type Order,
} from "./orders";
import type { Product } from "./products";
import type { PaymentMethod } from "./checkout-api";

export function buildCheckoutOrder(input: {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
    deliveryAddress?: string;
  };
  pickupSpotId: string;
  paymentMethod: PaymentMethod;
  lines: Array<{ product: Product; qty: number }>;
  paid: boolean;
  inviteRef?: string;
}): Order {
  const catalogSnapshotAt = new Date().toISOString();
  const lines = input.lines.map((l) =>
    snapshotOrderLine(l.product, l.qty, catalogSnapshotAt),
  );
  const { subtotal, totalWholesaleCost, totalMargin } = orderLineTotals(lines);

  return {
    id: input.id,
    createdAt: Date.now(),
    customer: input.customer,
    pickupSpotId: input.pickupSpotId,
    paymentMethod: input.paymentMethod,
    lines,
    subtotal,
    total: subtotal,
    totalWholesaleCost,
    totalMargin,
    catalogSnapshotAt,
    paid: input.paid,
    fulfilled: false,
    ...(input.inviteRef ? { inviteRef: input.inviteRef } : {}),
  };
}

export async function saveManualCheckoutOrder(
  input: Omit<Parameters<typeof buildCheckoutOrder>[0], "id" | "paid">,
): Promise<string> {
  const id = `manual-${randomUUID()}`;
  const order = buildCheckoutOrder({ ...input, id, paid: false });
  await saveOrder(order);
  return id;
}

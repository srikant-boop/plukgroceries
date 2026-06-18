import { Resend } from "resend";
import type { Order } from "./orders";
import { orderLineSubtotal } from "./order-snapshot";
import { getPickupSpot, HOME_DELIVERY_ID } from "./pickup";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  _resend = new Resend(key);
  return _resend;
}

const money = (n: number) => `$${n.toFixed(2)}`;

export async function sendOrderEmail(order: Order): Promise<void> {
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  // Resend's onboarding sender works for any inbox without domain verification;
  // upgrade to a domain sender (orders@pluk.ca etc.) once you verify a domain.
  const from = process.env.RESEND_FROM_EMAIL ?? "Pluk <onboarding@resend.dev>";
  if (!to) throw new Error("ORDER_NOTIFICATION_EMAIL not set");

  const spot = getPickupSpot(order.pickupSpotId);
  const isDelivery = order.pickupSpotId === HOME_DELIVERY_ID;
  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on delivery"
      : order.paymentMethod === "etransfer"
        ? "E-transfer"
        : order.paid
          ? "Paid via card (Stripe)"
          : "Card (pending)";
  const lines = order.lines
    .map(
      (l) =>
        `<tr><td>${l.qty}× ${escape(l.name)} <span style="color:#6b6b66">(${escape(l.sku ?? l.productId)}${l.productUuid ? ` · ${escape(l.productUuid)}` : ""})</span></td><td>${escape(l.unit)}</td><td style="text-align:right;font-variant-numeric:tabular-nums">${money(orderLineSubtotal(l))}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Arial;color:#1a1a1a;max-width:560px">
      <h2 style="font-family:ui-serif,Georgia;font-weight:400;margin-bottom:0">New Pluk order</h2>
      <p style="color:#6b6b66;margin-top:4px">${paymentLabel} · ${new Date(order.createdAt).toLocaleString("en-CA", { timeZone: "America/Toronto" })}</p>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Customer</h3>
      <p>
        <strong>${escape(order.customer.name)}</strong><br>
        ${escape(order.customer.phone)}<br>
        ${order.customer.email ? escape(order.customer.email) : ""}
      </p>
      ${order.customer.notes ? `<p><em>Notes:</em> ${escape(order.customer.notes)}</p>` : ""}

      ${order.customer.deliveryAddress ? `<p><strong>Delivery address:</strong><br>${escape(order.customer.deliveryAddress)}</p>` : ""}

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">${isDelivery ? "Delivery" : "Pickup"}</h3>
      <p>
        ${
          isDelivery
            ? "<strong>Home delivery</strong> — Oakville"
            : `<strong>${escape(spot?.name ?? order.pickupSpotId)}</strong><br>
        ${escape(spot?.address ?? "")} · ${escape(spot?.postal ?? "")}<br>
        <span style="color:#2f3a2a">${escape(spot?.slot ?? "")}</span>`
        }
      </p>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${lines}
        <tr><td colspan="2" style="border-top:1px solid #e6e2d8;padding-top:8px"><strong>Total</strong></td>
            <td style="border-top:1px solid #e6e2d8;padding-top:8px;text-align:right;font-variant-numeric:tabular-nums"><strong>${money(order.total)}</strong></td></tr>
      </table>
      ${
        order.totalMargin != null && order.totalMargin > 0
          ? `<p style="font-size:12px;color:#6b6b66;margin-top:8px">Internal: wholesale ${money(order.totalWholesaleCost ?? 0)} · margin ${money(order.totalMargin)}</p>`
          : ""
      }

      <p style="margin-top:24px"><a href="https://plukgroceries.vercel.app/admin">Open in admin →</a></p>
    </div>
  `;

  await getResend().emails.send({
    from,
    to,
    subject: `New Pluk order — ${order.customer.name} (${money(order.total)})`,
    html,
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

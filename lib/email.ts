import { Resend } from "resend";
import type { Order } from "./orders";
import { orderLineSubtotal } from "./order-snapshot";
import { SITE_URL, WHATSAPP_GROUP_URL } from "./site";

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

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on delivery (when confirmed)"
      : order.paymentMethod === "etransfer"
        ? "E-transfer (when confirmed)"
        : order.paid
          ? "Paid via card (Stripe)"
          : "Reservation — unpaid";
  const lines = order.lines
    .map(
      (l) =>
        `<tr><td>${l.qty}× ${escape(l.name)} <span style="color:#6b6b66">(${escape(l.sku ?? l.productId)}${l.productUuid ? ` · ${escape(l.productUuid)}` : ""})</span></td><td>${escape(l.unit)}</td><td style="text-align:right;font-variant-numeric:tabular-nums">${money(orderLineSubtotal(l))}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Arial;color:#1a1a1a;max-width:560px">
      <h2 style="font-family:ui-serif,Georgia;font-weight:400;margin-bottom:0">New Pluk reservation</h2>
      <p style="color:#6b6b66;margin-top:4px">${paymentLabel} · ${new Date(order.createdAt).toLocaleString("en-CA", { timeZone: "America/Toronto" })}</p>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Customer</h3>
      <p>
        <strong>${escape(order.customer.name)}</strong><br>
        ${escape(order.customer.phone)}<br>
        ${order.customer.email ? escape(order.customer.email) : ""}
      </p>
      ${order.customer.notes ? `<p><em>Notes:</em> ${escape(order.customer.notes)}</p>` : ""}

      ${order.customer.deliveryAddress ? `<p><strong>Delivery address:</strong><br>${escape(order.customer.deliveryAddress)}</p>` : ""}

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Home delivery</h3>
      <p>
        <strong>Oakville</strong><br>
        ${order.customer.deliveryAddress ? escape(order.customer.deliveryAddress) : "Address on file"}
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
    subject: `New Pluk reservation — ${order.customer.name} (${money(order.total)})`,
    html,
  });
}

function isValidCustomerEmail(email: string | undefined): email is string {
  const trimmed = email?.trim() ?? "";
  return trimmed.length > 0 && trimmed.includes("@");
}

export async function sendCustomerReservationEmail(order: Order): Promise<void> {
  if (!isValidCustomerEmail(order.customer.email)) return;

  const from = process.env.RESEND_FROM_EMAIL ?? "Pluk <onboarding@resend.dev>";
  const to = order.customer.email.trim();

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on delivery — pay when we bring your order"
      : "E-transfer — we will send payment details only after we confirm the preorder";

  const paymentNextStep =
    order.paymentMethod === "cod"
      ? "You chose cash on delivery — pay when we bring your order."
      : "You chose e-transfer — we will send payment details only after we confirm the preorder.";

  const lines = order.lines
    .map(
      (l) =>
        `<tr><td>${l.qty}× ${escape(l.name)}</td><td>${escape(l.unit)}</td><td style="text-align:right;font-variant-numeric:tabular-nums">${money(orderLineSubtotal(l))}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Arial;color:#1a1a1a;max-width:560px">
      <h2 style="font-family:ui-serif,Georgia;font-weight:400;margin-bottom:0">Thanks — your reservation is in.</h2>
      <p style="color:#6b6b66;margin-top:4px">
        Hi ${escape(order.customer.name)}, we received your Pluk reservation on
        ${new Date(order.createdAt).toLocaleString("en-CA", { timeZone: "America/Toronto" })}.
        You are not charged today — we will confirm with you before any payment.
      </p>

      <p style="margin-top:16px">
        We will home deliver in Oakville once the preorder is confirmed and your order arrives.
      </p>

      ${order.customer.deliveryAddress ? `<p><strong>Delivery address:</strong><br>${escape(order.customer.deliveryAddress)}</p>` : ""}

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Your items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${lines}
        <tr><td colspan="2" style="border-top:1px solid #e6e2d8;padding-top:8px"><strong>Estimated total</strong></td>
            <td style="border-top:1px solid #e6e2d8;padding-top:8px;text-align:right;font-variant-numeric:tabular-nums"><strong>${money(order.total)}</strong></td></tr>
      </table>
      <p style="font-size:12px;color:#6b6b66;margin-top:8px">Final total may adjust slightly if catalogue prices change before the preorder closes.</p>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Payment preference</h3>
      <p>${escape(paymentLabel)}</p>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">What happens next</h3>
      <ol style="padding-left:20px;line-height:1.6;font-size:14px">
        <li>We watch reservations until the preorder window closes — nothing is imported yet.</li>
        <li>If the round goes ahead, we will email or text you to confirm before any payment.</li>
        <li>${escape(paymentNextStep)}</li>
        <li>Expect delivery about 10–20 days after the preorder closes (import + customs + local prep).</li>
      </ol>

      <h3 style="font-family:ui-serif,Georgia;font-weight:400">Help bring prices down</h3>
      <p style="font-size:14px;line-height:1.6">
        More reservations mean a bigger import batch and lower prices on the next round.
        Know someone else who would want Indian staples? Share
        <a href="${SITE_URL}"> Pluk </a>
        or invite them to our
        <a href="${WHATSAPP_GROUP_URL}"> WhatsApp group </a>.
      </p>

      <p style="margin-top:24px">
        <a href="${SITE_URL}/#pantry">Back to pantry</a>
        ·
        <a href="${SITE_URL}/faq#delivery">Delivery FAQ</a>
      </p>
    </div>
  `;

  await getResend().emails.send({
    from,
    to,
    subject: `Your Pluk reservation is in — ${order.customer.name}`,
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

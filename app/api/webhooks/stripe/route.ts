import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { saveOrder, type Order, type OrderLine } from "@/lib/orders";
import { sendOrderEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing stripe-signature or STRIPE_WEBHOOK_SECRET" },
      { status: 400 },
    );
  }

  const raw = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const md = session.metadata ?? {};

  let lineSpecs: Array<{ productId: string; qty: number }> = [];
  try {
    lineSpecs = JSON.parse(md.lines ?? "[]");
  } catch {
    return NextResponse.json({ error: "Malformed lines metadata" }, { status: 400 });
  }

  const lines: OrderLine[] = [];
  for (const spec of lineSpecs) {
    const p = getProductById(spec.productId);
    if (!p) continue; // skip silently — product might have been removed
    lines.push({
      productId: p.id,
      name: p.name,
      unit: p.unit,
      qty: spec.qty,
      unitPrice: p.ourPrice,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const total = (session.amount_total ?? Math.round(subtotal * 100)) / 100;

  const order: Order = {
    id: session.id,
    createdAt: Date.now(),
    customer: {
      name: md.customerName ?? session.customer_details?.name ?? "",
      phone: md.customerPhone ?? "",
      email: session.customer_details?.email ?? undefined,
      notes: md.customerNotes || undefined,
    },
    pickupSpotId: md.pickupSpotId ?? "",
    lines,
    subtotal,
    total,
    paid: session.payment_status === "paid",
    fulfilled: false,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? undefined),
  };

  await saveOrder(order);

  try {
    await sendOrderEmail(order);
  } catch (err) {
    // Don't fail the webhook on email failure — order is already persisted.
    // Stripe will retry on non-2xx, which would double-persist.
    console.error("Order email failed", err);
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPickupSpot } from "@/lib/pickup";
import { stripeConfigError, validateCheckoutBody } from "@/lib/checkout-api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const validated = validateCheckoutBody(
    body as Parameters<typeof validateCheckoutBody>[0],
  );
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { customer, pickupSpotId, lines } = validated.value;
  const spot = getPickupSpot(pickupSpotId);
  if (!spot) {
    return NextResponse.json({ error: "Unknown pickup spot." }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "plukgroceries.vercel.app"}`;

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: lines.map(({ product, qty }) => ({
        quantity: qty,
        price_data: {
          currency: "cad",
          product_data: {
            name: product.name,
            description: product.unit,
          },
          unit_amount: Math.round(product.ourPrice * 100),
        },
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      phone_number_collection: { enabled: false },
      metadata: {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerNotes: customer.notes ?? "",
        pickupSpotId,
        lines: JSON.stringify(
          lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        ),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Couldn't start payment — try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const configMsg = stripeConfigError(err);
    if (configMsg) {
      console.error("[checkout] Stripe not configured");
      return NextResponse.json({ error: configMsg }, { status: 503 });
    }
    const stripeMsg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : null;
    console.error("[checkout]", err);
    return NextResponse.json(
      {
        error:
          stripeMsg && stripeMsg.length < 120
            ? stripeMsg
            : "Couldn't start payment — try again.",
      },
      { status: 500 },
    );
  }
}

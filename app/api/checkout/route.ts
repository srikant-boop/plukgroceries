import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { getPickupSpot } from "@/lib/pickup";

export const runtime = "nodejs";

type CheckoutBody = {
  customer: { name: string; phone: string; notes?: string };
  pickupSpotId: string;
  lines: Array<{ productId: string; qty: number }>;
};

export async function POST(req: Request) {
  const body = (await req.json()) as CheckoutBody;

  const spot = getPickupSpot(body.pickupSpotId);
  if (!spot) {
    return NextResponse.json({ error: "Unknown pickup spot" }, { status: 400 });
  }
  if (!body.customer?.name?.trim() || !body.customer?.phone?.trim()) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 },
    );
  }
  if (!body.lines?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin =
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "plukgroceries.vercel.app"}`;

  const line_items: Array<{
    quantity: number;
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
  }> = [];

  for (const l of body.lines) {
    const product = getProductById(l.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${l.productId}` },
        { status: 400 },
      );
    }
    line_items.push({
      quantity: l.qty,
      price_data: {
        currency: "cad",
        product_data: {
          name: product.name,
          description: product.unit,
        },
        unit_amount: Math.round(product.ourPrice * 100),
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    customer_creation: "always",
    phone_number_collection: { enabled: false }, // we collect it on our form
    metadata: {
      customerName: body.customer.name,
      customerPhone: body.customer.phone,
      customerNotes: body.customer.notes ?? "",
      pickupSpotId: body.pickupSpotId,
      // Pack lines into metadata so the webhook can persist without re-deriving
      lines: JSON.stringify(
        body.lines.map((l) => ({ productId: l.productId, qty: l.qty })),
      ),
    },
  });

  return NextResponse.json({ url: session.url });
}

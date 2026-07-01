import { NextResponse } from "next/server";
import { HOME_DELIVERY_ID } from "@/lib/pickup";
import { validateCheckoutBody } from "@/lib/checkout-api";
import { saveManualCheckoutOrder } from "@/lib/build-checkout-order";
import { getInviteByCode } from "@/lib/invite-store";
import { sendCustomerReservationEmail, sendOrderEmail } from "@/lib/email";
import { recordGroupBuyReservation } from "@/lib/group-buy-activity";

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

  const {
    customer,
    pickupSpotId,
    paymentMethod,
    lines,
    inviteRef: rawInviteRef,
  } = validated.value;

  if (pickupSpotId !== HOME_DELIVERY_ID) {
    return NextResponse.json({ error: "Home delivery only." }, { status: 400 });
  }

  let inviteRef: string | undefined;
  if (rawInviteRef) {
    const invite = await getInviteByCode(rawInviteRef);
    if (invite) inviteRef = invite.code;
  }

  const origin =
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "plukgroceries.vercel.app"}`;

  try {
    const orderId = await saveManualCheckoutOrder({
      customer,
      pickupSpotId,
      paymentMethod,
      lines,
      inviteRef,
    });
    try {
      const { getOrder } = await import("@/lib/orders");
      const order = await getOrder(orderId);
      if (order) {
        try {
          await recordGroupBuyReservation(order);
        } catch (err) {
          console.error("[checkout] group-buy activity failed", err);
        }
        try {
          await sendOrderEmail(order);
        } catch (err) {
          console.error("[checkout] admin reservation email failed", err);
        }
        try {
          await sendCustomerReservationEmail(order);
        } catch (err) {
          console.error("[checkout] customer reservation email failed", err);
        }
      }
    } catch (err) {
      console.error("[checkout] reservation email failed", err);
    }
    return NextResponse.json({
      url: `${origin}/checkout/success?order_id=${orderId}`,
    });
  } catch (err) {
    console.error("[checkout] reservation failed", err);
    return NextResponse.json(
      { error: "Couldn't place reservation — try again." },
      { status: 500 },
    );
  }
}

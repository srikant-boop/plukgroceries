import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getInviteByOrderId, registerInviterOrder } from "@/lib/invite-store";
import { inviteUrlForCode } from "@/lib/invite-link";
import { getOrder } from "@/lib/orders";
import { snapshotOrderLine, orderLineTotals } from "@/lib/order-snapshot";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

/** Return (or create) the inviter share link for a paid checkout session. */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id")?.trim();
  if (!sessionId?.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  try {
    let invite = await getInviteByOrderId(sessionId);
    if (!invite) {
      const existing = await getOrder(sessionId);
      if (existing?.paid) {
        const code = await registerInviterOrder(existing);
        invite = (await getInviteByOrderId(sessionId)) ?? {
          code,
          inviterOrderId: existing.id,
          inviterEmail: existing.customer.email ?? "",
          inviterName: existing.customer.name,
          createdAt: existing.createdAt,
        };
      } else {
        const session = await getStripe().checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
          return NextResponse.json({ error: "Order not paid yet." }, { status: 404 });
        }

        let lineSpecs: Array<{ productId: string; qty: number }> = [];
        try {
          lineSpecs = JSON.parse(session.metadata?.lines ?? "[]");
        } catch {
          return NextResponse.json({ error: "Malformed order." }, { status: 400 });
        }

        const catalogSnapshotAt = new Date().toISOString();
        const lines = [];
        for (const spec of lineSpecs) {
          const p = getProductById(spec.productId);
          if (!p) continue;
          lines.push(snapshotOrderLine(p, spec.qty, catalogSnapshotAt));
        }
        const { subtotal, totalWholesaleCost, totalMargin } = orderLineTotals(lines);
        const order = {
          id: session.id,
          createdAt: Date.now(),
          customer: {
            name: session.metadata?.customerName ?? session.customer_details?.name ?? "",
            phone: session.metadata?.customerPhone ?? "",
            email:
              session.metadata?.customerEmail ??
              session.customer_details?.email ??
              undefined,
            notes: session.metadata?.customerNotes || undefined,
          },
          pickupSpotId: session.metadata?.pickupSpotId ?? "",
          lines,
          subtotal,
          total: (session.amount_total ?? Math.round(subtotal * 100)) / 100,
          totalWholesaleCost,
          totalMargin,
          catalogSnapshotAt,
          paid: true,
          fulfilled: false,
        };
        const code = await registerInviterOrder(order);
        invite = (await getInviteByOrderId(sessionId)) ?? {
          code,
          inviterOrderId: order.id,
          inviterEmail: order.customer.email ?? "",
          inviterName: order.customer.name,
          createdAt: order.createdAt,
        };
      }
    }

    return NextResponse.json({
      code: invite.code,
      url: inviteUrlForCode(invite.code),
    });
  } catch (err) {
    console.error("[invite]", err);
    return NextResponse.json(
      { error: "Couldn't load invite link." },
      { status: 500 },
    );
  }
}

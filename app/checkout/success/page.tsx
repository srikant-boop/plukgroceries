import Link from "next/link";
import { getPickupSpot, HOME_DELIVERY_ID } from "@/lib/pickup";
import { getOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";

type SearchParams = Promise<{ session_id?: string; order_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId, order_id: orderId } = await searchParams;
  let spot = null;
  let deliveryAddress: string | undefined;
  let paymentMethod: "card" | "cod" | "etransfer" = "card";
  let isDelivery = true;

  if (orderId?.startsWith("manual-")) {
    const order = await getOrder(orderId);
    if (order) {
      isDelivery = order.pickupSpotId === HOME_DELIVERY_ID;
      deliveryAddress = order.customer.deliveryAddress;
      paymentMethod = order.paymentMethod ?? "cod";
      if (!isDelivery) spot = getPickupSpot(order.pickupSpotId) ?? null;
    }
  } else if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const pickupSpotId = session.metadata?.pickupSpotId;
      deliveryAddress = session.metadata?.deliveryAddress || undefined;
      isDelivery = pickupSpotId === HOME_DELIVERY_ID;
      if (pickupSpotId && !isDelivery) {
        spot = getPickupSpot(pickupSpotId) ?? null;
      }
    } catch {
      // Invalid or expired session — show generic copy below.
    }
  }

  return (
    <div className="py-16 max-w-xl mx-auto text-center">
      <ClearCartOnSuccess />

      <h1 className="text-4xl mb-4">Thanks — your order is confirmed.</h1>
      <p className="text-muted text-lg mb-8 leading-relaxed">
        {isDelivery
          ? "We will home deliver your order in Oakville."
          : spot
            ? "We'll see you at your pickup spot below."
            : "We'll be in touch about delivery."}
      </p>

      {isDelivery && deliveryAddress && (
        <div className="border border-line bg-surface p-6 text-left mb-8">
          <p className="eyebrow mb-2">Delivery address</p>
          <p className="text-sm leading-relaxed">{deliveryAddress}</p>
        </div>
      )}

      {spot && (
        <div className="border border-line bg-surface p-6 text-left mb-8">
          <p className="eyebrow mb-2">Your pickup</p>
          <p className="font-medium text-lg">{spot.name}</p>
          <p className="text-sm text-muted mt-1">
            {spot.address}
            <br />
            {spot.postal}
          </p>
          <p className="text-sm text-accent mt-3">{spot.slot}</p>
          <a
            href={spot.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm underline underline-offset-2 mt-3 text-foreground"
          >
            Open in Maps
          </a>
        </div>
      )}

      <div className="border border-line p-6 text-left mb-10">
        <p className="eyebrow mb-3">What happens next</p>
        <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 list-decimal pl-5">
          <li>We pack your pantry order before delivery or pickup.</li>
          {paymentMethod === "card" ? (
            <li>Your card payment is confirmed — no further payment step.</li>
          ) : paymentMethod === "cod" ? (
            <li>
              Pay with cash when we deliver
              {spot ? " or at pickup" : ""} — we will confirm timing by text or
              email.
            </li>
          ) : (
            <li>
              We will message you with e-transfer details before we deliver.
            </li>
          )}
          {isDelivery ? (
            <li>We will bring your order to the address you provided.</li>
          ) : spot ? (
            <li>
              Bring your phone — we&apos;ll match you at{" "}
              <span className="text-foreground font-medium">{spot.name}</span>.
            </li>
          ) : null}
        </ol>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/#pantry" className="btn">
          Back to pantry
        </Link>
        <Link href="/about#faq" className="btn btn-ghost">
          Common questions
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
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
  let deliveryAddress: string | undefined;
  let paymentMethod: "card" | "cod" | "etransfer" = "card";

  if (orderId?.startsWith("manual-")) {
    const order = await getOrder(orderId);
    if (order) {
      deliveryAddress = order.customer.deliveryAddress;
      paymentMethod = order.paymentMethod ?? "cod";
    }
  } else if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      deliveryAddress = session.metadata?.deliveryAddress || undefined;
    } catch {
      // Invalid or expired session — show generic copy below.
    }
  }

  return (
    <div className="py-16 max-w-xl mx-auto text-center">
      <ClearCartOnSuccess />

      <h1 className="text-4xl mb-4">Thanks — your order is confirmed.</h1>
      <p className="text-muted text-lg mb-8 leading-relaxed">
        We will home deliver your order in Oakville.
      </p>

      {deliveryAddress && (
        <div className="border border-line bg-surface p-6 text-left mb-8">
          <p className="eyebrow mb-2">Delivery address</p>
          <p className="text-sm leading-relaxed">{deliveryAddress}</p>
        </div>
      )}

      <div className="border border-line p-6 text-left mb-10">
        <p className="eyebrow mb-3">What happens next</p>
        <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 list-decimal pl-5">
          <li>We pack your pantry order before delivery.</li>
          {paymentMethod === "card" ? (
            <li>Your card payment is confirmed — no further payment step.</li>
          ) : paymentMethod === "cod" ? (
            <li>
              Pay with cash when we deliver — we will confirm timing by text or
              email.
            </li>
          ) : (
            <li>
              We will message you with e-transfer details before we deliver.
            </li>
          )}
          <li>We will bring your order to the address you provided.</li>
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

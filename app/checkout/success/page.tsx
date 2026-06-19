import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";

type SearchParams = Promise<{ session_id?: string; order_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order_id: orderId } = await searchParams;
  let deliveryAddress: string | undefined;
  let paymentMethod: "cod" | "etransfer" = "etransfer";

  if (orderId?.startsWith("manual-")) {
    const order = await getOrder(orderId);
    if (order) {
      deliveryAddress = order.customer.deliveryAddress;
      paymentMethod =
        order.paymentMethod === "cod" ? "cod" : "etransfer";
    }
  }

  return (
    <div className="py-16 max-w-xl mx-auto text-center">
      <ClearCartOnSuccess />

      <h1 className="text-4xl mb-4">Thanks — your reservation is in.</h1>
      <p className="text-muted text-lg mb-8 leading-relaxed">
        We will home deliver in Oakville once the preorder is confirmed and your
        order arrives.
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
          <li>
            We watch reservations until the preorder window closes — nothing is
            imported yet.
          </li>
          <li>
            If the round goes ahead, we will email or text you to confirm before
            any payment.
          </li>
          {paymentMethod === "cod" ? (
            <li>
              You chose cash on delivery — pay when we bring your order.
            </li>
          ) : (
            <li>
              You chose e-transfer — we will send payment details only after we
              confirm the preorder.
            </li>
          )}
          <li>
            Expect delivery about 10–20 days after the preorder closes (import +
            customs + local prep).
          </li>
        </ol>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/#pantry" className="btn">
          Back to pantry
        </Link>
        <Link href="/faq#delivery" className="btn btn-ghost">
          FAQ
        </Link>
      </div>
    </div>
  );
}

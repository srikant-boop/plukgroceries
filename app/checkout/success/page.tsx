"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { pickupSpots } from "@/lib/pickup";

export default function CheckoutSuccessPage() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="py-16 max-w-xl mx-auto text-center">
      <h1 className="text-4xl mb-4">Thanks — you&apos;re in the next drop.</h1>
      <p className="text-muted text-lg mb-8 leading-relaxed">
        Your payment went through. We&apos;ll text you a confirmation with the
        exact pickup time and answer any swap requests in your notes.
      </p>

      <div className="border border-line p-6 text-left mb-10">
        <p className="eyebrow mb-3">What happens next</p>
        <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 list-decimal pl-5">
          <li>
            We pack your order the morning of the drop, kept cold until pickup.
          </li>
          <li>
            Bring ID or your phone — we&apos;ll match you against the day&apos;s
            list at the pickup spot:
            <ul className="mt-2 ml-4 space-y-1 text-muted list-disc">
              {pickupSpots.map((s) => (
                <li key={s.id}>
                  <span className="text-foreground">{s.name}</span> · {s.slot}
                </li>
              ))}
            </ul>
          </li>
          <li>
            If anything is damaged or low quality, text us a photo — we refund
            or replace at the next drop.
          </li>
        </ol>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/" className="btn">
          Back to shop
        </Link>
        <Link href="/faq" className="btn btn-ghost">
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}

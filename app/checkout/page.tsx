"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart, hydrateLines, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { CartSavings } from "@/components/CartSavings";
import type { PaymentMethod } from "@/lib/checkout-api";
import { track } from "@/lib/analytics-client";

export default function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => hydrateLines(lines), [lines]);
  const total = cartTotal(items);
  const trackedBegin = useRef(false);

  useEffect(() => {
    if (!hydrated || items.length === 0 || trackedBegin.current) return;
    trackedBegin.current = true;
    track("begin_checkout", { qty: items.length });
  }, [hydrated, items.length]);

  if (!hydrated) {
    return <div className="py-20 text-center text-muted">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h1 className="text-3xl mb-4">Nothing to check out</h1>
        <Link href="/#pantry" className="btn">
          Shop the Pantry
        </Link>
      </div>
    );
  }

  const canPlace = !!(
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    deliveryAddress.trim() &&
    !submitting
  );

  const handlePlace = async () => {
    setSubmitting(true);
    setError(null);
    track("checkout_start", { qty: items.length });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name,
            email,
            phone,
            notes: notes.trim() || undefined,
            deliveryAddress: deliveryAddress.trim(),
          },
          paymentMethod,
          lines: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Couldn't place order");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="text-3xl mb-8">Checkout</h1>

        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="eyebrow mb-3">Your details</legend>
            <Field label="Name" value={name} onChange={setName} required />
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              required
              type="email"
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              value={phone}
              onChange={setPhone}
              required
              type="tel"
              placeholder="(905) 555-0123"
            />
            <Field
              label="Delivery address"
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              required
              placeholder="Street address, Oakville ON"
            />
            <p className="text-xs text-muted leading-relaxed">
              All orders are home delivered in Oakville.
            </p>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="eyebrow mb-3">Payment</legend>
            {(
              [
                ["card", "Card", "Pay now with Visa, Mastercard, AmEx, Apple Pay, or Google Pay."],
                ["cod", "Cash on delivery", "Pay when we deliver."],
                ["etransfer", "E-transfer", "We will confirm e-transfer details after you order."],
              ] as const
            ).map(([value, label, detail]) => (
              <label
                key={value}
                className={`flex gap-3 border p-4 cursor-pointer transition-colors ${
                  paymentMethod === value
                    ? "border-foreground bg-surface"
                    : "border-line hover:border-muted"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">{label}</span>
                  <p className="text-sm text-muted mt-1">{detail}</p>
                </div>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-3">Notes (optional)</legend>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-line bg-surface p-3 text-sm focus:outline-none focus:border-foreground"
              placeholder="Gate code, buzzer, swap requests…"
            />
          </fieldset>
        </div>
      </section>

      <aside className="lg:sticky lg:top-10 lg:self-start">
        <div className="border border-line p-6 bg-surface">
          <h2 className="text-xl mb-5">Order</h2>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span>
                  {i.qty}× {i.product.name}
                </span>
                <span className="tabular-nums text-muted">
                  {money(i.product.ourPrice * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-line flex justify-between text-lg">
            <span>Total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <CartSavings items={items} showSobeysDeliveryNote />
          {deliveryAddress.trim() && (
            <p className="mt-5 text-xs text-muted leading-relaxed">
              Home delivery to{" "}
              <span className="text-foreground">{deliveryAddress.trim()}</span>.
            </p>
          )}
          <button
            type="button"
            className="btn w-full mt-6"
            disabled={!canPlace}
            onClick={handlePlace}
          >
            {submitting
              ? "Processing…"
              : paymentMethod === "card"
                ? "Pay with card"
                : "Place order"}
          </button>
          {error && (
            <p className="text-xs text-price-cut mt-3">{error}</p>
          )}
          {paymentMethod === "card" ? (
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              You&apos;ll pay on Stripe&apos;s secure checkout. No card details
              touch this site.
            </p>
          ) : (
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              We&apos;ll confirm payment details before we deliver.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-line bg-surface p-3 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

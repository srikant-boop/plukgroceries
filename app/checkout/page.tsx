"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart, hydrateLines, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { DeliveryAddressField } from "@/components/DeliveryAddressField";
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("etransfer");
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
        <h1 className="text-3xl mb-4">Nothing to reserve</h1>
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
        throw new Error(data.error ?? "Couldn't place reservation");
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
        <h1 className="text-3xl mb-3">Reserve your preorder</h1>
        <p className="text-sm text-muted leading-relaxed mb-8 max-w-lg">
          This holds your spot while we test demand. Nothing is charged now — we
          only ask for payment after we confirm the preorder is going ahead.
        </p>

        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="eyebrow mb-3">Your details</legend>
            <Field
              label="Name"
              value={name}
              onChange={setName}
              required
              autoComplete="name"
            />
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              required
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Phone"
              value={phone}
              onChange={setPhone}
              required
              type="tel"
              placeholder="(905) 555-0123"
              autoComplete="tel"
            />
            <DeliveryAddressField
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              required
            />
            <p className="text-xs text-muted leading-relaxed">
              All orders are home delivered in Oakville.
            </p>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="eyebrow mb-3">
              Preferred payment (if we go ahead)
            </legend>
            <p className="text-sm text-muted leading-relaxed -mt-1 mb-2">
              Pick how you would pay later. No e-transfer, cash, or card is
              collected until we finalize the preorder.
            </p>
            {(
              [
                [
                  "etransfer",
                  "E-transfer",
                  "We will send payment details by email or text once the round is confirmed.",
                ],
                [
                  "cod",
                  "Cash on delivery",
                  "Pay when we home deliver — after the preorder is confirmed.",
                ],
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
          <h2 className="text-xl mb-5">Reservation</h2>
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
            <span>Estimated total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <p className="text-[11px] text-muted mt-2 leading-relaxed">
            Not billed today. Total may adjust slightly if import costs shift
            before we confirm.
          </p>
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
            {submitting ? "Saving…" : "Reserve preorder"}
          </button>
          {error && (
            <p className="text-xs text-price-cut mt-3">{error}</p>
          )}
          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            We will email you when the preorder window closes and whether your
            items are going ahead.
          </p>
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
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        className="w-full border border-line bg-surface p-3 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

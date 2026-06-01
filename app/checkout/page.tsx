"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart, hydrateLines, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { CartSavings } from "@/components/CartSavings";
import { pickupSpots, getPickupSpot } from "@/lib/pickup";

export default function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupSpotId, setPickupSpotId] = useState<string>(pickupSpots[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => hydrateLines(lines), [lines]);
  const total = cartTotal(items);
  const spot = getPickupSpot(pickupSpotId);

  if (!hydrated) {
    return <div className="py-20 text-center text-muted">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h1 className="text-3xl mb-4">Nothing to check out</h1>
        <Link href="/" className="btn">
          Browse shop
        </Link>
      </div>
    );
  }

  const canPlace = !!(
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    spot &&
    !submitting
  );

  const handlePlace = async () => {
    if (!spot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, notes },
          pickupSpotId,
          lines: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Couldn't start payment");
      }
      // Redirect to Stripe Checkout
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
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="eyebrow mb-3">Pickup spot</legend>
            {pickupSpots.map((s) => (
              <label
                key={s.id}
                className={`flex gap-3 border p-4 cursor-pointer transition-colors ${
                  pickupSpotId === s.id
                    ? "border-foreground bg-surface"
                    : "border-line hover:border-muted"
                }`}
              >
                <input
                  type="radio"
                  name="pickupSpot"
                  value={s.id}
                  checked={pickupSpotId === s.id}
                  onChange={() => setPickupSpotId(s.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted">{s.area}</span>
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {s.address} · {s.postal}
                  </p>
                  <p className="text-sm text-accent mt-1">{s.slot}</p>
                  <a
                    href={s.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-4 mt-2 inline-block hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in Maps ↗
                  </a>
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
              placeholder="Allergies, swap requests, anything else…"
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
          <CartSavings items={items} showVoilaDeliveryNote />
          {spot && (
            <p className="mt-5 text-xs text-muted leading-relaxed">
              Pickup at <span className="text-foreground">{spot.name}</span>,{" "}
              <span className="text-foreground">{spot.slot}</span>.
            </p>
          )}
          <button
            type="button"
            className="btn w-full mt-6"
            disabled={!canPlace}
            onClick={handlePlace}
          >
            {submitting ? "Redirecting…" : "Pay with card"}
          </button>
          {error && (
            <p className="text-xs text-price-cut mt-3">{error}</p>
          )}
          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            You&apos;ll pay on Stripe&apos;s secure checkout (Visa, Mastercard,
            AmEx, Apple&nbsp;Pay, Google&nbsp;Pay). No card details touch this
            site.
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

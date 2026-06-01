"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CONFIRM_PHRASE = "DELETE ALL ORDERS";

export function AdminClearOrders({ orderCount }: { orderCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (orderCount === 0) return null;

  const run = async () => {
    setError(null);
    setPending(true);
    const res = await fetch("/api/admin/clear-orders", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: typed }),
    });
    setPending(false);
    if (!res.ok) {
      try {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Clear failed");
      } catch {
        setError("Clear failed");
      }
      return;
    }
    setOpen(false);
    setTyped("");
    router.refresh();
  };

  return (
    <section className="mt-16 border border-price-cut p-6">
      <p className="eyebrow text-price-cut mb-2">Danger zone</p>
      <h2 className="text-lg mb-2">Delete all orders</h2>
      <p className="text-sm text-muted mb-4 max-w-lg">
        Removes every order at once. To drop one test order, use{" "}
        <strong className="font-medium text-foreground">Remove</strong> on that
        row instead. Stripe is not refunded either way.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs px-3 py-1 border border-price-cut text-price-cut hover:bg-price-cut hover:text-background"
        >
          Clear orders…
        </button>
      ) : (
        <div className="space-y-3 max-w-md">
          <label className="block text-sm">
            Type{" "}
            <span className="font-mono text-xs bg-surface px-1">
              {CONFIRM_PHRASE}
            </span>{" "}
            to confirm
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-2 w-full border border-line bg-surface p-2 text-sm font-mono"
              autoComplete="off"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending || typed !== CONFIRM_PHRASE}
              onClick={run}
              className="text-xs px-3 py-1 border border-price-cut text-price-cut disabled:opacity-40"
            >
              {pending ? "Deleting…" : "Delete all orders"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setTyped("");
                setError(null);
              }}
              className="text-xs px-3 py-1 border border-line"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-xs text-price-cut">{error}</p>}
        </div>
      )}
    </section>
  );
}

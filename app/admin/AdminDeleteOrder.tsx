"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminDeleteOrder({
  id,
  customerName,
}: {
  id: string;
  customerName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    const ok = window.confirm(
      `Remove the order for ${customerName}? This only deletes it from admin — Stripe is not refunded.`,
    );
    if (!ok) return;

    setError(null);
    const res = await fetch("/api/admin/delete-order", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      let message = "Couldn't remove order.";
      try {
        const data = (await res.json()) as { error?: string };
        if (data.error) message = data.error;
      } catch {
        /* ignore */
      }
      setError(message);
      return;
    }

    startTransition(() => router.refresh());
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-xs px-3 py-1 border border-price-cut text-price-cut hover:bg-price-cut hover:text-background disabled:opacity-40"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {error && (
        <p className="text-[10px] text-price-cut max-w-[12rem] text-right leading-snug">
          {error}
        </p>
      )}
    </div>
  );
}

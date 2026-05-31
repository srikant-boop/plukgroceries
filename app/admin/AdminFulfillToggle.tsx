"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminFulfillToggle({
  id,
  fulfilled,
}: {
  id: string;
  fulfilled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(fulfilled);

  const toggle = async () => {
    const next = !current;
    setCurrent(next);
    const res = await fetch("/api/admin/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fulfilled: next }),
    });
    if (!res.ok) {
      setCurrent(!next);
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`text-xs px-3 py-1 border ${
        current
          ? "border-accent text-accent"
          : "border-foreground text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {current ? "✓ Fulfilled" : "Mark fulfilled"}
    </button>
  );
}

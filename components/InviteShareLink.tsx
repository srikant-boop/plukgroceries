"use client";

import { useEffect, useState } from "react";

type Props = {
  sessionId: string;
};

export function InviteShareLink({ sessionId }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId.startsWith("cs_")) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/invite?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) throw new Error("lookup failed");
        const data = (await res.json()) as { url?: string; code?: string };
        if (!cancelled && data.url) {
          setUrl(data.url);
          setCode(data.code ?? null);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (error) return null;
  if (!url) {
    return (
      <p className="text-xs text-muted mt-3">Loading your invite link…</p>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 border border-line bg-surface p-5 text-left">
      <p className="eyebrow mb-2">Invite a neighbour</p>
      <p className="text-sm leading-relaxed text-foreground/85 mb-3">
        Share this link. When someone new orders through it, we&apos;ll adjust
        your bag to wholesale prices after their order is paid.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          readOnly
          value={url}
          aria-label="Your invite link"
          className="flex-1 border border-line bg-background px-3 py-2 text-xs font-mono"
        />
        <button type="button" className="btn shrink-0" onClick={copy}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      {code ? (
        <p className="text-[11px] text-muted mt-2">Code: {code}</p>
      ) : null}
    </div>
  );
}

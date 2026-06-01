import { NextResponse } from "next/server";
import { getKv, isStorageConfigured } from "@/lib/kv";

export const runtime = "nodejs";

/** Quick check: https://plukgroceries.vercel.app/api/health/storage */
export async function GET() {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        storage: "not_configured",
        hint: "Connect Upstash under Vercel Storage (REDIS_URL) or set KV_REST_API_URL + KV_REST_API_TOKEN, then redeploy.",
      },
      { status: 503 },
    );
  }

  try {
    const r = await getKv();
    const pong = await r.ping();
    const mode = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
      ? "rest"
      : "tcp";
    return NextResponse.json({ ok: true, storage: "connected", mode, pong });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Redis ping failed";
    return NextResponse.json(
      { ok: false, storage: "ping_failed", error: message },
      { status: 503 },
    );
  }
}

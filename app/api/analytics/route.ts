import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {
  ANALYTICS_EVENTS,
  markAdminSession,
  recordAnalytics,
  type AnalyticsEventType,
} from "@/lib/analytics";
import { ADMIN_COOKIE, isAdminCookieValue } from "@/lib/admin-auth";
import { geoFromRequestHeaders } from "@/lib/visitor-geo";

export const runtime = "nodejs";

const CLIENT_EVENTS = new Set<AnalyticsEventType>(
  ANALYTICS_EVENTS.filter((e) => e !== "purchase"),
);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, sessionId, path, productId, qty } = body as {
    type?: string;
    sessionId?: string;
    path?: string;
    productId?: string;
    qty?: number;
  };

  if (!type || !CLIENT_EVENTS.has(type as AnalyticsEventType)) {
    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sid =
    typeof sessionId === "string" ? sessionId.slice(0, 64) : undefined;
  if (isAdminCookieValue(cookieStore.get(ADMIN_COOKIE)?.value)) {
    await markAdminSession(sid);
    return new NextResponse(null, { status: 204 });
  }

  const geo = geoFromRequestHeaders(await headers());

  await recordAnalytics({
    type: type as AnalyticsEventType,
    sessionId: sid,
    path: typeof path === "string" ? path.slice(0, 200) : undefined,
    productId:
      typeof productId === "string" ? productId.slice(0, 80) : undefined,
    qty: typeof qty === "number" && qty > 0 ? Math.min(qty, 99) : undefined,
    geo,
  });

  return new NextResponse(null, { status: 204 });
}

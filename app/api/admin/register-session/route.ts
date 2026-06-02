import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { markAdminSession } from "@/lib/analytics";

export const runtime = "nodejs";

/** Links this browser's anonymous session id to admin (excluded from Insights). */
export async function POST(req: Request) {
  if (!isAdminAuthorized(req.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { sessionId?: string };
  try {
    body = (await req.json()) as { sessionId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  await markAdminSession(body.sessionId);
  return NextResponse.json({ ok: true });
}

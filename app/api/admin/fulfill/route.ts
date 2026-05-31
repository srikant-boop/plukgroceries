import { NextResponse } from "next/server";
import { markFulfilled } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const got = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("pluk_admin="))
    ?.slice("pluk_admin=".length);
  if (!expected || got !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, fulfilled } = (await req.json()) as {
    id: string;
    fulfilled: boolean;
  };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await markFulfilled(id, !!fulfilled);
  return NextResponse.json({ ok: true });
}

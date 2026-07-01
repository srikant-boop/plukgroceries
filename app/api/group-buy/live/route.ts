import { NextResponse } from "next/server";
import { getGroupBuyProgressForShelf } from "@/lib/group-buy";
import { listGroupBuyActivitySince } from "@/lib/group-buy-activity";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sinceRaw = searchParams.get("since");
  const since = sinceRaw ? Number.parseInt(sinceRaw, 10) : Date.now() - 60_000;
  const safeSince = Number.isFinite(since) ? since : Date.now() - 60_000;

  const [progressList, events] = await Promise.all([
    getGroupBuyProgressForShelf(),
    listGroupBuyActivitySince(safeSince),
  ]);

  const progress = Object.fromEntries(
    progressList.map((row) => [row.productId, row]),
  );

  return NextResponse.json({
    progress,
    events,
    serverTime: Date.now(),
  });
}

import { NextResponse } from "next/server";
import {
  buildGroupBuyProgress,
  getGroupBuyProgressForShelf,
  getReservedQuantities,
} from "@/lib/group-buy";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (productId) {
    const reserved = await getReservedQuantities();
    const progress = buildGroupBuyProgress(productId, reserved[productId] ?? 0);
    return NextResponse.json({ progress, updatedAt: Date.now() });
  }

  const progress = await getGroupBuyProgressForShelf();
  return NextResponse.json({ progress, updatedAt: Date.now() });
}

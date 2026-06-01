import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { clearAllOrders } from "@/lib/orders";

export const runtime = "nodejs";

const CONFIRM_PHRASE = "DELETE ALL ORDERS";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server." },
      { status: 503 },
    );
  }
  if (!isAdminAuthorized(req.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { confirm?: string };
  try {
    body = (await req.json()) as { confirm?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.confirm !== CONFIRM_PHRASE) {
    return NextResponse.json(
      {
        error: `Type exactly "${CONFIRM_PHRASE}" to confirm.`,
      },
      { status: 400 },
    );
  }

  const { deleted } = await clearAllOrders();
  return NextResponse.json({ ok: true, deleted });
}

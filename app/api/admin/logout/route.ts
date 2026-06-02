import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { ANALYTICS_SKIP_COOKIE } from "@/lib/analytics-exclude";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/admin/login", url.origin));
  const opts = {
    path: "/",
    maxAge: 0,
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
  res.cookies.set(ADMIN_COOKIE, "", opts);
  res.cookies.set(ANALYTICS_SKIP_COOKIE, "", { ...opts, httpOnly: false });
  return res;
}

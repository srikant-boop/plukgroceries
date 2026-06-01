import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const from = String(form.get("from") ?? "/admin");
  const expected = getAdminPassword();
  if (!expected) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unconfigured", req.url),
    );
  }
  if (password !== expected) {
    return NextResponse.redirect(new URL("/admin/login?error=wrong", req.url));
  }
  const safeFrom = from.startsWith("/admin") ? from : "/admin";
  const res = NextResponse.redirect(new URL(safeFrom, req.url));
  res.cookies.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

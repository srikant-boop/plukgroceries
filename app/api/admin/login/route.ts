import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const from = String(form.get("from") ?? "/admin");
  const expected = process.env.ADMIN_PASSWORD;
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
  res.cookies.set("pluk_admin", password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

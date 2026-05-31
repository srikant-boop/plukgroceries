import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "pluk_admin";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Only guard /admin (and nested), let /admin/login through
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  const got = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!expected || got !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

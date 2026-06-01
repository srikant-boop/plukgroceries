export const ADMIN_COOKIE = "pluk_admin";

export function getAdminPassword(): string | undefined {
  const v = process.env.ADMIN_PASSWORD?.trim();
  return v || undefined;
}

export function readAdminCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${ADMIN_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(ADMIN_COOKIE.length + 1));
    }
  }
  return undefined;
}

export function isAdminAuthorized(cookieHeader: string | null): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  const got = readAdminCookie(cookieHeader);
  return got === expected;
}

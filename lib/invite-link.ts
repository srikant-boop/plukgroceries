import { SITE_URL } from "./site";
import { normalizeInviteRef } from "./invite-client";

export function inviteUrlForCode(code: string): string {
  return `${SITE_URL}/?ref=${encodeURIComponent(code)}`;
}

export function extractInviteCodeFromUrl(url: string): string | null {
  try {
    return normalizeInviteRef(new URL(url).searchParams.get("ref"));
  } catch {
    return null;
  }
}

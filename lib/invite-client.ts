/** Browser storage for ?ref= invite codes (invitee side). */

export const INVITE_REF_STORAGE_KEY = "pluk-invite-ref";

const INVITE_REF_PATTERN = /^[a-z0-9]{8}$/;

export function normalizeInviteRef(
  raw: string | null | undefined,
): string | null {
  const code = raw?.trim().toLowerCase() ?? "";
  return INVITE_REF_PATTERN.test(code) ? code : null;
}

export function readStoredInviteRef(): string | null {
  if (typeof window === "undefined") return null;
  return normalizeInviteRef(localStorage.getItem(INVITE_REF_STORAGE_KEY));
}

export function storeInviteRef(code: string): void {
  const normalized = normalizeInviteRef(code);
  if (!normalized) return;
  localStorage.setItem(INVITE_REF_STORAGE_KEY, normalized);
}

export function clearStoredInviteRef(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(INVITE_REF_STORAGE_KEY);
}

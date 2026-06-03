import { createHash } from "crypto";
import { getKv } from "./kv";
import type { Order } from "./orders";

export type InviteRecord = {
  code: string;
  inviterOrderId: string;
  inviterEmail: string;
  inviterName: string;
  createdAt: number;
};

export type InviteConversion = {
  inviteeOrderId: string;
  inviteeEmail: string;
  convertedAt: number;
};

const CODE_KEY = (code: string) => `pluk:invite:code:${code}`;
const ORDER_KEY = (orderId: string) => `pluk:invite:order:${orderId}`;
const CONVERSIONS_KEY = (code: string) => `pluk:invite:ref:${code}:orders`;

export const INVITE_CODE_PATTERN = /^[a-z0-9]{8}$/;

export function normalizeInviteCode(
  raw: string | null | undefined,
): string | null {
  const code = raw?.trim().toLowerCase() ?? "";
  return INVITE_CODE_PATTERN.test(code) ? code : null;
}

/** Stable 8-char code derived from a paid Stripe checkout session id. */
export function inviteCodeForOrder(orderId: string): string {
  return createHash("sha256")
    .update(orderId)
    .digest("base64url")
    .slice(0, 8)
    .toLowerCase();
}

export async function registerInviterOrder(order: Order): Promise<string> {
  const code = inviteCodeForOrder(order.id);
  const record: InviteRecord = {
    code,
    inviterOrderId: order.id,
    inviterEmail: order.customer.email ?? "",
    inviterName: order.customer.name,
    createdAt: order.createdAt,
  };

  const r = await getKv();
  await Promise.all([
    r.set(CODE_KEY(code), JSON.stringify(record)),
    r.set(ORDER_KEY(order.id), code),
  ]);
  return code;
}

export async function getInviteByCode(
  code: string,
): Promise<InviteRecord | null> {
  const normalized = normalizeInviteCode(code);
  if (!normalized) return null;
  const r = await getKv();
  const raw = await r.get(CODE_KEY(normalized));
  if (!raw) return null;
  return JSON.parse(raw) as InviteRecord;
}

export async function getInviteByOrderId(
  orderId: string,
): Promise<InviteRecord | null> {
  const r = await getKv();
  const code = await r.get(ORDER_KEY(orderId));
  if (!code || typeof code !== "string") return null;
  return getInviteByCode(code);
}

export async function recordInviteeOrder(
  code: string,
  inviteeOrderId: string,
  inviteeEmail: string,
): Promise<InviteRecord | null> {
  const invite = await getInviteByCode(code);
  if (!invite) return null;
  if (invite.inviterOrderId === inviteeOrderId) return invite;

  const r = await getKv();
  const conversion: InviteConversion = {
    inviteeOrderId,
    inviteeEmail,
    convertedAt: Date.now(),
  };
  await r.zadd(
    CONVERSIONS_KEY(invite.code),
    conversion.convertedAt,
    JSON.stringify(conversion),
  );
  return invite;
}

export async function listInviteConversions(
  code: string,
): Promise<InviteConversion[]> {
  const normalized = normalizeInviteCode(code);
  if (!normalized) return [];
  const r = await getKv();
  const rows = await r.zrangeWithScores(CONVERSIONS_KEY(normalized), 0, -1);
  return rows.map((row) => JSON.parse(row.member) as InviteConversion);
}

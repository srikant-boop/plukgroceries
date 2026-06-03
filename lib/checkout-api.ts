import { getStorefrontProductById, type Product } from "./products";

export type CheckoutLineInput = { productId: string; qty: number };

export type CheckoutCustomerInput = {
  name: string;
  phone: string;
  email: string;
  notes?: string;
};

const METADATA_MAX = 500;

export function validateCheckoutBody(body: {
  customer?: CheckoutCustomerInput;
  pickupSpotId?: string;
  lines?: CheckoutLineInput[];
}):
  | {
      ok: true;
      value: {
        lines: Array<{ product: Product; qty: number }>;
        customer: { name: string; phone: string; email: string; notes?: string };
        pickupSpotId: string;
      };
    }
  | { ok: false; error: string } {
  const name = body.customer?.name?.trim() ?? "";
  const phone = body.customer?.phone?.trim() ?? "";
  const email = body.customer?.email?.trim() ?? "";
  const notes = body.customer?.notes?.trim();

  if (!name) return { ok: false, error: "Name is required." };
  if (!phone) return { ok: false, error: "Phone is required." };
  if (!email || !email.includes("@")) {
    return { ok: false, error: "A valid email is required for your receipt." };
  }
  if (!body.pickupSpotId) {
    return { ok: false, error: "Pick a pickup spot." };
  }
  if (!body.lines?.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const lines: Array<{ product: Product; qty: number }> = [];
  for (const l of body.lines) {
    const qty = Math.floor(Number(l.qty));
    if (!Number.isFinite(qty) || qty < 1) {
      return { ok: false, error: "Invalid quantity in cart." };
    }
    const product = getStorefrontProductById(l.productId);
    if (!product) {
      return { ok: false, error: `This item isn't available this drop.` };
    }
    if (qty > product.stock) {
      return {
        ok: false,
        error: `Only ${product.stock} of ${product.name} available this drop.`,
      };
    }
    lines.push({ product, qty });
  }

  const metadataLines = JSON.stringify(
    lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
  );
  if (metadataLines.length > METADATA_MAX) {
    return { ok: false, error: "Cart is too large for checkout — try fewer items." };
  }

  return {
    ok: true,
    value: {
      pickupSpotId: body.pickupSpotId,
      customer: { name, phone, email, notes: notes || undefined },
      lines,
    },
  };
}

export function stripeConfigError(err: unknown): string | null {
  const msg = err instanceof Error ? err.message : "";
  if (msg.includes("STRIPE_SECRET_KEY")) {
    return "Payments aren't configured yet. Please try again later or contact us.";
  }
  return null;
}

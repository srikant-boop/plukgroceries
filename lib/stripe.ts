import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Stripe not configured — set STRIPE_SECRET_KEY in env (use a test key sk_test_... for dev, live key sk_live_... in production).",
    );
  }
  _stripe = new Stripe(key);
  return _stripe;
}

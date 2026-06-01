# Pluk — weekly Oakville grocery drop

Next.js storefront at [plukgroceries.vercel.app](https://plukgroceries.vercel.app).

## Local dev

```bash
npm install
cp .env.example .env.local   # then fill in keys (see below)
npm run dev
```

## Pay with card (Stripe)

Checkout is already wired: `POST /api/checkout` → Stripe Checkout → `POST /api/webhooks/stripe` saves the order to KV and optionally emails you.

This is **not** the old [Roots](https://github.com/) app pattern (Go API + Stripe Connect for event hosts). Pluk uses simple **Stripe Checkout** on this Next.js app — same idea as Roots’ store checkout, but implemented here in TypeScript.

### 1. Stripe Dashboard

1. Create or open a [Stripe account](https://dashboard.stripe.com) (Canada).
2. **Developers → API keys** → copy the **Secret key** (`sk_test_…` for testing).
3. **Developers → Webhooks → Add endpoint**
   - URL: `https://plukgroceries.vercel.app/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_…`).

Use **test mode** until you have run a full test order; then repeat webhook + keys for **live mode**.

### 2. Vercel env vars

In the Vercel project → **Settings → Environment Variables** (Production + Preview):

| Variable | Required | Notes |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes | `sk_test_…` or `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | Yes | From the webhook above |
| `KV_REST_API_URL` | Yes* | From Upstash **REST API** (or link Storage below) |
| `KV_REST_API_TOKEN` | Yes* | Same |
| `REDIS_URL` | Alt | If Vercel only injects TCP Redis, set this instead |

\*At least one of the KV pair **or** `REDIS_URL` must be set on **Production**.

**Link database on Vercel:** Project → **Storage** → your Upstash Redis → **Connect to project** → choose **Production** → redeploy.

**Verify after deploy:** open `https://plukgroceries.vercel.app/api/health/storage` — should be `{"ok":true,"storage":"connected"}`. If you see `not_configured`, env vars are still missing on Production.

**Sync from your machine** (after `vercel login` + `vercel link`):

```bash
npm run vercel:sync-env
vercel deploy --prod
```
| `RESEND_API_KEY` | No | Order notification email |
| `ORDER_NOTIFICATION_EMAIL` | No | Your inbox |
| `RESEND_FROM_EMAIL` | No | e.g. `Pluk <orders@yourdomain.com>` |
| `ADMIN_PASSWORD` | No | Protects `/admin` |
| `FACEBOOK_APP_ID` | No | Meta App ID for `fb:app_id` (Facebook link debugger) |

Redeploy after saving env vars.

### Facebook link preview (`fb:app_id`)

Link previews work without this. To clear the **Missing fb:app_id** warning in [Sharing Debugger](https://developers.facebook.com/tools/debug/):

1. [developers.facebook.com](https://developers.facebook.com/) → **My Apps** → **Create App** → **Other** → **Business** (name it e.g. Pluk).
2. **Settings → Basic** → copy **App ID** (numeric).
3. Add `FACEBOOK_APP_ID` to Vercel Production env, redeploy, **Scrape Again**.

### 3. Local webhook testing

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run stripe:listen
```

Put the `whsec_…` printed by the CLI into `.env.local` as `STRIPE_WEBHOOK_SECRET` (it changes each time you run listen unless you use a fixed Stripe CLI endpoint).

### 4. Test checkout

1. Add items → **Checkout** → fill name, email, phone, pickup spot.
2. **Pay with card** → use `4242 4242 4242 4242`, any future expiry, any CVC.
3. Success page clears the cart.
4. Confirm the order appears at `/admin` (set `ADMIN_PASSWORD` first).

If payment works but **no order in admin**, Stripe’s webhook is probably returning **503** (`Order storage not configured`). Fix storage env vars, redeploy, then **Resend** the failed event in Stripe → Webhooks.

Check `/api/health/storage` and Vercel function logs for `/api/webhooks/stripe`.

## Scripts

- `npm run verify:voila` — spot-check Voilà prices for L6M0S2 (needs Playwright).

#!/usr/bin/env bash
# Push Pluk secrets from .env.local to Vercel (Production).
# Run once after: vercel login && vercel link (pick the plukgroceries project)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — create it from .env.example first."
  exit 1
fi

if ! vercel whoami &>/dev/null; then
  echo "Not logged in. Run this in Terminal, then run this script again:"
  echo "  vercel login"
  exit 1
fi

if [[ ! -d .vercel ]]; then
  echo "Project not linked. Run this, choose your Pluk project, then run this script again:"
  echo "  vercel link"
  exit 1
fi

get_var() {
  local key="$1"
  local line val
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -1 || true)"
  if [[ -z "$line" ]]; then
    echo ""
    return
  fi
  val="${line#*=}"
  val="${val%\"}"
  val="${val#\"}"
  val="${val%\'}"
  val="${val#\'}"
  printf '%s' "$val"
}

push_var() {
  local key="$1"
  local val="$2"
  if [[ -z "$val" ]]; then
    echo "⊘ Skip $key (empty in .env.local)"
    return
  fi
  echo "→ $key"
  vercel env add "$key" production --value "$val" --yes --force --sensitive
}

echo "Syncing .env.local → Vercel (production) for $(vercel whoami 2>/dev/null)…"
echo ""

push_var STRIPE_SECRET_KEY "$(get_var STRIPE_SECRET_KEY)"
push_var STRIPE_WEBHOOK_SECRET "$(get_var STRIPE_WEBHOOK_SECRET)"
push_var KV_REST_API_URL "$(get_var KV_REST_API_URL)"
push_var KV_REST_API_TOKEN "$(get_var KV_REST_API_TOKEN)"
# If Vercel only linked TCP Redis, this lets the app derive REST creds
push_var REDIS_URL "$(get_var REDIS_URL)"

# Optional
push_var RESEND_API_KEY "$(get_var RESEND_API_KEY)"
push_var ORDER_NOTIFICATION_EMAIL "$(get_var ORDER_NOTIFICATION_EMAIL)"
push_var RESEND_FROM_EMAIL "$(get_var RESEND_FROM_EMAIL)"
push_var ADMIN_PASSWORD "$(get_var ADMIN_PASSWORD)"

echo ""
echo "Done. Redeploy so the site picks up new variables:"
echo "  vercel deploy --prod"
echo "Or: Vercel dashboard → Deployments → Redeploy"

#!/usr/bin/env node
/**
 * Voilà price checks require postal L6M0S2 (see lib/voila.ts).
 * Anonymous HTTP fetches return wrong regional prices (e.g. broccoli $9.99 vs $8.99).
 *
 * Run the Playwright script instead:
 *   npm install playwright && npx playwright install chromium
 *   node scripts/fetch-voila-prices.mjs
 */

console.error(
  "Use node scripts/fetch-voila-prices.mjs — Voilà prices need postal L6M0S2 in a browser session.",
);
process.exit(1);

#!/usr/bin/env node
/**
 * Spot-check Voila competitor prices in lib/products.ts against live PDPs.
 * Run: node scripts/verify-voila-prices.mjs
 *
 * Note: Voila prices vary by postal code / region. Default fetch may differ
 * from Oakville GTA — re-check in-app if a row looks off locally.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/products.ts"), "utf8");

const rows = [...src.matchAll(
  /name: "([^"]+)"[\s\S]*?store: "Voila", price: ([\d.]+)[\s\S]*?url: "([^"]+)"/g,
)].map((m) => ({ name: m[1], catalog: Number(m[2]), url: m[3] }));

const priceRe = /\$(\d+\.\d{2})/g;

async function livePrice(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PlukPriceCheck/1.0)" },
  });
  const html = await res.text();
  const hits = [...html.matchAll(priceRe)].map((m) => m[1]);
  // First $X.XX on PDP is usually the headline price.
  return hits[0] ?? null;
}

let mismatches = 0;
console.log("SKU | Catalog | Voila (live) | OK");
console.log("--- | ------- | ------------ | --");

for (const row of rows) {
  const live = await livePrice(row.url);
  const ok = live && Number(live) === row.catalog;
  if (!ok) mismatches++;
  console.log(
    `${row.name} | $${row.catalog.toFixed(2)} | $${live ?? "?"} | ${ok ? "✓" : "✗"}`,
  );
}

process.exit(mismatches > 0 ? 1 : 0);

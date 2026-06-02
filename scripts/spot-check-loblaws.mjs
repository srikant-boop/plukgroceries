#!/usr/bin/env node
/** Quick Loblaws spot-check for catalog competitor prices (store 1011). */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/products.ts"), "utf8");

const checks = [...src.matchAll(
  /id: "([^"]+)"[\s\S]*?competitors: \[([\s\S]*?)\],/g,
)].flatMap((m) => {
  const id = m[1];
  const block = m[2];
  const loblaws = block.match(
    /store: "Loblaws", price: ([\d.]+)[\s\S]*?url: "([^"]+)"/,
  );
  if (!loblaws) return [];
  return [{ id, catalog: Number(loblaws[1]), url: loblaws[2] }];
});

function parsePrices(text) {
  return [...String(text).matchAll(/\$\s*(\d+\.\d{2})/g)].map((x) =>
    parseFloat(x[1]),
  );
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  locale: "en-CA",
  timezoneId: "America/Toronto",
});

console.log("Loblaws store 1011 spot-check\n");
let mismatches = 0;

for (const { id, catalog, url } of checks) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3500);
    const body = await page.locator("body").innerText();
    const prices = parsePrices(body);
    const live = prices[0] ?? null;
    const ok = live != null && Math.abs(live - catalog) <= 0.02;
    if (!ok) mismatches++;
    console.log(
      `${id}: catalog $${catalog.toFixed(2)} | live ${live != null ? `$${live.toFixed(2)}` : "—"} | ${ok ? "OK" : "MISMATCH"}`,
    );
  } catch (e) {
    mismatches++;
    console.log(`${id}: ERROR ${e.message}`);
  }
}

await browser.close();
process.exit(mismatches > 0 ? 1 : 0);

#!/usr/bin/env node
/**
 * Verify Sobeys (Voilà) organic competitor prices for postal L6M0S2 (Oakville).
 *
 * Setup (run each command separately — do not paste shell comments):
 *   npm install
 *   npx playwright install chromium
 *
 * Run:
 *   node scripts/verify-voila-prices-l6m0s2.mjs
 *   npm run verify:voila
 */

import { chromium } from "playwright";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sobeysSrc = readFileSync(join(root, "lib/sobeys.ts"), "utf8");
const POSTAL = sobeysSrc.match(/SOBEYS_POSTAL_CODE = "([^"]+)"/)[1];
const POSTAL_FORMATTED = POSTAL.replace(/(.{3})(.{3})/, "$1 $2");

const catalogSrc = readFileSync(join(root, "lib/products.ts"), "utf8");
const products = [...catalogSrc.matchAll(
  /name: "([^"]+)"[\s\S]*?store: "Sobeys", price: ([\d.]+)[\s\S]*?url: "([^"]+)"/g,
)].map((m) => ({
  sku: m[1],
  catalog: Number(m[2]),
  url: m[3],
}));

if (products.length === 0) {
  console.error("No Sobeys competitors found in lib/products.ts");
  process.exit(1);
}

function findPlaywrightChromium() {
  const base = join(homedir(), "Library/Caches/ms-playwright");
  if (!existsSync(base)) return null;
  for (const dir of readdirSync(base)) {
    if (!dir.startsWith("chromium")) continue;
    for (const sub of [
      "chrome-headless-shell-mac-arm64",
      "chrome-headless-shell-mac-x64",
      "chrome-mac-arm64",
      "chrome-mac",
    ]) {
      const headless = join(base, dir, sub, "chrome-headless-shell");
      if (existsSync(headless)) return headless;
      const chromiumApp = join(
        base,
        dir,
        sub,
        "Chromium.app/Contents/MacOS/Chromium",
      );
      if (existsSync(chromiumApp)) return chromiumApp;
    }
  }
  return null;
}

function systemChromePath() {
  const paths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  return paths.find((p) => existsSync(p)) ?? null;
}

async function launchBrowser() {
  const bundled = findPlaywrightChromium();
  const chrome = systemChromePath();
  const attempts = [
    process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH, headless: true }
      : null,
    chrome ? { executablePath: chrome, headless: true } : null,
    { channel: "chrome", headless: true },
    { channel: "msedge", headless: true },
    bundled ? { executablePath: bundled, headless: true } : null,
  ].filter(Boolean);

  let last;
  for (const opts of attempts) {
    try {
      return await chromium.launch(opts);
    } catch (e) {
      last = e;
    }
  }

  console.error(`
Could not launch a browser for Voilà price checks.

Try:
  npx playwright install chromium
  node scripts/verify-voila-prices-l6m0s2.mjs

Or point at an existing Chrome binary:
  PLAYWRIGHT_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scripts/verify-voila-prices-l6m0s2.mjs
`);
  throw last;
}

function parsePrice(text) {
  const m = String(text ?? "").match(/\$(\d+\.\d{2})/);
  return m ? parseFloat(m[1]) : null;
}

async function readHeadlinePrice(page) {
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  const prices = [...body.matchAll(/\$\s*(\d+\.\d{2})/g)].map((x) => x[1]);
  return prices[0] ?? null;
}

async function setPostalCode(page) {
  await page.goto("https://voila.ca", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForTimeout(2500);

  const tryFill = async (input) => {
    if (!(await input.isVisible({ timeout: 3000 }).catch(() => false))) return false;
    await input.fill(POSTAL_FORMATTED);
    await page.keyboard.press("Enter");
    const submit = page
      .getByRole("button", { name: /shop|continue|submit|confirm|save|start/i })
      .first();
    if (await submit.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submit.click().catch(() => {});
    }
    await page.waitForTimeout(2500);
    return true;
  };

  const direct = page.locator(
    'input[placeholder*="postal" i], input[name*="postal" i], input[id*="postal" i], input[autocomplete="postal-code"]',
  ).first();
  if (await tryFill(direct)) return;

  const locationBtn = page
    .getByRole("button", { name: /postal|delivery|location|address/i })
    .first();
  if (await locationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await locationBtn.click();
    await page.waitForTimeout(1000);
    const modal = page.locator('input[placeholder*="postal" i], input[name*="postal" i]').first();
    await tryFill(modal);
  }
}

async function scrapeSession(browser, withPostal) {
  const context = await browser.newContext({
    locale: "en-CA",
    timezoneId: "America/Toronto",
    geolocation: { latitude: 43.4675, longitude: -79.6877 },
    permissions: ["geolocation"],
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  if (withPostal) await setPostalCode(page);

  const rows = [];
  for (const p of products) {
    await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 120000 });
    const live = await readHeadlinePrice(page);
    rows.push({ ...p, live: parsePrice(live ? `$${live}` : null), liveText: live });
  }
  await context.close();
  return rows;
}

const browser = await launchBrowser();
console.log(`Checking Voilà prices (postal ${POSTAL_FORMATTED})…\n`);

const withPostal = await scrapeSession(browser, true);
const withoutPostal = await scrapeSession(browser, false);
await browser.close();

console.log("SKU | L6M0S2 | No postal | Catalog | Mismatch?");
console.log("--- | ------ | --------- | ------- | ---------");

let mismatches = 0;
for (let i = 0; i < products.length; i++) {
  const a = withPostal[i]?.live;
  const b = withoutPostal[i]?.live;
  const cat = products[i].catalog;
  const mismatch = a != null && Math.abs(a - cat) > 0.001;
  if (mismatch) mismatches++;
  console.log(
    `${products[i].sku} | ${a ?? "—"} | ${b ?? "—"} | ${cat} | ${mismatch ? "YES" : ""}`,
  );
}

process.exit(mismatches > 0 ? 1 : 0);

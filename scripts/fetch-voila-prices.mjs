#!/usr/bin/env node
/**
 * Fetch Voila.ca prices for postal L6M0S2 (Oakville) vs anonymous session.
 * Run from repo root: node scripts/fetch-voila-prices.mjs
 * Requires: npm install playwright && npx playwright install chromium
 */
import { chromium } from 'playwright';

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voilaSrc = readFileSync(join(root, "lib/voila.ts"), "utf8");
const POSTAL = voilaSrc.match(/VOILA_POSTAL_CODE = "([^"]+)"/)[1];
const products = [
  { sku: 'Yellow Potatoes', catalog: 7.99, url: 'https://voila.ca/products/organic-potatoes-yellow-1-36-kg/472128EA' },
  { sku: 'Tomatoes on the Vine', catalog: 8.99, url: 'https://voila.ca/products/organic-tomatoes-on-the-vine-4-6-counts/1408309EA' },
  { sku: 'English Cucumber', catalog: 4.99, url: 'https://voila.ca/products/organic-english-cucumber-1-count/129818EA' },
  { sku: 'Carrots', catalog: 5.99, url: 'https://voila.ca/products/organic-carrots-908-g/112284EA' },
  { sku: 'Romaine Lettuce', catalog: 9.99, url: 'https://voila.ca/products/organic-romaine-hearts-3-count/414489EA' },
  { sku: 'Broccoli Crowns', catalog: 8.99, url: 'https://voila.ca/products/organic-broccoli-1-count/112808EA' },
  { sku: 'Bananas', catalog: 3.79, url: 'https://voila.ca/products/organic-bananas-bunch-6-10-count-ripe-in-3-4-days/833423EA' },
  { sku: 'Gala Apples', catalog: 9.99, url: 'https://voila.ca/products/lil-snapper-organic-apples-gala-1-36-kg/674671EA' },
  { sku: 'Clementines', catalog: 8.49, url: 'https://voila.ca/products/organic-clementine-907-g/265759EA' },
  { sku: 'Strawberries', catalog: 9.99, url: 'https://voila.ca/products/organic-strawberries-454-g/14837EA' },
];

function parsePrice(text) {
  const m = String(text ?? '').match(/\$(\d+\.\d{2})/);
  return m ? parseFloat(m[1]) : null;
}

async function extractPrice(page) {
  await page.waitForTimeout(2000);
  return page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-test], [data-testid]')) {
      const key = el.getAttribute('data-test') || el.getAttribute('data-testid') || '';
      if (/price/i.test(key) && el.textContent?.includes('$')) return el.textContent.trim();
    }
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(s.textContent);
        const price = data.offers?.price ?? data?.['@graph']?.find((x) => x.offers)?.offers?.price;
        if (price) return `$${price}`;
      } catch {}
    }
    const m = document.body.innerText.match(/\$(\d+\.\d{2})/);
    return m ? `$${m[1]}` : null;
  });
}

async function setPostal(page) {
  await page.goto('https://voila.ca', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(2500);
  const postal = page.locator('input[placeholder*="postal" i], input[name*="postal" i], input[id*="postal" i]').first();
  if (await postal.count()) {
    await postal.fill(POSTAL.replace(/(.{3})(.{3})/, "$1 $2"));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
  }
  const btn = page.getByRole('button', { name: /continue|confirm|shop|save|start/i }).first();
  if (await btn.isVisible().catch(() => false)) await btn.click().catch(() => {});
  await page.waitForTimeout(2000);
}

async function scrape(browser, withPostal) {
  const context = await browser.newContext({
    locale: "en-CA",
    timezoneId: "America/Toronto",
    geolocation: { latitude: 43.4675, longitude: -79.6877 },
    permissions: ["geolocation"],
  });
  const page = await context.newPage();
  if (withPostal) await setPostal(page);
  const rows = [];
  for (const p of products) {
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const priceText = await extractPrice(page);
    rows.push({ sku: p.sku, price: parsePrice(priceText), priceText, catalog: p.catalog });
  }
  await context.close();
  return rows;
}

const launchOpts = process.env.PLAYWRIGHT_EXECUTABLE_PATH
  ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH, headless: true }
  : { channel: 'chrome', headless: true };

const browser = await chromium.launch(launchOpts);
const withPostal = await scrape(browser, true);
const withoutPostal = await scrape(browser, false);
await browser.close();

console.log('\nSKU | L6M0S2 | No postal | Catalog | Recommend | Mismatch?');
console.log('---|--------|-----------|---------|-----------|----------');
for (let i = 0; i < products.length; i++) {
  const sku = products[i].sku;
  const a = withPostal[i]?.price;
  const b = withoutPostal[i]?.price;
  const cat = products[i].catalog;
  const rec = a ?? b ?? cat;
  const mismatch = a != null && Math.abs(a - cat) > 0.001 ? 'YES' : '';
  console.log(`${sku} | ${a ?? '—'} | ${b ?? '—'} | ${cat} | ${rec} | ${mismatch}`);
}

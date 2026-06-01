#!/usr/bin/env node
/**
 * Wipe all Pluk orders from Redis (local or production env).
 *
 *   CONFIRM=YES node scripts/clear-orders.mjs
 *
 * Uses REDIS_URL from .env.local (or your shell). For production:
 *   vercel env pull .env.production.local
 *   set -a && source .env.production.local && set +a
 *   CONFIRM=YES node scripts/clear-orders.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "redis";

const ORDERS_KEY = "pluk:orders";
const orderKey = (id) => `pluk:order:${id}`;

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.production.local");

if (process.env.CONFIRM !== "YES") {
  console.error("Refusing to run. Set CONFIRM=YES to delete all orders.");
  process.exit(1);
}

const url = process.env.REDIS_URL;
if (!url) {
  console.error("REDIS_URL is not set.");
  process.exit(1);
}

const client = createClient({ url });
await client.connect();
const ids = await client.zRange(ORDERS_KEY, 0, -1);
const keys = ids.map(orderKey);
if (keys.length) await client.del(keys);
await client.del(ORDERS_KEY);
await client.quit();
console.log(`Deleted ${ids.length} order(s).`);

import { Redis } from "@upstash/redis";

// Reads Upstash/Vercel KV creds from env. When you enable the Vercel KV
// integration these are injected automatically as KV_REST_API_URL +
// KV_REST_API_TOKEN. Locally, set them in .env.local.
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Storage not configured — set KV_REST_API_URL and KV_REST_API_TOKEN (Vercel KV integration injects these).",
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}

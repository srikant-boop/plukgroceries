import { Redis as UpstashRedis } from "@upstash/redis";
import { createClient, type RedisClientType } from "redis";

export type KvClient = {
  ping(): Promise<string>;
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrangeRev(key: string, start: number, stop: number): Promise<string[]>;
  mget(keys: string[]): Promise<(string | null)[]>;
  incr(key: string): Promise<number>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  sadd(key: string, ...members: string[]): Promise<void>;
  scard(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
  zcard(key: string): Promise<number>;
  zremrangebyrank(key: string, start: number, stop: number): Promise<void>;
};

let _upstash: UpstashRedis | null = null;
let _tcp: RedisClientType | null = null;
let _tcpConnecting: Promise<RedisClientType> | null = null;

function explicitRestCreds(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.STORAGE_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.STORAGE_REST_API_TOKEN;
  if (url && token) return { url, token };
  return null;
}

function tcpRedisUrl(): string | null {
  return (
    process.env.REDIS_URL ??
    process.env.STORAGE_URL ??
    null
  );
}

export function isStorageConfigured(): boolean {
  return explicitRestCreds() !== null || tcpRedisUrl() !== null;
}

async function getUpstash(): Promise<UpstashRedis> {
  if (_upstash) return _upstash;
  const creds = explicitRestCreds();
  if (!creds) {
    throw new Error("Upstash REST credentials not configured");
  }
  _upstash = new UpstashRedis({ url: creds.url, token: creds.token });
  return _upstash;
}

async function getTcp(): Promise<RedisClientType> {
  if (_tcp?.isOpen) return _tcp;
  if (_tcpConnecting) return _tcpConnecting;

  const url = tcpRedisUrl();
  if (!url) {
    throw new Error("REDIS_URL not configured");
  }

  _tcpConnecting = (async () => {
    const client = createClient({ url });
    client.on("error", (err) => console.error("[redis tcp]", err));
    await client.connect();
    _tcp = client;
    _tcpConnecting = null;
    return client;
  })();

  return _tcpConnecting;
}

function upstashAdapter(r: UpstashRedis): KvClient {
  return {
    async ping() {
      return r.ping();
    },
    async set(key, value) {
      await r.set(key, value);
    },
    async get(key) {
      const raw = await r.get<string>(key);
      return raw == null ? null : String(raw);
    },
    async zadd(key, score, member) {
      await r.zadd(key, { score, member });
    },
    async zrangeRev(key, start, stop) {
      const ids = await r.zrange<string[]>(key, start, stop, { rev: true });
      return ids ?? [];
    },
    async mget(keys) {
      if (keys.length === 0) return [];
      const raws = await r.mget<(string | null)[]>(...keys);
      return raws.map((v) => (v == null ? null : String(v)));
    },
    async incr(key) {
      return r.incr(key);
    },
    async hincrby(key, field, increment) {
      return r.hincrby(key, field, increment);
    },
    async hgetall(key) {
      const raw = await r.hgetall<Record<string, string>>(key);
      return raw ?? {};
    },
    async sadd(key, ...members) {
      if (members.length === 0) return;
      for (const member of members) {
        await r.sadd(key, member);
      }
    },
    async scard(key) {
      return r.scard(key);
    },
    async expire(key, seconds) {
      await r.expire(key, seconds);
    },
    async zcard(key) {
      return r.zcard(key);
    },
    async zremrangebyrank(key, start, stop) {
      await r.zremrangebyrank(key, start, stop);
    },
  };
}

function tcpAdapter(client: RedisClientType): KvClient {
  return {
    async ping() {
      return client.ping();
    },
    async set(key, value) {
      await client.set(key, value);
    },
    async get(key) {
      const raw = await client.get(key);
      return raw;
    },
    async zadd(key, score, member) {
      await client.zAdd(key, { score, value: member });
    },
    async zrangeRev(key, start, stop) {
      return client.zRange(key, start, stop, { REV: true });
    },
    async mget(keys) {
      if (keys.length === 0) return [];
      return client.mGet(keys);
    },
    async incr(key) {
      return client.incr(key);
    },
    async hincrby(key, field, increment) {
      return client.hIncrBy(key, field, increment);
    },
    async hgetall(key) {
      const raw = await client.hGetAll(key);
      return raw ?? {};
    },
    async sadd(key, ...members) {
      if (members.length === 0) return;
      await client.sAdd(key, members);
    },
    async scard(key) {
      return client.sCard(key);
    },
    async expire(key, seconds) {
      await client.expire(key, seconds);
    },
    async zcard(key) {
      return client.zCard(key);
    },
    async zremrangebyrank(key, start, stop) {
      await client.zRemRangeByRank(key, start, stop);
    },
  };
}

/** Prefer explicit REST; otherwise use Vercel's REDIS_URL over TCP (node-redis). */
export async function getKv(): Promise<KvClient> {
  if (explicitRestCreds()) {
    return upstashAdapter(await getUpstash());
  }
  return tcpAdapter(await getTcp());
}

/** List all members of a sorted set (oldest → newest). */
export async function listZsetMembers(key: string): Promise<string[]> {
  if (explicitRestCreds()) {
    const r = await getUpstash();
    const ids = await r.zrange<string[]>(key, 0, -1);
    return ids ?? [];
  }
  const client = await getTcp();
  return client.zRange(key, 0, -1);
}

/** Remove a member from a sorted set. */
export async function zremMember(key: string, member: string): Promise<void> {
  if (explicitRestCreds()) {
    const r = await getUpstash();
    await r.zrem(key, member);
    return;
  }
  const client = await getTcp();
  await client.zRem(key, member);
}

/** Delete one or more keys. */
export async function deleteKeys(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  if (explicitRestCreds()) {
    const r = await getUpstash();
    await r.del(...keys);
    return;
  }
  const client = await getTcp();
  await client.del(keys);
}

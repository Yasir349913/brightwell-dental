// Simple in-memory limiter for the demo. It resets on restart and is per server
// instance. For production on serverless, use a shared store (e.g. Upstash Redis).
const g = globalThis as unknown as { __bwRate?: Map<string, number[]> };
const hits = (g.__bwRate ??= new Map<string, number[]>());

export function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    hits.set(key, recent);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return { ok: true as const, retryAfter: 0 };
}
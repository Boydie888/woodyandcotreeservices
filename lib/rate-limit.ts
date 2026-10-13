/**
 * Small in-memory rate limiter (per server instance).
 *
 * Good enough to blunt casual abuse on a single server. On serverless
 * hosting (e.g. Vercel) each instance has its own memory, so for stronger
 * protection also enable Cloudflare Turnstile (see .env.example) and/or
 * your host's firewall rate limiting.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow forever.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

export function _resetRateLimitForTests() {
  buckets.clear();
}

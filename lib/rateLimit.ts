import { ApiError, isDuplicateKeyError } from "@/lib/api/response";
import { connectDB } from "@/lib/mongodb";
import RateLimit from "@/models/RateLimit";

export type RateLimitResult = { ok: boolean; retryAfter: number; count: number };

/**
 * Fixed-window counter shared by every server instance (state lives in MongoDB).
 * Fails OPEN: if the limiter's own storage errors, the request is allowed and the
 * error is logged, so a limiter outage can't take the site down.
 */
export async function rateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
  now = Date.now()
): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const windowIndex = Math.floor(now / windowMs);
  const windowEnd = (windowIndex + 1) * windowMs;
  const key = `${bucket}:${windowIndex}`;
  const retryAfter = Math.max(1, Math.ceil((windowEnd - now) / 1000));

  try {
    await connectDB();
    const hit = () =>
      RateLimit.findOneAndUpdate(
        { key },
        {
          $inc: { count: 1 },
          // Keep the doc a little past its window so a late TTL sweep can't reset a live window.
          $setOnInsert: { expiresAt: new Date(windowEnd + 60_000) },
        },
        { upsert: true, new: true }
      );
    let doc;
    try {
      doc = await hit();
    } catch (error) {
      // Two first-hits can race on the upsert; the loser just retries once.
      if (!isDuplicateKeyError(error)) throw error;
      doc = await hit();
    }
    const count = Number(doc?.count ?? 1);
    return { ok: count <= limit, retryAfter, count };
  } catch (error) {
    console.error("RATE_LIMIT_ERROR (failing open):", error);
    return { ok: true, retryAfter, count: 0 };
  }
}

/**
 * Best-effort client IP. Behind Vercel/most proxies the platform sets
 * x-forwarded-for; if the app is ever exposed directly this header is
 * spoofable, so don't treat it as strong identity.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Throws a 429 ApiError (with Retry-After) when the caller is over the limit. */
export async function enforceRateLimit(
  request: Request,
  name: string,
  limit: number,
  windowSeconds: number
): Promise<void> {
  const result = await rateLimit(`${name}:${getClientIp(request)}`, limit, windowSeconds);
  if (!result.ok) {
    throw new ApiError(
      429,
      "RATE_LIMITED",
      `Too many requests. Please try again in ${Math.ceil(result.retryAfter / 60) > 1 ? `${Math.ceil(result.retryAfter / 60)} minutes` : `${result.retryAfter} seconds`}.`,
      undefined,
      { "Retry-After": String(result.retryAfter) }
    );
  }
}

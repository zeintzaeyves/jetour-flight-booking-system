/**
 * Minimal signed-cookie admin session using Web Crypto (works in both the
 * proxy and route handlers). Fails closed if env vars are missing.
 */
export const SESSION_COOKIE = "jetour_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export async function createSessionToken(
  secret: string,
  now = Date.now()
): Promise<string> {
  const payload = b64url(
    enc.encode(JSON.stringify({ exp: now + SESSION_TTL_SECONDS * 1000 }))
  );
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | null,
  now = Date.now()
): Promise<boolean> {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!timingSafeEqual(sig, await hmac(secret, payload))) return false;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

/** Constant-time password check against ADMIN_PASSWORD. */
export async function checkAdminPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = getSecret();
  if (!expected || !secret) return false;
  // Compare HMACs so length differences don't leak.
  return timingSafeEqual(await hmac(secret, input), await hmac(secret, expected));
}

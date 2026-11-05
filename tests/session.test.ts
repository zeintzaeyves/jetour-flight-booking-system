import { afterEach, describe, expect, it, vi } from "vitest";

import {
  checkAdminPassword,
  createSessionToken,
  getSecret,
  verifySessionToken,
} from "@/lib/auth/session";

const SECRET = "x".repeat(40);

afterEach(() => vi.unstubAllEnvs());

describe("admin session token", () => {
  it("verifies a fresh token", async () => {
    expect(await verifySessionToken(await createSessionToken(SECRET), SECRET)).toBe(true);
  });
  it("rejects tampered, wrong-secret, expired, malformed and missing tokens", async () => {
    const t = await createSessionToken(SECRET);
    const [payload, sig] = t.split(".");
    expect(await verifySessionToken(`${payload}x.${sig}`, SECRET)).toBe(false);
    expect(await verifySessionToken(t, "y".repeat(40))).toBe(false);
    expect(await verifySessionToken(t, SECRET, Date.now() + 9 * 3600 * 1000)).toBe(false);
    expect(await verifySessionToken("garbage", SECRET)).toBe(false);
    expect(await verifySessionToken(undefined, SECRET)).toBe(false);
    expect(await verifySessionToken(t, null)).toBe(false);
  });
});

describe("admin password", () => {
  it("fails closed when not configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(await checkAdminPassword("anything")).toBe(false);
    expect(getSecret()).toBeNull();
  });
  it("rejects short secrets", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "short");
    expect(getSecret()).toBeNull();
  });
  it("accepts only the right password", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "correct horse");
    vi.stubEnv("ADMIN_SESSION_SECRET", SECRET);
    expect(await checkAdminPassword("correct horse")).toBe(true);
    expect(await checkAdminPassword("wrong")).toBe(false);
    expect(await checkAdminPassword("")).toBe(false);
  });
});

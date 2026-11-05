import { beforeEach, describe, expect, it, vi } from "vitest";

// The model is mocked: this checks the limiter's logic. A real-Mongo run lives in e2e/.
const findOneAndUpdate = vi.fn();
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/RateLimit", () => ({ default: { findOneAndUpdate } }));

const { rateLimit, getClientIp, enforceRateLimit } = await import("@/lib/rateLimit");

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("rateLimit", () => {
  it("allows up to the limit and blocks after it", async () => {
    findOneAndUpdate.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 3 }).mockResolvedValueOnce({ count: 4 });
    expect((await rateLimit("login:1.2.3.4", 3, 60)).ok).toBe(true);
    expect((await rateLimit("login:1.2.3.4", 3, 60)).ok).toBe(true); // 3 of 3
    expect((await rateLimit("login:1.2.3.4", 3, 60)).ok).toBe(false); // 4th
  });

  it("buckets by window so counts reset when the window rolls", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 1 });
    await rateLimit("x", 5, 60, 60_000 * 10 + 5_000);
    await rateLimit("x", 5, 60, 60_000 * 11 + 5_000);
    const keys = findOneAndUpdate.mock.calls.map((c) => c[0].key);
    expect(keys).toEqual(["x:10", "x:11"]);
  });

  it("reports a positive retry-after within the window", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 99 });
    const r = await rateLimit("x", 1, 60, 60_000 * 10 + 45_000);
    expect(r.ok).toBe(false);
    expect(r.retryAfter).toBe(15);
  });

  it("increments atomically via upsert + $inc", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 1 });
    await rateLimit("x", 5, 60);
    const [filter, update, options] = findOneAndUpdate.mock.calls[0];
    expect(update.$inc).toEqual({ count: 1 });
    expect(update.$setOnInsert.expiresAt).toBeInstanceOf(Date);
    expect(options).toMatchObject({ upsert: true, new: true });
    expect(filter.key).toMatch(/^x:\d+$/);
  });

  it("retries once when two first-hits race on the upsert", async () => {
    findOneAndUpdate.mockRejectedValueOnce({ code: 11000 }).mockResolvedValueOnce({ count: 2 });
    const r = await rateLimit("x", 5, 60);
    expect(r.ok).toBe(true);
    expect(findOneAndUpdate).toHaveBeenCalledTimes(2);
  });

  it("fails open if the limiter's storage errors", async () => {
    findOneAndUpdate.mockRejectedValue(new Error("db down"));
    expect((await rateLimit("x", 1, 60)).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  const req = (h: Record<string, string>) => new Request("http://x", { headers: h });
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(req({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
  });
  it("falls back to x-real-ip then 'unknown'", () => {
    expect(getClientIp(req({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
    expect(getClientIp(req({}))).toBe("unknown");
  });
});

describe("enforceRateLimit", () => {
  it("throws a 429 ApiError carrying Retry-After", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 50 });
    const request = new Request("http://x", { headers: { "x-forwarded-for": "1.1.1.1" } });
    await expect(enforceRateLimit(request, "lookup", 30, 600)).rejects.toMatchObject({
      status: 429,
      code: "RATE_LIMITED",
      headers: { "Retry-After": expect.stringMatching(/^\d+$/) },
    });
  });
  it("is silent under the limit", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 1 });
    await expect(enforceRateLimit(new Request("http://x"), "lookup", 30, 600)).resolves.toBeUndefined();
  });
});

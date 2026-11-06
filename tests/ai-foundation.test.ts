import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rateLimit = vi.fn();
const findOneAndUpdate = vi.fn();
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/lib/rateLimit", () => ({ rateLimit, getClientIp: () => "1.2.3.4" }));
vi.mock("@/models/RateLimit", () => ({ default: { findOneAndUpdate } }));

const { readAiConfig } = await import("@/lib/ai/config");
const { guardAi, costMicroUsd } = await import("@/lib/ai/guard");
const { complete, streamText } = await import("@/lib/ai/client");
const { assistantActionSchema, chatRequestSchema, searchIntentSchema, planOutputSchema } = await import(
  "@/lib/ai/schemas"
);
const { cleanText, extractJson } = await import("@/lib/ai/text");
const { dateAnchors, manilaToday } = await import("@/lib/ai/dates");
const { policyPrompt, VERIFIED_POLICIES } = await import("@/lib/ai/policies");

const ENV = { AI_API_KEY: "k", AI_MODEL: "m", AI_DAILY_BUDGET: "1" };
const request = new Request("http://x/api/ai/chat", { method: "POST" });

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  Object.assign(process.env, ENV);
  rateLimit.mockResolvedValue({ ok: true, retryAfter: 10, count: 1 });
});
afterEach(() => {
  for (const k of Object.keys(ENV)) delete process.env[k];
  vi.unstubAllGlobals();
});

describe("config", () => {
  it("is off unless key, model AND a positive budget are set", () => {
    expect(readAiConfig({})).toBeNull();
    expect(readAiConfig({ AI_API_KEY: "k", AI_MODEL: "m" })).toBeNull();
    expect(readAiConfig({ AI_API_KEY: "k", AI_MODEL: "m", AI_DAILY_BUDGET: "0" })).toBeNull();
    expect(readAiConfig({ AI_API_KEY: "k", AI_MODEL: "m", AI_DAILY_BUDGET: "abc" })).toBeNull();
    expect(readAiConfig(ENV)?.model).toBe("m");
  });
  it("ignores a malformed support email", () => {
    expect(readAiConfig({ ...ENV, SUPPORT_EMAIL: "nope" })?.supportEmail).toBeNull();
    expect(readAiConfig({ ...ENV, SUPPORT_EMAIL: "help@jetour.test" })?.supportEmail).toBe("help@jetour.test");
  });
});

describe("guardAi", () => {
  const opts = { name: "chat", limit: 5, windowSeconds: 60, maxOutputTokens: 100, inputChars: 300 };

  it("refuses when AI is not configured", async () => {
    delete process.env.AI_API_KEY;
    await expect(guardAi(request, opts)).rejects.toMatchObject({ status: 503, code: "AI_NOT_CONFIGURED" });
    expect(findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 429 when the per-IP limit is exceeded", async () => {
    rateLimit.mockResolvedValueOnce({ ok: false, retryAfter: 30, count: 6 });
    await expect(guardAi(request, opts)).rejects.toMatchObject({ status: 429, code: "RATE_LIMITED" });
  });

  it("fails CLOSED when the limiter storage fails (count 0)", async () => {
    rateLimit.mockResolvedValueOnce({ ok: true, retryAfter: 1, count: 0 });
    await expect(guardAi(request, opts)).rejects.toMatchObject({ status: 503, code: "AI_UNAVAILABLE" });
  });

  it("fails CLOSED when the budget counter cannot be updated", async () => {
    findOneAndUpdate.mockRejectedValue(new Error("db down"));
    await expect(guardAi(request, opts)).rejects.toMatchObject({ status: 503, code: "AI_UNAVAILABLE" });
  });

  it("stops at the daily budget and refunds the reservation", async () => {
    const cfg = readAiConfig(ENV)!;
    const reserve = costMicroUsd(cfg, { inputTokens: 100, outputTokens: 100 });
    findOneAndUpdate.mockResolvedValueOnce({ count: 1_000_000 + 5 }); // over the $1 ceiling
    findOneAndUpdate.mockResolvedValueOnce({ count: 1_000_000 });
    await expect(guardAi(request, opts)).rejects.toMatchObject({ status: 503, code: "AI_BUDGET_EXHAUSTED" });
    expect(findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(findOneAndUpdate.mock.calls[1][1].$inc.count).toBe(-findOneAndUpdate.mock.calls[0][1].$inc.count);
    expect(reserve).toBeGreaterThan(0);
  });

  it("admits under budget and settles to real usage", async () => {
    findOneAndUpdate.mockResolvedValue({ count: 1000 });
    const ticket = await guardAi(request, opts);
    const reserved = findOneAndUpdate.mock.calls[0][1].$inc.count as number;
    await ticket.settle({ inputTokens: 10, outputTokens: 10 });
    const delta = findOneAndUpdate.mock.calls[1][1].$inc.count as number;
    expect(delta).toBe(costMicroUsd(ticket.config, { inputTokens: 10, outputTokens: 10 }) - reserved);
    await ticket.settle(null); // call never finished: full refund
    expect(findOneAndUpdate.mock.calls[2][1].$inc.count).toBe(-reserved);
  });
});

describe("provider client", () => {
  const input = { system: "s", messages: [{ role: "user" as const, content: "hi" }], maxTokens: 50 };

  it("maps a normal reply and usage", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ content: [{ type: "text", text: "hello" }], usage: { input_tokens: 5, output_tokens: 2 } }))
      )
    );
    expect(await complete(input)).toEqual({ text: "hello", usage: { inputTokens: 5, outputTokens: 2 } });
  });

  it("turns provider failures into friendly errors without leaking details", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("secret details", { status: 500 })));
    await expect(complete(input)).rejects.toMatchObject({ status: 502, code: "AI_PROVIDER_ERROR" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("slow down", { status: 429 })));
    await expect(complete(input)).rejects.toMatchObject({ code: "AI_BUSY" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await expect(complete(input)).rejects.toMatchObject({ code: "AI_PROVIDER_ERROR" });
  });

  it("never sends the key anywhere but the provider header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ content: [] })));
    vi.stubGlobal("fetch", fetchMock);
    await complete(input);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(String(init.body)).not.toContain(ENV.AI_API_KEY + '"');
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("k");
  });

  it("parses a streamed reply split across chunks", async () => {
    const sse = [
      'event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":7}}}\n\n',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hel"}}\n\n',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"lo"}}\n\n',
      'data: {"type":"message_delta","usage":{"output_tokens":3}}\n\n',
    ].join("");
    const bytes = new TextEncoder().encode(sse);
    const body = new ReadableStream({
      start(c) {
        c.enqueue(bytes.slice(0, 60)); // cut mid-event on purpose
        c.enqueue(bytes.slice(60));
        c.close();
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body)));
    let text = "";
    let usage;
    for await (const e of streamText(input)) {
      if (e.type === "text") text += e.text;
      else usage = e.usage;
    }
    expect(text).toBe("Hello");
    expect(usage).toEqual({ inputTokens: 7, outputTokens: 3 });
  });
});

describe("schemas", () => {
  it("accepts a good intent and drops nulls", () => {
    const r = searchIntentSchema.parse({
      params: { from: "Manila", to: "CEB", date: "2026-12-05", passengers: "2", maxPrice: 5000, depart: "morning", stops: 0, airline: null },
      clarification: null,
    });
    expect(r.params).toMatchObject({ passengers: 2, maxPrice: 5000, stops: "0" });
    expect(r.params.airline).toBeUndefined();
    expect(r.clarification).toBeUndefined();
  });

  it("rejects invalid model output", () => {
    for (const bad of [
      { params: { passengers: 40 } },
      { params: { date: "next weekend" } },
      { params: { cabin: "First" } },
      { params: { maxPrice: -5 } },
      { params: { depart: "dawn" } },
      "not an object",
    ]) {
      expect(searchIntentSchema.safeParse(bad).success).toBe(false);
    }
  });

  it("only allows the fixed set of assistant actions", () => {
    expect(assistantActionSchema.safeParse({ type: "none" }).success).toBe(true);
    for (const bad of [
      { type: "cancel_booking", reference: "JT-1" },
      { type: "run_query", q: "{}" },
      { type: "search" },
      { type: "plan", query: "x" },
    ]) {
      expect(assistantActionSchema.safeParse(bad).success).toBe(false);
    }
  });

  it("validates chat requests: last turn is the user's, bounded size", () => {
    const u = (content: string) => ({ role: "user" as const, content });
    expect(chatRequestSchema.safeParse({ messages: [u("hi")] }).success).toBe(true);
    expect(chatRequestSchema.safeParse({ messages: [] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ messages: [u("hi"), { role: "assistant", content: "yo" }] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ messages: [u("x".repeat(1201))] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ messages: Array(13).fill(u("hi")) }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ messages: [{ role: "system", content: "hi" }] }).success).toBe(false);
  });

  it("normalises plan airport codes and rejects junk", () => {
    const base = { intro: "", destinations: [{ code: "ceb", why: "w", days: 3, itinerary: [] }] };
    expect(planOutputSchema.parse(base).destinations[0].code).toBe("CEB");
    expect(planOutputSchema.safeParse({ ...base, destinations: [{ ...base.destinations[0], code: "Cebu City" }] }).success).toBe(false);
  });
});

describe("text + dates + policies", () => {
  it("strips control characters and caps length", () => {
    expect(cleanText("a\u0000b\u0007c   d", 100)).toBe("abc d");
    expect(cleanText("x".repeat(50), 10)).toHaveLength(10);
  });
  it("extracts JSON from fenced or chatty replies, and gives up safely", () => {
    expect(extractJson('Sure!\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extractJson("no json here")).toBeUndefined();
    expect(extractJson("{broken")).toBeUndefined();
  });
  it("computes calendar anchors in Manila time", () => {
    // 2026-11-05 is a Thursday.
    const a = dateAnchors("2026-11-05");
    expect(a).toMatchObject({ weekday: "Thursday", tomorrow: "2026-11-06", thisComingSaturday: "2026-11-07", saturdayAfterThat: "2026-11-14", nextMonday: "2026-11-09" });
    // 23:00 UTC on the 4th is already the 5th in Manila (UTC+8).
    expect(manilaToday(new Date("2026-11-04T23:00:00Z"))).toBe("2026-11-05");
  });
  it("on a Saturday, 'this coming Saturday' is a week away", () => {
    expect(dateAnchors("2026-11-07").thisComingSaturday).toBe("2026-11-14");
  });
  it("policy prompt contains the verified FAQ and the unverified-topic list", () => {
    const p = policyPrompt();
    expect(p).toContain("How do I pay?");
    expect(p).toContain("NOT VERIFIED");
    expect(p).toMatch(/refund/i);
    expect(VERIFIED_POLICIES.length).toBeGreaterThan(6);
  });
});

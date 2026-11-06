import { ApiError } from "@/lib/api/response";
import { connectDB } from "@/lib/mongodb";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import RateLimit from "@/models/RateLimit";

import type { Usage } from "./client";
import { readAiConfig, type AiConfig } from "./config";

/* Every AI route goes through guardAi() BEFORE any model call. Unlike the booking limiter, which
   fails open so a storage blip can't take the site down, these limits fail CLOSED: if we can't
   count, we don't spend. */

const MICRO = 1_000_000;
const PER_IP_PER_DAY = 150;

export function costMicroUsd(config: AiConfig, usage: Usage): number {
  return Math.ceil(
    ((usage.inputTokens * config.priceInPerMTok + usage.outputTokens * config.priceOutPerMTok) / 1_000_000) * MICRO
  );
}

/** Rough input size; real usage replaces the estimate in settle(). */
export const estimateTokens = (chars: number) => Math.ceil(chars / 3);

async function addSpend(key: string, micro: number, expiresAt: Date): Promise<number> {
  const hit = () =>
    RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: micro }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true }
    );
  try {
    return Number((await hit())?.count ?? 0);
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
    return Number((await hit())?.count ?? 0);
  }
}

export type AiTicket = {
  config: AiConfig;
  /** Reconcile the reservation with real usage (null = the call never completed: refund it). */
  settle: (usage: Usage | null) => Promise<void>;
};

export type GuardOptions = {
  /** Endpoint name, used as the rate-limit bucket. */
  name: string;
  limit: number;
  windowSeconds: number;
  maxOutputTokens: number;
  /** Total characters that will be sent to the model (system + messages). */
  inputChars: number;
  now?: Date;
};

export async function guardAi(request: Request, opts: GuardOptions): Promise<AiTicket> {
  const config = readAiConfig();
  if (!config) {
    throw new ApiError(503, "AI_NOT_CONFIGURED", "The AI assistant isn't set up yet.", {
      supportEmail: process.env.SUPPORT_EMAIL?.trim() || null,
    });
  }
  const supportEmail = config.supportEmail;
  const unavailable = () =>
    new ApiError(503, "AI_UNAVAILABLE", "The AI assistant is unavailable right now.", { supportEmail });

  const ip = getClientIp(request);
  for (const [bucket, limit, window] of [
    [`ai-${opts.name}:${ip}`, opts.limit, opts.windowSeconds],
    [`ai-day:${ip}`, PER_IP_PER_DAY, 86_400],
  ] as const) {
    const r = await rateLimit(bucket, limit, window);
    if (r.count === 0) throw unavailable(); // limiter storage failed: fail closed
    if (!r.ok) {
      throw new ApiError(
        429,
        "RATE_LIMITED",
        "You're sending requests too quickly. Please wait a moment.",
        { supportEmail },
        { "Retry-After": String(r.retryAfter) }
      );
    }
  }

  const now = opts.now ?? new Date();
  const key = `ai-spend:${now.toISOString().slice(0, 10)}`;
  const expiresAt = new Date(now.getTime() + 2 * 86_400_000);
  const reserve = costMicroUsd(config, {
    inputTokens: estimateTokens(opts.inputChars),
    outputTokens: opts.maxOutputTokens,
  });
  const ceiling = Math.round(config.dailyBudgetUsd * MICRO);

  let total: number;
  try {
    await connectDB();
    total = await addSpend(key, reserve, expiresAt);
  } catch (error) {
    console.error("AI_BUDGET_ERROR (failing closed):", error);
    throw unavailable();
  }
  if (total > ceiling) {
    await addSpend(key, -reserve, expiresAt).catch(() => undefined);
    throw new ApiError(
      503,
      "AI_BUDGET_EXHAUSTED",
      "The AI assistant has reached its daily limit. Please try again tomorrow.",
      { supportEmail }
    );
  }

  return {
    config,
    settle: async (usage) => {
      const delta = (usage ? costMicroUsd(config, usage) : 0) - reserve;
      if (delta === 0) return;
      try {
        await addSpend(key, delta, expiresAt);
      } catch (error) {
        console.error("AI_BUDGET_SETTLE_ERROR:", error);
      }
    },
  };
}

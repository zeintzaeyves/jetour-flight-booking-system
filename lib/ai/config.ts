export type AiConfig = {
  /** "anthropic" = Anthropic Messages API. "openai" = any OpenAI-compatible endpoint (Groq, Gemini, OpenRouter...). */
  provider: "anthropic" | "openai";
  apiKey: string;
  model: string;
  baseUrl: string;
  /** Hard daily ceiling, USD. */
  dailyBudgetUsd: number;
  /** USD per million tokens, used only to estimate spend. */
  priceInPerMTok: number;
  priceOutPerMTok: number;
  /** Where "talk to a human" points; null means it is not set up. */
  supportEmail: string | null;
};

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return v && Number.isFinite(n) && n >= 0 ? n : fallback;
};

/**
 * Read at request time (never at import), so a missing variable can't break a build.
 * Returns null unless the key, model AND a positive budget are all set: no budget means no AI.
 */
export function readAiConfig(env: Record<string, string | undefined> = process.env): AiConfig | null {
  const apiKey = env.AI_API_KEY?.trim();
  const model = env.AI_MODEL?.trim();
  const dailyBudgetUsd = num(env.AI_DAILY_BUDGET?.trim(), 0);
  if (!apiKey || !model || dailyBudgetUsd <= 0) return null;
  const support = env.SUPPORT_EMAIL?.trim();
  const provider = env.AI_PROVIDER?.trim().toLowerCase() === "openai" ? "openai" : "anthropic";
  // An OpenAI-compatible provider has no sensible default endpoint: require it.
  if (provider === "openai" && !env.AI_BASE_URL?.trim()) return null;
  return {
    provider,
    apiKey,
    model,
    baseUrl: (env.AI_BASE_URL?.trim() || "https://api.anthropic.com").replace(/\/+$/, ""),
    dailyBudgetUsd,
    // Deliberately conservative defaults so an unset price over-estimates spend.
    priceInPerMTok: num(env.AI_PRICE_IN_PER_MTOK?.trim(), 5),
    priceOutPerMTok: num(env.AI_PRICE_OUT_PER_MTOK?.trim(), 25),
    supportEmail: support && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(support) ? support : null,
  };
}

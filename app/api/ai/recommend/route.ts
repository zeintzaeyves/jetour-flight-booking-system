import { ApiError, handleError, ok } from "@/lib/api/response";
import { buildExplainSystem, explainPicks, prefsFromParams, rankFlights } from "@/lib/ai/recommend";
import { guardAi } from "@/lib/ai/guard";
import { readBody } from "@/lib/ai/http";
import { recommendRequestSchema } from "@/lib/ai/schemas";
import { legParams, parseSearchParams } from "@/lib/flights/search";
import { runSearch } from "@/lib/flights/service";

export const maxDuration = 30;

/**
 * POST { params, preferences? } -> ranked picks from the real search results.
 * Ranking is deterministic and works without AI; the model only improves the wording.
 */
export async function POST(request: Request) {
  try {
    const body = await readBody(request, recommendRequestSchema);
    const requested = parseSearchParams(body.params);
    const active = legParams(requested);
    const { results } = await runSearch(active);

    const picks = rankFlights(results, prefsFromParams(active));
    const plain = picks.map((p) => ({ ...p, reason: `${p.facts.join(". ")}.`, explained: false }));
    const base = { total: results.length, passengers: active.passengers, aiAvailable: false };
    if (picks.length === 0) return ok({ ...base, picks: plain });

    let ticket;
    try {
      ticket = await guardAi(request, {
        name: "recommend",
        limit: 15,
        windowSeconds: 600,
        maxOutputTokens: 600,
        inputChars: buildExplainSystem().length + JSON.stringify(picks).length + (body.preferences?.length ?? 0),
      });
    } catch (error) {
      // No AI (off, rate limited, over budget): the ranked picks are still useful.
      if (error instanceof ApiError) return ok({ ...base, picks: plain });
      throw error;
    }
    let usage = null;
    try {
      const out = await explainPicks(picks, body.preferences, ticket.config);
      usage = out.usage;
      return ok({ ...base, aiAvailable: out.usage !== null, picks: out.picks });
    } finally {
      await ticket.settle(usage);
    }
  } catch (error) {
    return handleError(error, "AI_RECOMMEND_ERROR");
  }
}

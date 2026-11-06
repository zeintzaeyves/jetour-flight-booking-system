import { handleError, ok } from "@/lib/api/response";
import { manilaToday } from "@/lib/ai/dates";
import { guardAi } from "@/lib/ai/guard";
import { readBody } from "@/lib/ai/http";
import { buildSearchSystem, interpretSearch } from "@/lib/ai/nlSearch";
import { nlSearchRequestSchema } from "@/lib/ai/schemas";
import { toQueryString } from "@/lib/flights/search";
import { getNetworkSummary, runSearch } from "@/lib/flights/service";

export const maxDuration = 30;

/** POST { query } -> the interpreted search plus a real preview from the existing search code. */
export async function POST(request: Request) {
  try {
    const { query } = await readBody(request, nlSearchRequestSchema);
    const network = await getNetworkSummary();
    const airports = [...new Map([...network.origins, ...network.destinations].map((a) => [a.code, a])).values()];
    const today = manilaToday();

    const ticket = await guardAi(request, {
      name: "search",
      limit: 20,
      windowSeconds: 600,
      maxOutputTokens: 350,
      inputChars: buildSearchSystem(airports, today).length + query.length,
    });
    let usage = null;
    try {
      const out = await interpretSearch(query, airports, today, ticket.config);
      usage = out.usage;
      const { params, notes, question } = out.result;

      // The AI only produced parameters. Every flight below comes from the existing search.
      let count: number | null = null;
      let preview: Awaited<ReturnType<typeof runSearch>>["results"] = [];
      try {
        const found = await runSearch(params);
        count = found.results.length;
        preview = found.results.slice(0, 3);
      } catch (error) {
        console.error("AI_SEARCH_PREVIEW_ERROR:", error);
      }
      return ok({ params, queryString: toQueryString(params), notes, question, count, preview, airports });
    } finally {
      await ticket.settle(usage);
    }
  } catch (error) {
    return handleError(error, "AI_SEARCH_ERROR");
  }
}

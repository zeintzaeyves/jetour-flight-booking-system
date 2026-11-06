import { resolveIntent, type Airport } from "./nlSearch";
import { fallbackReason, prefsFromParams, rankFlights } from "./recommend";
import type { AssistantAction } from "./schemas";
import { toQueryString } from "@/lib/flights/search";
import { runSearch } from "@/lib/flights/service";
import type { Flight } from "@/types/flight";

export type ClientAction =
  | {
      type: "cards";
      href: string;
      count: number | null;
      notes: string[];
      question: string | null;
      passengers: number;
      picks: { flight: Flight; labels: string[]; reason: string }[];
    }
  | { type: "lookup" }
  | { type: "escalate"; reason: string | null; supportEmail: string | null }
  | { type: "plan"; query: string };

/**
 * Turns a model-requested action into something the browser can render. Searching goes through the
 * same validation and the same search code as the flights page: the model only supplies parameters.
 */
export async function resolveAction(
  action: AssistantAction,
  ctx: { airports: Airport[]; today: string; supportEmail: string | null }
): Promise<ClientAction | null> {
  switch (action.type) {
    case "none":
      return null;
    case "lookup_booking":
      return { type: "lookup" };
    case "plan":
      return { type: "plan", query: action.query };
    case "escalate":
      return { type: "escalate", reason: action.reason ?? null, supportEmail: ctx.supportEmail };
    case "search": {
      const { params, notes, question } = resolveIntent(action.params, ctx.airports, ctx.today);
      const href = `/flights?${toQueryString(params)}`;
      const base = { type: "cards" as const, href, notes, question, passengers: params.passengers };
      if (!params.from && !params.to) return { ...base, count: null, picks: [] };
      try {
        const { results } = await runSearch(params);
        const picks = rankFlights(results, prefsFromParams(params)).slice(0, 3);
        return {
          ...base,
          count: results.length,
          picks: picks.map((p) => ({ flight: p.flight, labels: p.labels, reason: fallbackReason(p) })),
        };
      } catch (error) {
        console.error("AI_CHAT_SEARCH_ERROR:", error);
        return { ...base, count: null, picks: [] };
      }
    }
  }
}

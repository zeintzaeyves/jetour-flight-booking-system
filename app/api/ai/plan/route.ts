import { handleError, ok } from "@/lib/api/response";
import { manilaToday } from "@/lib/ai/dates";
import { guardAi } from "@/lib/ai/guard";
import { readBody } from "@/lib/ai/http";
import { buildPlannerSystem, planTrip } from "@/lib/ai/planner";
import { buildRouteCatalog } from "@/lib/ai/routes";
import { planRequestSchema } from "@/lib/ai/schemas";
import { getBookableFlights } from "@/lib/flights/service";

export const maxDuration = 45;

/** POST { query } -> destinations and a day-by-day idea list, tied to real Jetour flights. */
export async function POST(request: Request) {
  try {
    const { query } = await readBody(request, planRequestSchema);
    const today = manilaToday();
    const flights = await getBookableFlights();
    const catalog = buildRouteCatalog(flights, today);

    const ticket = await guardAi(request, {
      name: "plan",
      limit: 10,
      windowSeconds: 600,
      maxOutputTokens: 1400,
      inputChars: buildPlannerSystem(catalog, today).length + query.length,
    });
    let usage = null;
    try {
      const out = await planTrip(query, catalog, flights, today, ticket.config);
      usage = out.usage;
      return ok(out.plan);
    } finally {
      await ticket.settle(usage);
    }
  } catch (error) {
    return handleError(error, "AI_PLAN_ERROR");
  }
}

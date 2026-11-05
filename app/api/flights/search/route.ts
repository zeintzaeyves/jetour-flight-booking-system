import { handleError, ok } from "@/lib/api/response";
import { runSearch } from "@/lib/flights/service";
import { legParams, parseSearchParams } from "@/lib/flights/search";

// Public, read-only. Invalid query values fall back to defaults.
export async function GET(request: Request) {
  try {
    const params = legParams(
      parseSearchParams(new URL(request.url).searchParams)
    );
    const { results, facets } = await runSearch(params);
    return ok({ params, results, facets });
  } catch (error) {
    return handleError(error, "SEARCH_FLIGHTS_ERROR");
  }
}

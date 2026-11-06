import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, TriangleAlert } from "lucide-react";

import AiPicks from "@/components/ai/AiPicks";
import NlSearchBar from "@/components/ai/NlSearchBar";
import FilterPanel from "@/components/flights/FilterPanel";
import FlightCard from "@/components/flights/FlightCard";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import FlightSearchForm from "@/components/search/FlightSearchForm";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/format";
import {
  SORTS,
  legParams,
  parseSearchParams,
  toQueryString,
  type SearchParams,
  type SearchResult,
} from "@/lib/flights/search";
import { getNetworkSummary, runSearch } from "@/lib/flights/service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Flights" };

const SORT_LABELS: Record<(typeof SORTS)[number], string> = {
  price: "Cheapest",
  departure: "Earliest",
  duration: "Fastest",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const FILTER_KEYS = ["maxPrice", "stops", "airline", "depart"] as const;

export default async function FlightsPage({ searchParams }: PageProps) {
  const requested = parseSearchParams(await searchParams);
  const active = legParams(requested);
  const href = (o: Partial<SearchParams>) =>
    `/flights?${toQueryString({ ...requested, ...o })}`;

  const [network, search] = await Promise.all([
    getNetworkSummary(),
    runSearch(active).then(
      (r): { ok: true; data: SearchResult } => ({ ok: true, data: r }),
      (error): { ok: false; detail: string } => {
        console.error("FLIGHTS_PAGE_SEARCH_ERROR:", error);
        return {
          ok: false,
          detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        };
      }
    ),
  ]);

  const airports = [
    ...new Map(
      [...network.origins, ...network.destinations].map((a) => [a.code, a])
    ).values(),
  ].sort((a, b) => a.city.localeCompare(b.city));

  const round = requested.trip === "round";
  const hasFilters = FILTER_KEYS.some((k) => requested[k] !== undefined);
  const routeTitle =
    active.from && active.to ? `${active.from} → ${active.to}` : "All flights";

  return (
    <>
      <main className="min-h-screen bg-surface pb-20 pt-24">
        <Container className="space-y-6">
          <NlSearchBar />
          {/* Mobile: collapsed summary so results are visible without scrolling. */}
          <details className="group rounded-[1.75rem] border border-border bg-card shadow-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 truncate">
                <span className="font-medium">{routeTitle}</span>
                <span className="text-muted-foreground">
                  {active.date ? ` · ${formatDateShort(active.date)}` : ""}
                  {` · ${requested.passengers} pax`}
                </span>
              </span>
              <span className="shrink-0 font-medium text-brand-ink group-open:hidden">Modify</span>
              <span className="hidden shrink-0 font-medium text-brand-ink group-open:inline">Close</span>
            </summary>
            <div className="border-t border-border p-2">
              <FlightSearchForm
                variant="compact"
                className="border-0 shadow-none"
                airports={airports}
                initial={{
                  trip: requested.trip,
                  from: requested.from ?? "",
                  to: requested.to ?? "",
                  date: requested.date ?? "",
                  returnDate: requested.return ?? "",
                  passengers: requested.passengers,
                  cabin: requested.cabin ?? "",
                }}
              />
            </div>
          </details>
          <div className="hidden lg:block">
            <FlightSearchForm
              variant="compact"
              airports={airports}
              initial={{
                trip: requested.trip,
                from: requested.from ?? "",
                to: requested.to ?? "",
                date: requested.date ?? "",
                returnDate: requested.return ?? "",
                passengers: requested.passengers,
                cabin: requested.cabin ?? "",
              }}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-headline">{routeTitle}</h1>
              <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
                {search.ok
                  ? `${search.data.results.length} flight${search.data.results.length === 1 ? "" : "s"}`
                  : "Flights unavailable"}
                {active.date ? ` · ${formatDateShort(active.date)}` : ""}
                {` · ${requested.passengers} passenger${requested.passengers === 1 ? "" : "s"}`}
              </p>
            </div>

            <nav aria-label="Sort flights" className="flex gap-1 rounded-xl bg-muted p-1">
              {SORTS.map((s) => (
                <Link
                  key={s}
                  href={href({ sort: s })}
                  replace
                  scroll={false}
                  aria-current={requested.sort === s ? "true" : undefined}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                    requested.sort === s && "bg-card text-foreground shadow-xs"
                  )}
                >
                  {SORT_LABELS[s]}
                </Link>
              ))}
            </nav>
          </div>

          {round ? (
            <div>
              <nav aria-label="Trip leg" className="flex gap-1 border-b border-border">
                {(
                  [
                    ["out", "Outbound", requested.from, requested.to],
                    ["ret", "Return", requested.to, requested.from],
                  ] as const
                ).map(([leg, label, a, b]) => (
                  <Link
                    key={leg}
                    href={href({ leg })}
                    aria-current={requested.leg === leg ? "page" : undefined}
                    className={cn(
                      "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                      requested.leg === leg
                        ? "border-brand text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                    {a && b ? ` · ${a} → ${b}` : ""}
                  </Link>
                ))}
              </nav>
              <p className="mt-3 text-sm text-muted-foreground">
                Each leg is reserved as a separate booking.
              </p>
            </div>
          ) : null}

          {!search.ok ? (
            <Panel
              icon={<TriangleAlert className="size-5 text-warning-ink" aria-hidden />}
              title="We couldn't load flights"
              body="Something went wrong on our side. Your search is saved. Try again in a moment."
            >
              <Button asChild>
                <Link href={href({})}>Try again</Link>
              </Button>
              {/* Development only: show the real cause. Never rendered in production. */}
              {process.env.NODE_ENV !== "production" ? (
                <pre
                  data-testid="dev-error-detail"
                  className="mx-auto mt-6 max-w-2xl overflow-x-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-left text-xs text-danger-ink"
                >
                  {search.detail}
                </pre>
              ) : null}
            </Panel>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
              <FilterPanel params={requested} facets={search.data.facets} />

              <section aria-label="Flight results" className="min-w-0 space-y-4">
                {search.data.results.length === 0 ? (
                  <Panel
                    icon={<SearchX className="size-5 text-muted-foreground" aria-hidden />}
                    title="No flights found"
                    body={
                      hasFilters && search.data.facets.count > 0
                        ? "Your filters are hiding every flight for this search."
                        : "Nothing matches this route and date yet. Try nearby dates, another cabin, or fewer passengers."
                    }
                  >
                    <div className="flex flex-wrap justify-center gap-2">
                      {hasFilters ? (
                        <Button asChild>
                          <Link
                            href={href({
                              maxPrice: undefined,
                              stops: undefined,
                              airline: undefined,
                              depart: undefined,
                            })}
                          >
                            Clear filters
                          </Link>
                        </Button>
                      ) : null}
                      {requested.date ? (
                        <Button asChild variant="outline">
                          <Link href={href({ date: undefined, return: undefined })}>
                            Show all dates
                          </Link>
                        </Button>
                      ) : null}
                      <Button asChild variant="outline">
                        <Link href="/flights">Reset search</Link>
                      </Button>
                    </div>
                  </Panel>
                ) : (
                  <>
                    {search.data.results.length > 1 ? <AiPicks queryString={toQueryString(requested)} /> : null}
                    {search.data.results.map((f) => (
                      <FlightCard key={f._id} flight={f} passengers={requested.passengers} />
                    ))}
                  </>
                )}
              </section>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Panel({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h2 className="text-title">{title}</h2>
      <p className="mx-auto mt-2 mb-6 max-w-md text-sm leading-6 text-muted-foreground">
        {body}
      </p>
      {children}
    </div>
  );
}

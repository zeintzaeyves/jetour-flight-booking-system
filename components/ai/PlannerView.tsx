"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, Loader2 } from "lucide-react";

import { AiClientError, UNAVAILABLE_CODES, postAi } from "@/components/ai/api";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/ai/planner";
import { normalizeDate } from "@/lib/flights/search";
import { formatDateShort, formatPeso, formatTime12 } from "@/lib/format";
import type { Flight } from "@/types/flight";

export const PLAN_PROMPTS = [
  "Plan a 3-day trip to Cebu",
  "Where can I travel with a ₱10,000 budget?",
  "Suggest affordable destinations from Manila",
  "Plan a weekend getaway for two people",
];

function FlightLine({ label, f }: { label: string; f: Flight }) {
  const d = normalizeDate(f.departureDate);
  return (
    <div className="min-w-0 text-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">
        {f.originCode} → {f.destinationCode} · {formatPeso(f.price)}
      </p>
      <p className="truncate text-xs tabular-nums text-muted-foreground">
        {f.flightNo} · {d ? formatDateShort(d) : f.departureDate} · {formatTime12(f.departureTime)}
      </p>
    </div>
  );
}

export default function PlannerView({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AiClientError | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const auto = useRef(false);

  async function run(text: string) {
    const q = text.trim();
    if (q.length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      setPlan(await postAi<Plan>("/api/ai/plan", { query: q }));
    } catch (e) {
      setError(e instanceof AiClientError ? e : new AiClientError("UNKNOWN", "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  // A prompt handed over from the chat ("Plan this trip") runs once on arrival.
  useEffect(() => {
    if (initialQuery && !auto.current) {
      auto.current = true;
      void run(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="plan-q" className="sr-only">What kind of trip do you want?</label>
        <input
          id="plan-q"
          value={query}
          maxLength={400}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Plan a 3-day trip to Cebu under ₱8,000"
          className="h-12 min-w-0 flex-1 rounded-full border border-input bg-white/10 px-5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
        />
        <Button type="submit" variant="brand" size="lg" disabled={busy || query.trim().length < 3}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {busy ? "Planning…" : "Plan my trip"}
        </Button>
      </form>

      {!plan && !busy && !error ? (
        <div className="flex flex-wrap gap-2">
          {PLAN_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setQuery(p);
                void run(p);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      ) : null}

      <div aria-live="polite" className="space-y-5">
        {busy ? <p className="text-sm text-muted-foreground">Checking Jetour&apos;s routes and fares…</p> : null}
        {error ? (
          <p role="alert" className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            {error.message}
            {UNAVAILABLE_CODES.has(error.code) ? (
              <>
                {" "}
                You can still browse <Link href="/flights" className="text-brand-ink underline-offset-4 hover:underline">all flights</Link>.
              </>
            ) : null}
          </p>
        ) : null}

        {plan ? (
          <>
            <p className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-muted-foreground">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              These are suggestions, not reservations. Flights and fares come from Jetour&apos;s records; itinerary ideas are general and not verified by Jetour. Nothing is booked until you confirm a flight.
            </p>
            {plan.intro ? <p className="text-base">{plan.intro}</p> : null}
            {plan.notes.map((n) => (
              <p key={n} className="text-sm text-warning-ink">{n}</p>
            ))}
            {plan.question ? <p className="text-sm font-medium">{plan.question}</p> : null}

            <div className="grid gap-4 lg:grid-cols-2">
              {plan.destinations.map((d) => (
                <article key={d.code} className="rounded-[1.75rem] border border-white/10 bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-title">{d.city}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{d.days}-day idea</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold tabular-nums">{formatPeso(d.estimatedFare)}</p>
                      <p className="text-xs text-muted-foreground">{d.inbound ? "round trip, per person" : "one way, per person"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6">{d.why}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <FlightLine label="Outbound" f={d.outbound} />
                    {d.inbound ? <FlightLine label="Return" f={d.inbound} /> : <p className="self-center text-xs text-muted-foreground">No return flight found.</p>}
                  </div>

                  {d.itinerary.length ? (
                    <details className="group mt-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
                        Suggested itinerary
                        <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <ol className="mt-3 space-y-3 text-sm">
                        {d.itinerary.map((day, i) => (
                          <li key={`${day.title}-${i}`}>
                            <p className="font-medium">Day {i + 1} · {day.title}</p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                              {day.ideas.map((idea) => (
                                <li key={idea}>{idea}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-3 text-xs text-muted-foreground">Ideas only. Check opening hours and prices yourself.</p>
                    </details>
                  ) : null}

                  <Button asChild variant="brand" size="sm" className="mt-5">
                    <Link href={d.href}>
                      See these flights <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

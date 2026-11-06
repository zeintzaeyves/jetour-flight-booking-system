"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { AiClientError, postAi } from "@/components/ai/api";
import RecommendationCard from "@/components/ai/RecommendationCard";
import { Button } from "@/components/ui/button";
import type { Flight } from "@/types/flight";

type Result = {
  total: number;
  passengers: number;
  aiAvailable: boolean;
  picks: { flight: Flight; labels: string[]; reason: string; explained: boolean }[];
};

/** On-demand picks for the search on screen (nothing is sent to the AI until the button is pressed). */
export default function AiPicks({ queryString }: { queryString: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [prefs, setPrefs] = useState("");

  async function load() {
    setBusy(true);
    setError(null);
    try {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      setResult(await postAi<Result>("/api/ai/recommend", { params, preferences: prefs.trim() || undefined }));
    } catch (e) {
      setError(e instanceof AiClientError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Recommended flights" className="rounded-[1.75rem] border border-white/10 bg-card p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title flex items-center gap-2">
            Picks for this search
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked from the flights below by fare, travel time and departure time.
          </p>
        </div>
        <Button type="button" variant={result ? "outline" : "brand"} size="sm" onClick={load} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {busy ? "Comparing…" : result ? "Refresh" : "Show picks"}
        </Button>
      </div>

      {!result ? (
        <input
          aria-label="Anything we should weigh? (optional)"
          placeholder="Anything to weigh? e.g. I'd rather not leave too early"
          value={prefs}
          maxLength={300}
          onChange={(e) => setPrefs(e.target.value)}
          className="mt-4 h-10 w-full rounded-full border border-input bg-white/10 px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      ) : null}

      <div aria-live="polite">
        {error ? <p role="alert" className="mt-4 text-sm text-muted-foreground">{error}</p> : null}
        {result ? (
          <>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.picks.map((p) => (
                <RecommendationCard key={p.flight.flightNo} flight={p.flight} labels={p.labels} reason={p.reason} passengers={result.passengers} />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Compared across {result.total} available flight{result.total === 1 ? "" : "s"}.
              {result.aiAvailable ? "" : " Explanations are generated from the flight data."}
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}

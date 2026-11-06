"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { AiClientError, postAi } from "@/components/ai/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectMenu } from "@/components/ui/select-menu";
import { CABINS, TIME_BUCKETS, toQueryString, type SearchParams } from "@/lib/flights/search";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";

type Airport = { code: string; city: string };
type Interpreted = {
  params: SearchParams;
  notes: string[];
  question: string | null;
  count: number | null;
  airports: Airport[];
};

const EXAMPLES = [
  "Cheapest flight from Manila to Cebu next weekend",
  "Morning flight for two to Singapore under ₱9,000",
  "Davao to Manila, evening, nonstop",
];

const field = "space-y-1.5";

/** Describe a trip in plain words; check and edit what was understood; then search for real. */
export default function NlSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AiClientError | null>(null);
  const [draft, setDraft] = useState<SearchParams | null>(null);
  const [info, setInfo] = useState<Omit<Interpreted, "params"> | null>(null);
  const abort = useRef<AbortController | null>(null);

  async function interpret(text: string) {
    const q = text.trim();
    if (q.length < 3 || busy) return;
    abort.current?.abort();
    abort.current = new AbortController();
    setBusy(true);
    setError(null);
    try {
      const data = await postAi<Interpreted>("/api/ai/search", { query: q }, abort.current.signal);
      setDraft(data.params);
      setInfo({ notes: data.notes, question: data.question, count: data.count, airports: data.airports });
    } catch (e) {
      if (e instanceof DOMException) return;
      setError(e instanceof AiClientError ? e : new AiClientError("UNKNOWN", "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  const set = <K extends keyof SearchParams>(key: K, value: SearchParams[K] | undefined) =>
    setDraft((d) => (d ? { ...d, [key]: value === ("" as never) ? undefined : value } : d));

  function go() {
    if (!draft) return;
    const p = { ...draft, trip: draft.return ? ("round" as const) : ("oneway" as const) };
    router.push(`/flights?${toQueryString(p)}`);
  }

  const airports = info?.airports ?? [];

  return (
    <section
      aria-label="Describe your trip"
      className={cn("rounded-[1.75rem] border border-white/10 bg-card p-4 shadow-card sm:p-5", className)}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void interpret(query);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative min-w-0 flex-1">
          <Input
            aria-label="Describe your trip in your own words"
            placeholder="Describe your trip, e.g. cheapest flight to Cebu next weekend"
            value={query}
            maxLength={400}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button type="submit" variant="brand" size="lg" disabled={busy || query.trim().length < 3}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {busy ? "Reading…" : "Find flights"}
        </Button>
      </form>

      {!draft && !error ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuery(ex);
                void interpret(ex);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
      ) : null}

      <div aria-live="polite">
        {error ? (
          <p role="alert" className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-muted-foreground">
            {error.message} You can still use the search form below.
          </p>
        ) : null}

        {draft && info ? (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-sm text-muted-foreground">
              Here&apos;s what I understood. Adjust anything, then search. Results come from Jetour&apos;s live flights.
            </p>

            {info.notes.map((n) => (
              <p key={n} className="rounded-2xl border border-warning/30 bg-warning/10 px-3.5 py-2.5 text-sm text-warning-ink">
                {n}
              </p>
            ))}
            {info.question ? <p className="text-sm font-medium">{info.question}</p> : null}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["from", "From"],
                  ["to", "To"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={field}>
                  <Label htmlFor={`${id}-${key}`}>{label}</Label>
                  <SelectMenu
                    id={`${id}-${key}`}
                    value={draft[key] ?? ""}
                    onChange={(v) => set(key, v || undefined)}
                    placeholder="Anywhere"
                    options={[{ value: "", label: "Anywhere" }, ...airports.map((a) => ({ value: a.code, label: `${a.city} (${a.code})` }))]}
                  />
                </div>
              ))}
              <div className={field}>
                <Label htmlFor={`${id}-date`}>Depart</Label>
                <DatePicker id={`${id}-date`} min="today" value={draft.date ?? ""} onChange={(v) => set("date", v || undefined)} />
              </div>
              <div className={field}>
                <Label htmlFor={`${id}-return`}>Return (optional)</Label>
                <DatePicker id={`${id}-return`} min={draft.date || "today"} placeholder="Optional" value={draft.return ?? ""} onChange={(v) => set("return", v || undefined)} />
              </div>
              <div className={field}>
                <Label htmlFor={`${id}-pax`}>Passengers</Label>
                <SelectMenu
                  id={`${id}-pax`}
                  value={String(draft.passengers)}
                  onChange={(v) => set("passengers", Number(v))}
                  options={Array.from({ length: 9 }, (_, i) => i + 1).map((n) => ({ value: String(n), label: String(n) }))}
                />
              </div>
              <div className={field}>
                <Label htmlFor={`${id}-cabin`}>Cabin</Label>
                <SelectMenu
                  id={`${id}-cabin`}
                  value={draft.cabin ?? ""}
                  onChange={(v) => set("cabin", (v || undefined) as SearchParams["cabin"])}
                  options={[{ value: "", label: "Any" }, ...CABINS.map((c) => ({ value: c, label: c }))]}
                />
              </div>
              <div className={field}>
                <Label htmlFor={`${id}-time`}>Departure time</Label>
                <SelectMenu
                  id={`${id}-time`}
                  value={draft.depart ?? ""}
                  onChange={(v) => set("depart", (v || undefined) as SearchParams["depart"])}
                  options={[{ value: "", label: "Any time" }, ...TIME_BUCKETS.map((t) => ({ value: t, label: t[0].toUpperCase() + t.slice(1) }))]}
                />
              </div>
              <div className={field}>
                <Label htmlFor={`${id}-max`}>Max fare (₱)</Label>
                <Input id={`${id}-max`} type="number" inputMode="numeric" min={1} value={draft.maxPrice ?? ""} onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {info.count === null
                  ? "Couldn't check availability right now."
                  : info.count === 0
                    ? "No flights match this yet. Adjust it, or search anyway to see nearby options."
                    : `${info.count} matching flight${info.count === 1 ? "" : "s"} at the moment${
                        draft.maxPrice ? ` under ${formatPeso(draft.maxPrice)}` : ""
                      }.`}
              </p>
              <Button type="button" variant="brand" onClick={go}>
                Search flights <ArrowRight aria-hidden />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

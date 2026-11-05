import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { formatPeso } from "@/lib/format";
import {
  TIME_BUCKETS,
  pricePresets,
  toQueryString,
  type Facets,
  type SearchParams,
} from "@/lib/flights/search";
import { cn } from "@/lib/utils";

const TIME_LABELS: Record<(typeof TIME_BUCKETS)[number], string> = {
  morning: "Morning (5am–12pm)",
  afternoon: "Afternoon (12–6pm)",
  evening: "Evening (6pm–12am)",
  night: "Night (12–5am)",
};

type Overrides = Partial<Record<keyof SearchParams, unknown>>;

function Option({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      replace
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
        active ? "bg-brand-soft font-medium text-brand-ink" : "text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

/** Server-rendered filters: every option is a link, so results are shareable and need no client state. */
export default function FilterPanel({
  params,
  facets,
}: {
  params: SearchParams;
  facets: Facets;
}) {
  const href = (o: Overrides) =>
    `/flights?${toQueryString({ ...params, ...(o as Partial<SearchParams>) })}`;
  const presets = pricePresets(facets.minPrice, facets.maxPrice);
  const activeCount = [params.maxPrice, params.stops, params.airline, params.depart].filter(
    (v) => v !== undefined
  ).length;

  const body = (
    <div className="space-y-6">
      <section aria-labelledby="f-stops">
        <h2 id="f-stops" className="text-eyebrow mb-2 px-3 text-muted-foreground">Stops</h2>
        <Option href={href({ stops: undefined })} active={!params.stops}>Any</Option>
        <Option href={href({ stops: "0" })} active={params.stops === "0"}>Nonstop</Option>
        <Option href={href({ stops: "1" })} active={params.stops === "1"}>1 or more stops</Option>
      </section>

      {presets.length > 0 || params.maxPrice ? (
        <section aria-labelledby="f-price">
          <h2 id="f-price" className="text-eyebrow mb-2 px-3 text-muted-foreground">Price per passenger</h2>
          <Option href={href({ maxPrice: undefined })} active={!params.maxPrice}>Any price</Option>
          {presets.map((p) => (
            <Option key={p} href={href({ maxPrice: p })} active={params.maxPrice === p}>
              Up to {formatPeso(p)}
            </Option>
          ))}
          {facets.maxPrice !== null ? (
            <Option
              href={href({ maxPrice: facets.maxPrice })}
              active={params.maxPrice === facets.maxPrice}
            >
              Up to {formatPeso(facets.maxPrice)}
            </Option>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="f-time">
        <h2 id="f-time" className="text-eyebrow mb-2 px-3 text-muted-foreground">Departure time</h2>
        <Option href={href({ depart: undefined })} active={!params.depart}>Any time</Option>
        {TIME_BUCKETS.map((b) => (
          <Option key={b} href={href({ depart: b })} active={params.depart === b}>
            {TIME_LABELS[b]}
          </Option>
        ))}
      </section>

      {facets.airlines.length > 1 ? (
        <section aria-labelledby="f-airline">
          <h2 id="f-airline" className="text-eyebrow mb-2 px-3 text-muted-foreground">Airline</h2>
          <Option href={href({ airline: undefined })} active={!params.airline}>Any airline</Option>
          {facets.airlines.map((a) => (
            <Option key={a} href={href({ airline: a })} active={params.airline === a}>
              {a}
            </Option>
          ))}
        </section>
      ) : null}

      {activeCount > 0 ? (
        <Link
          href={href({ maxPrice: undefined, stops: undefined, airline: undefined, depart: undefined })}
          replace
          scroll={false}
          className="block px-3 text-sm font-medium text-brand-ink hover:underline"
        >
          Clear filters
        </Link>
      ) : null}
    </div>
  );

  return (
    <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
      {/* Desktop: always open. Mobile: native disclosure, no JS needed. */}
      <div className="hidden rounded-[1.75rem] border border-border bg-card p-3 lg:block">{body}</div>
      <details className="group rounded-[1.75rem] border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters{activeCount ? ` (${activeCount})` : ""}
          </span>
          <span className="text-muted-foreground group-open:hidden">Show</span>
          <span className="hidden text-muted-foreground group-open:inline">Hide</span>
        </summary>
        <div className="border-t border-border p-3">{body}</div>
      </details>
    </aside>
  );
}

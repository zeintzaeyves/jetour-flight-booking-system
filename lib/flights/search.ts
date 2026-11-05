import { z } from "zod";

import type { Flight } from "@/types/flight";

export const SORTS = ["price", "departure", "duration"] as const;
export const TIME_BUCKETS = ["morning", "afternoon", "evening", "night"] as const;
export const CABINS = ["Economy", "Premium Economy", "Business"] as const;

export type Sort = (typeof SORTS)[number];
export type TimeBucket = (typeof TIME_BUCKETS)[number];

/* ------------------------------ parsing ------------------------------ */

/** "4h 20m" | "4h" | "90m" | "4:20" | "4.5h" -> minutes, or null if unreadable. */
export function parseDurationMinutes(value: string): number | null {
  const v = value.trim().toLowerCase();
  const hm = v.match(/^(\d+):(\d{2})$/);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2]);
  const h = v.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = v.match(/(\d+)\s*m/);
  if (!h && !m) return null;
  return Math.round((h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0));
}

/** "08:00" | "8:05 PM" -> minutes after midnight, or null. */
export function parseTimeMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === "pm" ? 12 : 0);
  } else if (hours > 23) {
    return null;
  }
  return hours * 60 + minutes;
}

/** "2026-12-01" (as stored by the admin form) or any Date-parsable string -> "YYYY-MM-DD". */
export function normalizeDate(value: string): string | null {
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function timeBucket(minutes: number): TimeBucket {
  if (minutes >= 5 * 60 && minutes < 12 * 60) return "morning";
  if (minutes >= 12 * 60 && minutes < 18 * 60) return "afternoon";
  if (minutes >= 18 * 60) return "evening";
  return "night";
}

/* ------------------------------ params ------------------------------ */

// Lenient on purpose: these come from user-editable URLs, so an invalid
// value falls back to "not set" instead of erroring the whole page.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional().catch(undefined));

export const searchParamsSchema = z.object({
  from: optional(z.string().trim().min(1).max(60)),
  to: optional(z.string().trim().min(1).max(60)),
  date: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  return: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  trip: z.enum(["oneway", "round"]).catch("oneway").default("oneway"),
  leg: z.enum(["out", "ret"]).catch("out").default("out"),
  passengers: z.coerce.number().int().min(1).max(9).catch(1).default(1),
  cabin: optional(z.enum(CABINS)),
  sort: z.enum(SORTS).catch("price").default("price"),
  maxPrice: optional(z.coerce.number().positive().max(10_000_000)),
  stops: optional(z.enum(["0", "1"])),
  airline: optional(z.string().trim().min(1).max(80)),
  depart: optional(z.enum(TIME_BUCKETS)),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

/** Accepts Next's searchParams object (string | string[] values) or URLSearchParams. */
export function parseSearchParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>
): SearchParams {
  const raw: Record<string, string | undefined> = {};
  if (input instanceof URLSearchParams) {
    input.forEach((v, k) => (raw[k] = v));
  } else {
    for (const [k, v] of Object.entries(input)) {
      raw[k] = Array.isArray(v) ? v[0] : v;
    }
  }
  return searchParamsSchema.parse(raw);
}

/** The params for the leg being shown (return leg flips the route and uses the return date). */
export function legParams(p: SearchParams): SearchParams {
  if (p.trip !== "round" || p.leg !== "ret") return p;
  return { ...p, from: p.to, to: p.from, date: p.return };
}

/* ------------------------------ matching ------------------------------ */

function matchesPlace(code: string, city: string, term?: string): boolean {
  if (!term) return true;
  const t = term.trim().toLowerCase();
  return code.toLowerCase() === t || city.toLowerCase().includes(t);
}

/** Flights that can actually be booked right now (mirrors the booking service rules). */
export function isBookable(f: Flight, passengers: number): boolean {
  return f.status === "Scheduled" && f.availableSeats >= passengers;
}

export type Facets = {
  count: number;
  airlines: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

export type SearchResult = { results: Flight[]; facets: Facets };

/**
 * Filters and sorts flights. Facets describe the set that matches the *search*
 * (route/date/seats/cabin) before the sidebar filters, so filter options don't
 * vanish as you narrow results.
 */
export function searchFlights(all: Flight[], p: SearchParams): SearchResult {
  const base = all.filter((f) => {
    if (!isBookable(f, p.passengers)) return false;
    if (!matchesPlace(f.originCode, f.origin, p.from)) return false;
    if (!matchesPlace(f.destinationCode, f.destination, p.to)) return false;
    if (p.date && normalizeDate(f.departureDate) !== p.date) return false;
    if (p.cabin && f.classType !== p.cabin) return false;
    return true;
  });

  const prices = base.map((f) => f.price);
  const facets: Facets = {
    count: base.length,
    airlines: [...new Set(base.map((f) => f.airline))].sort(),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
  };

  const results = base.filter((f) => {
    if (p.maxPrice !== undefined && f.price > p.maxPrice) return false;
    if (p.stops !== undefined) {
      const stops = f.stops ?? 0;
      if (p.stops === "0" ? stops !== 0 : stops < 1) return false;
    }
    if (p.airline && f.airline !== p.airline) return false;
    if (p.depart) {
      const t = parseTimeMinutes(f.departureTime);
      if (t === null || timeBucket(t) !== p.depart) return false;
    }
    return true;
  });

  const key = (f: Flight): number => {
    if (p.sort === "departure") return parseTimeMinutes(f.departureTime) ?? Infinity;
    if (p.sort === "duration") return parseDurationMinutes(f.duration) ?? Infinity;
    return f.price;
  };
  // Unreadable values sort last; ties fall back to price, then flight number, for stable output.
  results.sort(
    (a, b) =>
      key(a) - key(b) ||
      a.price - b.price ||
      a.flightNo.localeCompare(b.flightNo)
  );

  return { results, facets };
}

/* ------------------------------ URL helpers ------------------------------ */

/** Serializes only meaningful params (no defaults) so URLs stay short and shareable. */
export function toQueryString(p: Partial<SearchParams>): string {
  const q = new URLSearchParams();
  const set = (k: string, v: unknown) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  };
  set("from", p.from);
  set("to", p.to);
  set("date", p.date);
  if (p.trip === "round") {
    set("trip", "round");
    set("return", p.return);
    if (p.leg === "ret") set("leg", "ret");
  }
  if (p.passengers && p.passengers !== 1) set("passengers", p.passengers);
  set("cabin", p.cabin);
  if (p.sort && p.sort !== "price") set("sort", p.sort);
  set("maxPrice", p.maxPrice);
  set("stops", p.stops);
  set("airline", p.airline);
  set("depart", p.depart);
  return q.toString();
}

/** Up to three "under ₱X" presets between the cheapest and priciest fare (rounded up to ₱500). */
export function pricePresets(min: number | null, max: number | null): number[] {
  if (min === null || max === null || max <= min) return [];
  const round = (n: number) => Math.ceil(n / 500) * 500;
  const steps = [1 / 3, 2 / 3].map((t) => round(min + (max - min) * t));
  return [...new Set(steps)].filter((v) => v > min && v < max);
}

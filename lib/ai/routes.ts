import { normalizeDate, parseDurationMinutes } from "@/lib/flights/search";
import type { Flight } from "@/types/flight";

export type RouteEntry = {
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  count: number;
  cheapest: Flight;
  minDuration: string;
  firstDate: string;
  lastDate: string;
};

/**
 * What Jetour really flies, per directed route, from live flight records. Past departures are
 * excluded. This is the only source of destinations and fares the planner may use.
 */
export function buildRouteCatalog(flights: Flight[], today: string): RouteEntry[] {
  const map = new Map<string, RouteEntry>();
  for (const f of flights) {
    const date = normalizeDate(f.departureDate);
    if (!date || date < today) continue;
    const key = `${f.originCode}>${f.destinationCode}`;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, {
        from: f.originCode,
        fromCity: f.origin,
        to: f.destinationCode,
        toCity: f.destination,
        count: 1,
        cheapest: f,
        minDuration: f.duration,
        firstDate: date,
        lastDate: date,
      });
      continue;
    }
    cur.count++;
    if (f.price < cur.cheapest.price) cur.cheapest = f;
    if ((parseDurationMinutes(f.duration) ?? Infinity) < (parseDurationMinutes(cur.minDuration) ?? Infinity)) cur.minDuration = f.duration;
    if (date < cur.firstDate) cur.firstDate = date;
    if (date > cur.lastDate) cur.lastDate = date;
  }
  return [...map.values()].sort((a, b) => a.from.localeCompare(b.from) || a.cheapest.price - b.cheapest.price);
}

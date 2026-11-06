import { connectDB } from "@/lib/mongodb";
import Flight from "@/models/Flight";
import type { Flight as FlightType } from "@/types/flight";

import { searchFlights, type SearchParams, type SearchResult } from "./search";

/** Plain, serializable flights that are open for booking and have seats. */
async function loadBookable(minSeats: number): Promise<FlightType[]> {
  await connectDB();
  const docs = await Flight.find({
    status: "Scheduled",
    availableSeats: { $gte: minSeats },
  }).lean();
  return JSON.parse(JSON.stringify(docs));
}

// NOTE: route/date/time/duration are matched in JS because they are stored as
// free-form strings. Fine for a catalog of hundreds of flights; once dates are
// normalized (migration) this should move into the Mongo query with pagination.
export async function runSearch(params: SearchParams): Promise<SearchResult> {
  return searchFlights(await loadBookable(params.passengers), params);
}

export type Airport = { code: string; city: string };

export type NetworkSummary = {
  origins: Airport[];
  destinations: Airport[];
  /** Cheapest bookable fare per destination code. */
  fromPrice: Record<string, number>;
  cheapest: FlightType[];
  /** The next bookable departures in time order, for the departures board. */
  upcoming: FlightType[];
  /** Bookable departures and distinct directed routes, for the landing-page stats. */
  flightCount: number;
  routeCount: number;
};

const byCity = (a: Airport, b: Airport) => a.city.localeCompare(b.city);

/** What Jetour really flies, derived from live data. Never throws: callers get empty lists on failure. */
export async function getNetworkSummary(): Promise<NetworkSummary> {
  try {
    const flights = await loadBookable(1);
    const origins = new Map<string, Airport>();
    const destinations = new Map<string, Airport>();
    const fromPrice: Record<string, number> = {};
    for (const f of flights) {
      origins.set(f.originCode, { code: f.originCode, city: f.origin });
      destinations.set(f.destinationCode, {
        code: f.destinationCode,
        city: f.destination,
      });
      const cur = fromPrice[f.destinationCode];
      if (cur === undefined || f.price < cur) fromPrice[f.destinationCode] = f.price;
    }
    return {
      origins: [...origins.values()].sort(byCity),
      destinations: [...destinations.values()].sort(byCity),
      fromPrice,
      // Cheapest departure per route, so the list isn't several copies of one flight.
      cheapest: [...flights]
        .sort((a, b) => a.price - b.price)
        .filter((f, i, all) => {
          const key = `${f.originCode}-${f.destinationCode}`;
          return all.findIndex((g) => `${g.originCode}-${g.destinationCode}` === key) === i;
        })
        .slice(0, 6),
      upcoming: [...flights]
        .sort((a, b) => `${a.departureDate} ${a.departureTime}`.localeCompare(`${b.departureDate} ${b.departureTime}`))
        .slice(0, 8),
      flightCount: flights.length,
      routeCount: new Set(flights.map((f) => `${f.originCode}-${f.destinationCode}`)).size,
    };
  } catch (error) {
    console.error("NETWORK_SUMMARY_ERROR:", error);
    return { origins: [], destinations: [], fromPrice: {}, cheapest: [], upcoming: [], flightCount: 0, routeCount: 0 };
  }
}

/** One flight by flight number (case-insensitive), or null. Shared by the details and booking pages. */
export async function getFlightByNo(flightNo: string): Promise<FlightType | null> {
  await connectDB();
  const doc = await Flight.findOne({ flightNo: flightNo.toUpperCase() }).lean();
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
}

/** Every bookable flight, for building derived views such as the AI planner's route catalog. */
export async function getBookableFlights(): Promise<FlightType[]> {
  return loadBookable(1);
}

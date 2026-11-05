import { describe, expect, it } from "vitest";

import {
  legParams,
  normalizeDate,
  parseDurationMinutes,
  parseSearchParams,
  parseTimeMinutes,
  searchFlights,
  timeBucket,
  toQueryString,
} from "@/lib/flights/search";
import { buildSearchHref, validateSearchForm } from "@/lib/flights/searchForm";
import type { Flight } from "@/types/flight";

let n = 0;
const flight = (o: Partial<Flight> = {}): Flight => ({
  _id: String(++n),
  flightNo: `JT-${100 + n}`,
  airline: "Jetour Airways",
  origin: "Manila",
  destination: "Tokyo",
  originCode: "MNL",
  destinationCode: "NRT",
  departureDate: "2026-12-01",
  departureTime: "08:00",
  arrivalTime: "13:00",
  duration: "4h 20m",
  classType: "Economy",
  baggage: "20kg",
  price: 10000,
  availableSeats: 20,
  status: "Scheduled",
  tag: "Available",
  ...o,
});

describe("parsers", () => {
  it("parses durations in common formats", () => {
    expect(parseDurationMinutes("4h 20m")).toBe(260);
    expect(parseDurationMinutes("4h")).toBe(240);
    expect(parseDurationMinutes("90m")).toBe(90);
    expect(parseDurationMinutes("4:20")).toBe(260);
    expect(parseDurationMinutes("soon")).toBeNull();
  });
  it("parses 24h and 12h times", () => {
    expect(parseTimeMinutes("08:00")).toBe(480);
    expect(parseTimeMinutes("8:05 PM")).toBe(20 * 60 + 5);
    expect(parseTimeMinutes("12:00 AM")).toBe(0);
    expect(parseTimeMinutes("12:30 PM")).toBe(12 * 60 + 30);
    expect(parseTimeMinutes("25:00")).toBeNull();
    expect(parseTimeMinutes("13:00 PM")).toBeNull();
    expect(parseTimeMinutes("late")).toBeNull();
  });
  it("normalizes dates", () => {
    expect(normalizeDate("2026-12-01")).toBe("2026-12-01");
    expect(normalizeDate("May 24, 2026")).toBe("2026-05-24");
    expect(normalizeDate("nonsense")).toBeNull();
  });
  it("buckets times of day", () => {
    expect(timeBucket(5 * 60)).toBe("morning");
    expect(timeBucket(11 * 60 + 59)).toBe("morning");
    expect(timeBucket(12 * 60)).toBe("afternoon");
    expect(timeBucket(18 * 60)).toBe("evening");
    expect(timeBucket(2 * 60)).toBe("night");
  });
});

describe("param parsing", () => {
  it("applies defaults", () => {
    const p = parseSearchParams({});
    expect(p).toMatchObject({ trip: "oneway", leg: "out", passengers: 1, sort: "price" });
  });
  it("falls back instead of throwing on bad URL values", () => {
    const p = parseSearchParams({
      passengers: "999",
      sort: "banana",
      date: "tomorrow",
      cabin: "First",
      maxPrice: "-5",
      trip: "x",
    });
    expect(p.passengers).toBe(1);
    expect(p.sort).toBe("price");
    expect(p.date).toBeUndefined();
    expect(p.cabin).toBeUndefined();
    expect(p.maxPrice).toBeUndefined();
    expect(p.trip).toBe("oneway");
  });
  it("takes the first value of repeated params and works with URLSearchParams", () => {
    expect(parseSearchParams({ from: ["MNL", "CEB"] }).from).toBe("MNL");
    expect(parseSearchParams(new URLSearchParams("from=CEB&passengers=3"))).toMatchObject({
      from: "CEB",
      passengers: 3,
    });
  });
  it("round-trips through toQueryString without defaults", () => {
    expect(toQueryString(parseSearchParams({}))).toBe("");
    const qs = toQueryString(parseSearchParams({ from: "MNL", to: "NRT", passengers: "2", sort: "duration" }));
    expect(qs).toBe("from=MNL&to=NRT&passengers=2&sort=duration");
  });
  it("flips route and date for the return leg", () => {
    const p = parseSearchParams({ from: "MNL", to: "NRT", date: "2026-12-01", return: "2026-12-10", trip: "round", leg: "ret" });
    expect(legParams(p)).toMatchObject({ from: "NRT", to: "MNL", date: "2026-12-10" });
    expect(legParams({ ...p, leg: "out" })).toMatchObject({ from: "MNL", to: "NRT", date: "2026-12-01" });
  });
});

describe("searchFlights: matching", () => {
  const all = [
    flight({ flightNo: "A", price: 9000 }),
    flight({ flightNo: "B", origin: "Cebu", originCode: "CEB", destination: "Singapore", destinationCode: "SIN" }),
    flight({ flightNo: "C", departureDate: "2026-12-02" }),
    flight({ flightNo: "D", status: "Cancelled" }),
    flight({ flightNo: "E", availableSeats: 1 }),
    flight({ flightNo: "F", classType: "Business", price: 40000 }),
  ];
  const run = (q: Record<string, string>) =>
    searchFlights(all, parseSearchParams(q)).results.map((f) => f.flightNo);

  it("only returns bookable flights", () => {
    expect(run({})).not.toContain("D");
  });
  it("requires enough seats for the party", () => {
    expect(run({ passengers: "1" })).toContain("E");
    expect(run({ passengers: "2" })).not.toContain("E");
  });
  it("matches by airport code or city, case-insensitively", () => {
    expect(run({ from: "mnl", to: "tokyo" })).toEqual(expect.arrayContaining(["A", "C", "E", "F"]));
    expect(run({ from: "CEB" })).toEqual(["B"]);
    expect(run({ to: "sin" })).toEqual(["B"]);
  });
  it("filters by exact date and cabin", () => {
    expect(run({ date: "2026-12-02" })).toEqual(["C"]);
    expect(run({ cabin: "Business" })).toEqual(["F"]);
  });
  it("returns nothing, not everything, when nothing matches", () => {
    expect(run({ from: "ZZZ" })).toEqual([]);
  });
});

describe("searchFlights: filters, sorting, facets", () => {
  const all = [
    flight({ flightNo: "X1", price: 12000, departureTime: "07:00", duration: "5h", airline: "Jetour Airways", stops: 1 }),
    flight({ flightNo: "X2", price: 8000, departureTime: "14:00", duration: "6h 30m", airline: "Sky Partner" }),
    flight({ flightNo: "X3", price: 10000, departureTime: "21:30", duration: "4h", airline: "Jetour Airways", stops: 0 }),
    flight({ flightNo: "X4", price: 10000, departureTime: "bad", duration: "??", airline: "Jetour Airways" }),
  ];
  const run = (q: Record<string, string>) =>
    searchFlights(all, parseSearchParams(q)).results.map((f) => f.flightNo);

  it("sorts by price (default), departure, duration", () => {
    expect(run({})).toEqual(["X2", "X3", "X4", "X1"]);
    expect(run({ sort: "departure" })).toEqual(["X1", "X2", "X3", "X4"]);
    expect(run({ sort: "duration" })).toEqual(["X3", "X1", "X2", "X4"]);
  });
  it("puts unreadable values last and keeps order deterministic", () => {
    expect(run({ sort: "departure" }).at(-1)).toBe("X4");
    expect(run({ sort: "duration" }).at(-1)).toBe("X4");
  });
  it("filters by max price (inclusive)", () => {
    expect(run({ maxPrice: "10000" })).toEqual(["X2", "X3", "X4"]);
  });
  it("filters by stops, treating missing stops as nonstop", () => {
    expect(run({ stops: "0" })).toEqual(["X2", "X3", "X4"]);
    expect(run({ stops: "1" })).toEqual(["X1"]);
  });
  it("filters by airline and time of day", () => {
    expect(run({ airline: "Sky Partner" })).toEqual(["X2"]);
    expect(run({ depart: "morning" })).toEqual(["X1"]);
    expect(run({ depart: "evening" })).toEqual(["X3"]);
  });
  it("facets ignore sidebar filters but respect the search", () => {
    const r = searchFlights(all, parseSearchParams({ maxPrice: "8000", airline: "Sky Partner" }));
    expect(r.results).toHaveLength(1);
    expect(r.facets).toEqual({
      count: 4,
      airlines: ["Jetour Airways", "Sky Partner"],
      minPrice: 8000,
      maxPrice: 12000,
    });
  });
  it("handles an empty set", () => {
    expect(searchFlights([], parseSearchParams({})).facets).toEqual({
      count: 0,
      airlines: [],
      minPrice: null,
      maxPrice: null,
    });
  });
});

describe("search form", () => {
  const ok = {
    trip: "oneway" as const,
    from: "MNL",
    to: "NRT",
    date: "2026-12-01",
    returnDate: "",
    passengers: 1,
    cabin: "",
  };
  it("accepts a valid one-way search", () => {
    expect(validateSearchForm(ok, "2026-11-04")).toEqual({});
  });
  it("requires places, a future date, and distinct places", () => {
    const e = validateSearchForm({ ...ok, from: "", to: "", date: "" }, "2026-11-04");
    expect(Object.keys(e).sort()).toEqual(["date", "from", "to"]);
    expect(validateSearchForm({ ...ok, to: "MNL" }, "2026-11-04").to).toMatch(/different/);
    expect(validateSearchForm({ ...ok, date: "2026-11-03" }, "2026-11-04").date).toMatch(/past/);
    expect(validateSearchForm({ ...ok, date: "2026-11-04" }, "2026-11-04")).toEqual({});
  });
  it("validates the return date only for round trips", () => {
    expect(validateSearchForm({ ...ok, trip: "round" }, "2026-11-04").returnDate).toBeDefined();
    expect(validateSearchForm({ ...ok, trip: "round", returnDate: "2026-11-30" }, "2026-11-04").returnDate).toMatch(/on or after/);
    expect(validateSearchForm({ ...ok, trip: "round", returnDate: "2026-12-01" }, "2026-11-04")).toEqual({});
  });
  it("builds a shareable href", () => {
    expect(buildSearchHref({ ...ok, passengers: 2, cabin: "Business" })).toBe(
      "/flights?from=MNL&to=NRT&date=2026-12-01&passengers=2&cabin=Business"
    );
    expect(buildSearchHref({ ...ok, trip: "round", returnDate: "2026-12-08" })).toBe(
      "/flights?from=MNL&to=NRT&date=2026-12-01&trip=round&return=2026-12-08"
    );
  });
});

import { pricePresets } from "@/lib/flights/search";
import { formatDateShort, formatTime12 } from "@/lib/format";

describe("price presets", () => {
  it("returns rounded steps strictly between min and max", () => {
    expect(pricePresets(8000, 20000)).toEqual([12000, 16000]);
  });
  it("returns nothing when there is no range", () => {
    expect(pricePresets(null, null)).toEqual([]);
    expect(pricePresets(5000, 5000)).toEqual([]);
    expect(pricePresets(5000, 5200)).toEqual([]);
  });
});

describe("display formatting", () => {
  it("formats times in 12h and passes through unreadable values", () => {
    expect(formatTime12("08:00")).toBe("8:00 AM");
    expect(formatTime12("00:15")).toBe("12:15 AM");
    expect(formatTime12("12:00")).toBe("12:00 PM");
    expect(formatTime12("21:30")).toBe("9:30 PM");
    expect(formatTime12("late")).toBe("late");
  });
  it("formats calendar dates without timezone drift", () => {
    expect(formatDateShort("2026-12-01")).toBe("Tue, Dec 1");
    expect(formatDateShort("garbage")).toBe("garbage");
  });
});

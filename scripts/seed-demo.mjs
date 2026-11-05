// Seeds DEMO flights so the site has something to search and book.
//   npm run seed:demo              add any missing demo flights (safe to re-run)
//   npm run seed:demo -- --dry-run show what would be added, write nothing
//   npm run seed:demo -- --refresh also move existing demo flights forward to upcoming dates
//
// Guarantees:
//   - Idempotent: every flight has a deterministic flight number (route + slot + week) and is
//     written with an upsert + $setOnInsert, so re-running never duplicates or overwrites it.
//   - Never touches real data: a flight number that already exists is skipped, and --refresh
//     only updates documents marked isDemo: true (and only their dates, never seats or prices,
//     so bookings made against demo flights are preserved).
//   - Demo flights are marked isDemo: true and use fictional carriers.
// These are sample flights for a portfolio project, not real airline schedules or fares.
// Flight numbers are derived from the position of a route in ROUTES: only ever append routes.
import dns from "node:dns";

import mongoose from "mongoose";

import { floatingDeparture } from "./floating-departure.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Put it in .env.local and run: npm run seed:demo");
  process.exit(1);
}
const dryRun = process.argv.includes("--dry-run");
const refresh = process.argv.includes("--refresh");

// Same opt-in public-DNS workaround the app uses for mongodb+srv lookups.
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
if (dnsServers?.length) {
  dns.setServers(dnsServers);
  dns.promises.setServers(dnsServers);
}

// code -> [city, UTC offset in hours]
const AIRPORTS = {
  MNL: ["Manila", 8],
  CEB: ["Cebu", 8],
  DVO: ["Davao", 8],
  SIN: ["Singapore", 8],
  HKG: ["Hong Kong", 8],
  KUL: ["Kuala Lumpur", 8],
  NRT: ["Tokyo", 9],
  ICN: ["Seoul", 9],
};

// [code A, code B, base economy fare in PHP (one way), nonstop flight time in minutes]
// Each pair is flown in both directions. Append only (flight numbers depend on the index).
const ROUTES = [
  ["MNL", "CEB", 2800, 85],
  ["MNL", "DVO", 3400, 120],
  ["CEB", "DVO", 2600, 90],
  ["MNL", "SIN", 7200, 215],
  ["MNL", "HKG", 6400, 135],
  ["MNL", "NRT", 12500, 260],
  ["MNL", "ICN", 10200, 265],
  ["MNL", "KUL", 7800, 235],
  ["CEB", "SIN", 7000, 220],
  ["DVO", "SIN", 7600, 235],
  ["SIN", "KUL", 3200, 65],
  ["HKG", "NRT", 11000, 275],
  ["ICN", "NRT", 8000, 140],
];

// Fictional carriers, so no real airline is shown with an invented schedule or fare.
const HOME = { name: "Jetour Airways", code: "JT" };
const CONNECT = { name: "Jetour Connect", code: "JC" };
const PARTNERS = [
  { name: "Pacifica Air", code: "PF" },
  { name: "Lumen Air", code: "LM" },
  { name: "Northstar Regional", code: "NR" },
];

const WEEKS = 4; // departures per slot, one week apart
const LONG_HAUL = 200; // minutes: long routes get a 1-stop option and a Business cabin

const pad = (n) => String(n).padStart(2, "0");
const fmtDuration = (m) => `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
const fmtClock = (minutes) => {
  const t = ((minutes % 1440) + 1440) % 1440;
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
};
const isoDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** The four daily-ish departures for one direction of one route. */
function slotsFor(routeIdx, long) {
  const partner = PARTNERS[routeIdx % PARTNERS.length];
  return [
    { airline: HOME, cabin: "Economy", hour: 6, mult: 1.0, stops: 0, seats: 38, baggage: "20kg" },
    long
      ? { airline: CONNECT, cabin: "Economy", hour: 12, mult: 0.78, stops: 1, seats: 26, baggage: "20kg" }
      : { airline: partner, cabin: "Economy", hour: 12, mult: 0.9, stops: 0, seats: 26, baggage: "15kg" },
    { airline: HOME, cabin: "Premium Economy", hour: 17, mult: 1.6, stops: 0, seats: 14, baggage: "30kg" },
    long
      ? { airline: HOME, cabin: "Business", hour: 21, mult: 2.7, stops: 0, seats: 9, baggage: "40kg" }
      : { airline: partner, cabin: "Economy", hour: 19, mult: 0.95, stops: 0, seats: 30, baggage: "15kg" },
  ];
}

const now = new Date();
const flights = [];
ROUTES.forEach(([a, b, fare, mins], routeIdx) => {
  const long = mins >= LONG_HAUL;
  [
    [a, b, 0],
    [b, a, 1],
  ].forEach(([from, to, dir]) => {
    const [fromCity, fromTz] = AIRPORTS[from];
    const [toCity, toTz] = AIRPORTS[to];
    slotsFor(routeIdx, long).forEach((slot, slotIdx) => {
      for (let week = 0; week < WEEKS; week++) {
        const minute = ((routeIdx * 7 + dir * 2 + slotIdx) % 4) * 15;
        const depart = slot.hour * 60 + minute;
        const total = mins + slot.stops * (90 + ((routeIdx + week) % 3) * 30);
        const offset = 2 + slotIdx * 2 + dir + week * 8 + (routeIdx % 3);
        const departureDate = isoDate(offset);
        const departureTime = fmtClock(depart);
        const jitter = 1 + (((week * 3 + routeIdx + slotIdx) % 5) - 2) * 0.02;
        const seats = (routeIdx + week + slotIdx) % 11 === 0 ? 3 : slot.seats - ((week * 5) % 10);
        // Flight number encodes route, direction, slot and week, so it's stable between runs.
        const seq = (routeIdx * 2 + dir) * 100 + slotIdx * 10 + week;
        flights.push({
          flightNo: `${slot.airline.code}${1000 + seq}`,
          airline: slot.airline.name,
          origin: fromCity,
          destination: toCity,
          originCode: from,
          destinationCode: to,
          departureDate,
          departureTime,
          // Local clock time at the destination (its UTC offset can differ from the origin's).
          arrivalTime: fmtClock(depart + total + (toTz - fromTz) * 60),
          duration: fmtDuration(total),
          classType: slot.cabin,
          baggage: slot.baggage,
          price: Math.round((fare * slot.mult * jitter) / 100) * 100 - 1,
          availableSeats: seats,
          status: "Scheduled",
          tag: seats <= 5 ? "Selling fast" : slot.cabin !== "Economy" ? "Premium" : slot.stops ? "Great value" : "Available",
          stops: slot.stops,
          departureAt: floatingDeparture(departureDate, departureTime),
          isDemo: true,
        });
      }
    });
  });
});

if (new Set(flights.map((f) => f.flightNo)).size !== flights.length) {
  throw new Error("Seed bug: duplicate flight numbers were generated.");
}

if (dryRun) {
  console.log(`Dry run: ${flights.length} demo flights would be considered (nothing written).`);
  process.exit(0);
}

await mongoose.connect(uri, { dbName: "jetour", serverSelectionTimeoutMS: 15000 });
try {
  const col = mongoose.connection.collection("flights");
  let added = 0;
  let skipped = 0;
  let refreshed = 0;
  for (const f of flights) {
    const r = await col.updateOne(
      { flightNo: f.flightNo },
      { $setOnInsert: { ...f, createdAt: now, updatedAt: now } },
      { upsert: true }
    );
    if (r.upsertedCount) {
      added++;
      continue;
    }
    skipped++;
    if (refresh) {
      // Only our own demo rows, and only their dates (never seats/prices/status).
      const u = await col.updateOne(
        { flightNo: f.flightNo, isDemo: true },
        { $set: { departureDate: f.departureDate, departureTime: f.departureTime, departureAt: f.departureAt, updatedAt: now } }
      );
      refreshed += u.modifiedCount;
    }
  }
  const demoTotal = await col.countDocuments({ isDemo: true });
  const total = await col.countDocuments();
  console.log(
    `Generated ${flights.length}: added ${added}, already present ${skipped}` +
      (refresh ? `, re-dated ${refreshed}` : "") +
      `. Collection now has ${total} flights (${demoTotal} demo).`
  );
} finally {
  await mongoose.disconnect();
}

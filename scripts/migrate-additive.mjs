// Additive migration. DRY RUN by default; nothing is written without --apply.
//   node --env-file=.env.local scripts/migrate-additive.mjs          (report only)
//   node --env-file=.env.local scripts/migrate-additive.mjs --apply  (write)
// BACK UP THE DATABASE BEFORE USING --apply.
//
// What it does (never removes or rewrites existing fields; safe to re-run):
//   - flights: sets `stops: 0` where missing
//   - flights: sets `departureAt` (a Date) where departureDate is YYYY-MM-DD and
//     departureTime is HH:MM (what the admin form produces). See floating-departure.mjs.
//   - reports flights it cannot read (left untouched; never guessed)
import mongoose from "mongoose";

import { floatingDeparture } from "./floating-departure.mjs";

const apply = process.argv.includes("--apply");
await mongoose.connect(process.env.MONGODB_URI, { dbName: "jetour" });
const flights = mongoose.connection.collection("flights");

const docs = await flights.find({}).toArray();
let stopsToSet = 0;
let datesToSet = 0;
const unreadable = [];

for (const f of docs) {
  const $set = {};
  if (f.stops === undefined) {
    $set.stops = 0;
    stopsToSet++;
  }
  if (!f.departureAt) {
    const when = floatingDeparture(f.departureDate, f.departureTime);
    if (when) {
      $set.departureAt = when;
      datesToSet++;
    } else {
      unreadable.push(f.flightNo);
    }
  }
  if (apply && Object.keys($set).length) {
    await flights.updateOne({ _id: f._id }, { $set });
  }
}

console.log(`${apply ? "APPLIED" : "DRY RUN"}: ${docs.length} flights`);
console.log(`  stops to set: ${stopsToSet}`);
console.log(`  departureAt to set: ${datesToSet}`);
console.log(`  unreadable dates/times (skipped): ${unreadable.join(", ") || "none"}`);
await mongoose.disconnect();

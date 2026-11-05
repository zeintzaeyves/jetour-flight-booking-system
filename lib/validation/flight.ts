import { z } from "zod";

export const CLASS_TYPES = ["Economy", "Premium Economy", "Business"] as const;
export const FLIGHT_STATUSES = [
  "Scheduled",
  "Delayed",
  "Cancelled",
  "Completed",
] as const;

const text = (max: number) => z.string().trim().min(1).max(max);
const iataCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Must be a 3-letter airport code");

// Base fields carry NO defaults, so the PATCH schema (a partial of this) can
// never silently overwrite stored values with defaults.
const flightFields = z.object({
  flightNo: text(12).transform((v) => v.toUpperCase()),
  airline: text(80),
  origin: text(80),
  destination: text(80),
  originCode: iataCode,
  destinationCode: iataCode,
  departureDate: text(40),
  departureTime: text(20),
  arrivalTime: text(20),
  duration: text(30),
  classType: z.enum(CLASS_TYPES),
  baggage: text(40),
  price: z.coerce.number().positive().max(10_000_000),
  availableSeats: z.coerce.number().int().min(0).max(1000),
  status: z.enum(FLIGHT_STATUSES),
  tag: text(40),
  stops: z.coerce.number().int().min(0).max(5),
});

/** POST: defaults applied for optional fields. */
export const flightInputSchema = flightFields.extend({
  airline: flightFields.shape.airline.default("Jetour Airways"),
  classType: flightFields.shape.classType.default("Economy"),
  baggage: flightFields.shape.baggage.default("20kg"),
  status: flightFields.shape.status.default("Scheduled"),
  tag: flightFields.shape.tag.default("Available"),
  stops: flightFields.shape.stops.default(0),
});

/** PATCH: only known fields, all optional, unknown keys rejected. */
export const flightPatchSchema = flightFields
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0, "No fields to update");

export type FlightInput = z.infer<typeof flightInputSchema>;

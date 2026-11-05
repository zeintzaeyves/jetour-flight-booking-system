import { z } from "zod";

export const SEAT_PREFERENCES = [
  "Window seat",
  "Aisle seat",
  "Middle seat",
  "Any available seat",
] as const;
export const BOOKING_STATUSES = ["Pending", "Confirmed", "Cancelled"] as const;
export const MAX_PASSENGERS = 9;

const personName = z
  .string()
  .trim()
  .min(2, "Enter the passenger's full name")
  .max(120);

export const bookingInputSchema = z
  .object({
    flightNo: z
      .string()
      .trim()
      .min(1)
      .max(12)
      .transform((v) => v.toUpperCase()),
    /** Lead passenger / booking contact. */
    fullName: personName,
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
    passengers: z.coerce.number().int().min(1).max(MAX_PASSENGERS).default(1),
    /** Names of the other travellers: exactly passengers - 1 of them. */
    additionalPassengers: z.array(personName).max(MAX_PASSENGERS - 1).default([]),
    seatPreference: z.enum(SEAT_PREFERENCES).default("Window seat"),
    specialRequest: z.string().trim().max(500).default(""),
    /** Client-generated UUID so retries/double-clicks never double-book. */
    idempotencyKey: z.string().trim().min(16).max(64).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.additionalPassengers.length !== v.passengers - 1) {
      ctx.addIssue({
        code: "custom",
        path: ["additionalPassengers"],
        message: `Enter names for all ${v.passengers} passengers.`,
      });
    }
  });

export const bookingLookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(4)
    .max(30)
    .transform((v) => v.toUpperCase()),
  email: z.string().trim().toLowerCase().email().max(254),
});

export const bookingStatusPatchSchema = z
  .object({ status: z.enum(BOOKING_STATUSES) })
  .strict();

export type BookingInput = z.infer<typeof bookingInputSchema>;

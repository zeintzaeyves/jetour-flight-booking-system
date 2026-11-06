import { z } from "zod";

import { CABINS, SORTS, TIME_BUCKETS } from "@/lib/flights/search";

/* Everything crossing the AI boundary is validated here: requests from the browser and the
   JSON the model returns. Model output is untrusted input. */

/** Models emit null/"" for "not mentioned"; treat both as absent. */
const absent = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === null || v === "" ? undefined : v), schema.optional());

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const airportCode = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]{3}$/));

/* ---------------------------- search intent ---------------------------- */

/** What the model may say about a trip. Unknown keys are dropped, bad values rejected. */
export const intentParamsSchema = z.object({
  from: absent(z.string().trim().min(1).max(60)),
  to: absent(z.string().trim().min(1).max(60)),
  date: absent(isoDate),
  return: absent(isoDate),
  trip: absent(z.enum(["oneway", "round"])),
  passengers: absent(z.coerce.number().int().min(1).max(9)),
  cabin: absent(z.enum(CABINS)),
  maxPrice: absent(z.coerce.number().positive().max(1_000_000)),
  depart: absent(z.enum(TIME_BUCKETS)),
  sort: absent(z.enum(SORTS)),
  stops: absent(z.preprocess((v) => (typeof v === "number" ? String(v) : v), z.enum(["0", "1"]))),
  airline: absent(z.string().trim().min(1).max(80)),
});
export type IntentParams = z.infer<typeof intentParamsSchema>;

export const searchIntentSchema = z.object({
  params: intentParamsSchema,
  clarification: absent(z.string().trim().max(240)),
});

export const nlSearchRequestSchema = z.object({ query: z.string().trim().min(3).max(400) });

/* ------------------------------- chat ------------------------------- */

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1200),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(12)
    .refine((m) => m[m.length - 1]?.role === "user", "The last message must be from the user."),
  /** Optional page context, e.g. the flight being booked. Facts are loaded server-side. */
  context: z.object({ flightNo: z.string().trim().max(20).optional() }).optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** The only things the assistant can ask the app to do. None of them writes anything. */
export const assistantActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }),
  z.object({ type: z.literal("search"), params: intentParamsSchema }),
  z.object({ type: z.literal("lookup_booking") }),
  z.object({ type: z.literal("escalate"), reason: absent(z.string().trim().max(200)) }),
  z.object({ type: z.literal("plan"), query: z.string().trim().min(3).max(300) }),
]);
export type AssistantAction = z.infer<typeof assistantActionSchema>;

/* --------------------------- recommendations --------------------------- */

export const recommendRequestSchema = z.object({
  /** The search the user is looking at (query-string params). Re-run on the server. */
  params: z.record(z.string(), z.string().max(80)).default({}),
  preferences: z.string().trim().max(300).optional(),
});

export const explainOutputSchema = z.object({
  explanations: z
    .array(z.object({ flightNo: z.string().trim().max(20), text: z.string().trim().min(1).max(260) }))
    .max(8),
});

/* ------------------------------- planner ------------------------------- */

export const planRequestSchema = z.object({ query: z.string().trim().min(3).max(400) });

export const planOutputSchema = z.object({
  intro: z.string().trim().max(320).default(""),
  clarification: absent(z.string().trim().max(240)),
  /** Departure airport the traveller named (3-letter code), if any. */
  origin: absent(airportCode),
  /** The budget the model understood, in PHP. Enforced against real fares by the server. */
  budget: absent(z.coerce.number().positive().max(10_000_000)),
  destinations: z
    .array(
      z.object({
        code: airportCode,
        why: z.string().trim().max(260),
        days: z.coerce.number().int().min(1).max(14),
        itinerary: z
          .array(
            z.object({
              title: z.string().trim().min(1).max(70),
              ideas: z.array(z.string().trim().min(1).max(160)).max(4),
            })
          )
          .max(14),
      })
    )
    .max(4),
});
export type PlanOutput = z.infer<typeof planOutputSchema>;

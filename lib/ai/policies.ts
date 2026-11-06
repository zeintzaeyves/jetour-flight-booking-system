import { FAQ } from "@/lib/content/faq";

/**
 * Everything the assistant may state as fact about Jetour's rules. It is the FAQ shown on the
 * landing page plus how the product behaves. Anything else is NOT verified: the assistant must say
 * so and hand over to a human instead of guessing.
 */
export const VERIFIED_POLICIES: readonly string[] = [
  ...FAQ.map(([q, a]) => `${q} ${a}`),
  "Searching: use the Flights page, or describe the trip in plain words. Results are Jetour's live flight records.",
  "Booking: pick a flight, enter passenger details, and confirm. A booking reference is shown straight away.",
  "Baggage: each flight lists its own baggage allowance on its card and details page. That listed text is the only baggage information Jetour has.",
  "Cancelling: open Manage booking, enter the booking reference and the email used, then cancel. Seats are released when a booking is cancelled.",
  "Looking up a booking requires both the booking reference and the email used to make it.",
];

/** Topics with no verified policy. The assistant must not answer these from its own knowledge. */
export const UNVERIFIED_TOPICS: readonly string[] = [
  "refunds, refund amounts or timelines",
  "cancellation or change fees",
  "baggage fees, weight limits or extra baggage (beyond what a flight card lists)",
  "check-in, boarding, airport or visa/travel-document rules",
  "payments, receipts or invoices",
  "name corrections, special assistance, children/infant fares, pets",
  "compensation for delays or cancellations",
];

export function policyPrompt(): string {
  return [
    "VERIFIED JETOUR INFORMATION (the only facts you may state about how Jetour works):",
    ...VERIFIED_POLICIES.map((p) => `- ${p}`),
    "",
    "NOT VERIFIED (never answer these yourself; say you don't have verified information and offer a human):",
    ...UNVERIFIED_TOPICS.map((t) => `- ${t}`),
  ].join("\n");
}

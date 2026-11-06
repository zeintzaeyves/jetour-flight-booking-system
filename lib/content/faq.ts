// Verified answers shown on the landing page and given to the AI assistant.
// This is the single source of truth: the assistant may state these and nothing more.
export const FAQ = [
  [
    "Do I need an account to book?",
    "No. Enter passenger details and you get a booking reference straight away.",
  ],
  [
    "How do I pay?",
    "You choose when booking: pay online (card, GCash or Maya) or pay in person at the airport counter or a Jetour office. Jetour is a demo, so online payments are simulated: nothing is charged and card details are never stored.",
  ],
  [
    "How do I find or cancel a booking?",
    "Open Manage booking and enter your reference and the email used. From there you can view or cancel it.",
  ],
  [
    "Can I change a booking?",
    "Not directly. Cancel the reservation and book the flight you want instead.",
  ],
  [
    "Can I book a round trip?",
    "Yes. Each direction is reserved as its own booking, so you can pick different times for each.",
  ],
  [
    "Are these real airline flights?",
    "No. The flights, carriers and fares on this site are sample data for demonstration.",
  ],
] as const;

/** Mock payment: nothing is charged and no card details ever leave the browser. */
export const ONLINE_PAYMENT_METHODS = ["Card", "GCash", "Maya"] as const;
export const IN_PERSON_PAYMENT_METHODS = ["Airport counter", "Jetour office"] as const;
export const PAYMENT_METHODS = [...ONLINE_PAYMENT_METHODS, ...IN_PERSON_PAYMENT_METHODS] as const;
export const PAYMENT_STATUSES = ["Paid", "Pay later"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const isOnlineMethod = (m: string) =>
  (ONLINE_PAYMENT_METHODS as readonly string[]).includes(m);

/** Online methods are simulated as paid immediately; in-person ones are settled later. */
export const paymentStatusFor = (m: PaymentMethod): PaymentStatus =>
  isOnlineMethod(m) ? "Paid" : "Pay later";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  Card: "Credit / debit card",
  GCash: "GCash",
  Maya: "Maya",
  "Airport counter": "Pay at the airport counter",
  "Jetour office": "Pay at a Jetour office",
};

import type { BOOKING_STATUSES } from "@/lib/validation/booking";

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Cancelled"],
  Cancelled: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus) {
  return TRANSITIONS[from].includes(to);
}

/** Statuses that hold seats on a flight. */
export const SEAT_HOLDING: readonly BookingStatus[] = ["Pending", "Confirmed"];

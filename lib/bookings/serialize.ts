/** The booking fields a guest may see. Never includes internal ids or the idempotency key. */
export type PublicBooking = {
  bookingReference: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  flightNo: string;
  route: string;
  departureDate: string;
  departureTime: string;
  classType: string;
  fullName: string;
  email: string;
  phone: string;
  passengers: number;
  additionalPassengers: string[];
  seatPreference: string;
  specialRequest: string;
  totalAmount: number;
  createdAt: string;
};

type Source = {
  [K in keyof Omit<PublicBooking, "createdAt">]?: unknown;
} & { createdAt?: unknown };

export function toPublicBooking(doc: Source): PublicBooking {
  const d = (typeof (doc as { toObject?: () => Source }).toObject === "function"
    ? (doc as { toObject: () => Source }).toObject()
    : doc) as Source;
  return {
    bookingReference: String(d.bookingReference),
    status: d.status as PublicBooking["status"],
    flightNo: String(d.flightNo),
    route: String(d.route),
    departureDate: String(d.departureDate),
    departureTime: String(d.departureTime),
    classType: String(d.classType),
    fullName: String(d.fullName),
    email: String(d.email),
    phone: String(d.phone),
    passengers: Number(d.passengers),
    additionalPassengers: Array.isArray(d.additionalPassengers)
      ? (d.additionalPassengers as unknown[]).map(String)
      : [],
    seatPreference: String(d.seatPreference),
    specialRequest: String(d.specialRequest ?? ""),
    totalAmount: Number(d.totalAmount),
    createdAt: d.createdAt ? new Date(d.createdAt as string | Date).toISOString() : "",
  };
}

import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Flight from "@/models/Flight";
import type { Flight as FlightType } from "@/types/flight";

export type AdminBooking = {
  _id: string;
  bookingReference: string;
  fullName: string;
  email: string;
  phone: string;
  flightNo: string;
  route: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  additionalPassengers?: string[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
};

const plain = <T,>(v: unknown): T => JSON.parse(JSON.stringify(v));

export async function getAdminFlights(): Promise<FlightType[]> {
  await connectDB();
  return plain(await Flight.find().sort({ departureDate: 1, departureTime: 1 }).lean());
}

export async function getAdminBookings(status?: string): Promise<AdminBooking[]> {
  await connectDB();
  const filter = status && ["Pending", "Confirmed", "Cancelled"].includes(status) ? { status } : {};
  return plain(await Booking.find(filter).sort({ createdAt: -1 }).limit(500).lean());
}

export async function getAdminStats() {
  await connectDB();
  const [flightAgg, bookingAgg, recent, lowSeats] = await Promise.all([
    Flight.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          seats: { $sum: "$availableSeats" },
        },
      },
    ]),
    Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]),
    Booking.find().sort({ createdAt: -1 }).limit(6).lean(),
    Flight.find({ status: "Scheduled", availableSeats: { $lte: 5 } })
      .sort({ availableSeats: 1 })
      .limit(5)
      .lean(),
  ]);

  const f = (s: string) => flightAgg.find((r) => r._id === s);
  const b = (s: string) => bookingAgg.find((r) => r._id === s);

  return {
    flights: {
      total: flightAgg.reduce((n, r) => n + r.count, 0),
      scheduled: f("Scheduled")?.count ?? 0,
      openSeats: f("Scheduled")?.seats ?? 0,
    },
    bookings: {
      total: bookingAgg.reduce((n, r) => n + r.count, 0),
      confirmed: b("Confirmed")?.count ?? 0,
      pending: b("Pending")?.count ?? 0,
      cancelled: b("Cancelled")?.count ?? 0,
    },
    // Reservation value only: no payments are collected, so this is not cash received.
    bookedValue: (b("Confirmed")?.revenue ?? 0) + (b("Pending")?.revenue ?? 0),
    recent: plain<AdminBooking[]>(recent),
    lowSeats: plain<FlightType[]>(lowSeats),
  };
}

import { ApiError, isDuplicateKeyError } from "@/lib/api/response";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Flight from "@/models/Flight";
import type { BookingInput } from "@/lib/validation/booking";

import { computeTotal } from "./pricing";
import { paymentStatusFor } from "./payment";
import { generateBookingReference } from "./reference";
import { SEAT_HOLDING, canTransition, type BookingStatus } from "./status";

const MAX_REFERENCE_ATTEMPTS = 5;

/**
 * Creates a booking. Seats are reserved with a single conditional update
 * (never read-then-write), so concurrent requests cannot oversell a flight.
 * If the booking insert fails the seats are released.
 *
 * NOTE: Payment is a mock. The chosen method and a derived status are recorded
 * but no money moves and no card details are ever received.
 */
export async function createBooking(input: BookingInput) {
  await connectDB();

  if (input.idempotencyKey) {
    const existing = await Booking.findOne({
      idempotencyKey: input.idempotencyKey,
    });
    if (existing) return { booking: existing, created: false };
  }

  const flight = await Flight.findOneAndUpdate(
    {
      flightNo: input.flightNo,
      status: "Scheduled",
      availableSeats: { $gte: input.passengers },
    },
    { $inc: { availableSeats: -input.passengers } },
    { new: true }
  );

  if (!flight) {
    const known = await Flight.findOne({ flightNo: input.flightNo });
    if (!known) throw new ApiError(404, "FLIGHT_NOT_FOUND", "Flight not found.");
    if (known.status !== "Scheduled") {
      throw new ApiError(
        409,
        "FLIGHT_UNAVAILABLE",
        `This flight is ${String(known.status).toLowerCase()} and cannot be booked.`
      );
    }
    throw new ApiError(
      409,
      "INSUFFICIENT_SEATS",
      `Only ${known.availableSeats} seat(s) left on this flight.`
    );
  }

  const release = () =>
    Flight.updateOne(
      { _id: flight._id },
      { $inc: { availableSeats: input.passengers } }
    );

  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
    try {
      const booking = await Booking.create({
        bookingReference: generateBookingReference(),
        flightNo: flight.flightNo,
        flightId: flight._id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        passengers: input.passengers,
        additionalPassengers: input.additionalPassengers,
        classType: flight.classType,
        seatPreference: input.seatPreference,
        specialRequest: input.specialRequest,
        route: `${flight.originCode} → ${flight.destinationCode}`,
        departureDate: flight.departureDate,
        departureTime: flight.departureTime,
        totalAmount: computeTotal(flight.price, input.passengers),
        status: "Confirmed",
        paymentMethod: input.paymentMethod,
        paymentStatus: paymentStatusFor(input.paymentMethod),
        paidAt: paymentStatusFor(input.paymentMethod) === "Paid" ? new Date() : undefined,
        idempotencyKey: input.idempotencyKey,
      });
      return { booking, created: true };
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const msg = String((error as { message?: string }).message);
        if (msg.includes("idempotencyKey")) {
          // Lost a race with an identical request: return its booking.
          await release();
          const existing = await Booking.findOne({
            idempotencyKey: input.idempotencyKey,
          });
          if (existing) return { booking: existing, created: false };
        }
        continue; // reference collision: retry with a new reference
      }
      await release();
      throw error;
    }
  }

  await release();
  throw new ApiError(
    500,
    "REFERENCE_FAILED",
    "Could not allocate a booking reference."
  );
}

/** Guest lookup: both reference and email must match. */
export async function lookupBooking(reference: string, email: string) {
  await connectDB();
  const booking = await Booking.findOne({
    bookingReference: reference,
    email,
  });
  if (!booking) {
    throw new ApiError(
      404,
      "BOOKING_NOT_FOUND",
      "No booking matches those details."
    );
  }
  return booking;
}

/** Applies a status change if the state machine allows it; releases seats on cancel. */
export async function changeBookingStatus(
  reference: string,
  to: BookingStatus,
  filter: { email?: string } = {}
) {
  await connectDB();
  const current = await Booking.findOne({
    bookingReference: reference,
    ...filter,
  });
  if (!current) {
    throw new ApiError(404, "BOOKING_NOT_FOUND", "Booking not found.");
  }

  const from = current.status as BookingStatus;
  if (!canTransition(from, to)) {
    throw new ApiError(
      409,
      "INVALID_TRANSITION",
      `Cannot change a ${from} booking to ${to}.`
    );
  }

  // Compare-and-set on the previous status so a concurrent change loses cleanly.
  const updated = await Booking.findOneAndUpdate(
    { _id: current._id, status: from },
    { status: to },
    { new: true }
  );
  if (!updated) {
    throw new ApiError(
      409,
      "CONFLICT",
      "Booking was modified by another request. Reload and retry."
    );
  }

  if (to === "Cancelled" && SEAT_HOLDING.includes(from) && current.flightId) {
    await Flight.updateOne(
      { _id: current.flightId },
      { $inc: { availableSeats: current.passengers } }
    );
  }
  return updated;
}

/**
 * Staff confirm that an in-person payment was received. This is the only way a
 * "Pay later" booking becomes "Paid", which is what unlocks its e-ticket.
 * Compare-and-set, so it can't be applied twice or to a cancelled booking.
 */
export async function markBookingPaid(reference: string) {
  await connectDB();
  const updated = await Booking.findOneAndUpdate(
    { bookingReference: reference, status: { $ne: "Cancelled" }, paymentStatus: { $ne: "Paid" } },
    { paymentStatus: "Paid", paidAt: new Date() },
    { new: true }
  );
  if (updated) return updated;

  const current = await Booking.findOne({ bookingReference: reference });
  if (!current) throw new ApiError(404, "BOOKING_NOT_FOUND", "Booking not found.");
  if (current.status === "Cancelled") {
    throw new ApiError(409, "BOOKING_CANCELLED", "A cancelled booking can't be marked as paid.");
  }
  throw new ApiError(409, "ALREADY_PAID", "This booking is already marked as paid.");
}

import { beforeEach, describe, expect, it, vi } from "vitest";

// Models are mocked: these tests verify the service's logic and call shapes,
// NOT real MongoDB atomicity (that needs an integration test against a DB).
const flightFindOneAndUpdate = vi.fn();
const flightFindOne = vi.fn();
const flightUpdateOne = vi.fn();
const bookingCreate = vi.fn();
const bookingFindOne = vi.fn();
const bookingFindOneAndUpdate = vi.fn();

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Flight", () => ({
  default: {
    findOneAndUpdate: flightFindOneAndUpdate,
    findOne: flightFindOne,
    updateOne: flightUpdateOne,
  },
}));
vi.mock("@/models/Booking", () => ({
  default: {
    create: bookingCreate,
    findOne: bookingFindOne,
    findOneAndUpdate: bookingFindOneAndUpdate,
  },
}));

const { createBooking, changeBookingStatus, lookupBooking, markBookingPaid } = await import(
  "@/lib/bookings/service"
);

const input = {
  flightNo: "JT-204",
  fullName: "Juan Dela Cruz",
  email: "juan@example.com",
  phone: "+63 917 123 4567",
  passengers: 2,
  additionalPassengers: ["Maria Dela Cruz"],
  seatPreference: "Window seat" as const,
  specialRequest: "",
  paymentMethod: "Airport counter" as const,
  idempotencyKey: "0123456789abcdef0123",
};

const flight = {
  _id: "f1",
  flightNo: "JT-204",
  originCode: "MNL",
  destinationCode: "NRT",
  departureDate: "2026-12-01",
  departureTime: "08:00",
  classType: "Economy",
  price: 1000,
};

beforeEach(() => {
  vi.clearAllMocks();
  bookingFindOne.mockResolvedValue(null);
});

describe("createBooking", () => {
  it("reserves seats atomically and computes the price server-side", async () => {
    flightFindOneAndUpdate.mockResolvedValue(flight);
    bookingCreate.mockImplementation(async (d) => d);

    const { booking, created } = await createBooking(input);

    const [filter, update] = flightFindOneAndUpdate.mock.calls[0];
    expect(filter).toMatchObject({ status: "Scheduled", availableSeats: { $gte: 2 } });
    expect(update).toEqual({ $inc: { availableSeats: -2 } });
    expect(created).toBe(true);
    expect(booking.totalAmount).toBe(2000);
    expect(booking.classType).toBe("Economy");
    expect(booking.bookingReference).toMatch(/^JT-/);
  });

  it("returns the existing booking for a repeated idempotency key without touching seats", async () => {
    bookingFindOne.mockResolvedValue({ bookingReference: "JT-EXISTING" });
    const r = await createBooking(input);
    expect(r.created).toBe(false);
    expect(flightFindOneAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 409 INSUFFICIENT_SEATS when the flight is sold out", async () => {
    flightFindOneAndUpdate.mockResolvedValue(null);
    flightFindOne.mockResolvedValue({ status: "Scheduled", availableSeats: 1 });
    await expect(createBooking(input)).rejects.toMatchObject({ status: 409, code: "INSUFFICIENT_SEATS" });
    expect(bookingCreate).not.toHaveBeenCalled();
  });

  it("returns 409 for non-scheduled flights and 404 for unknown flights", async () => {
    flightFindOneAndUpdate.mockResolvedValue(null);
    flightFindOne.mockResolvedValueOnce({ status: "Cancelled", availableSeats: 10 });
    await expect(createBooking(input)).rejects.toMatchObject({ code: "FLIGHT_UNAVAILABLE" });
    flightFindOne.mockResolvedValueOnce(null);
    await expect(createBooking(input)).rejects.toMatchObject({ status: 404 });
  });

  it("retries on reference collision", async () => {
    flightFindOneAndUpdate.mockResolvedValue(flight);
    bookingCreate
      .mockRejectedValueOnce({ code: 11000, message: "dup key bookingReference" })
      .mockImplementation(async (d) => d);
    const { created } = await createBooking(input);
    expect(created).toBe(true);
    expect(bookingCreate).toHaveBeenCalledTimes(2);
    expect(flightUpdateOne).not.toHaveBeenCalled();
  });

  it("releases seats if the insert fails", async () => {
    flightFindOneAndUpdate.mockResolvedValue(flight);
    bookingCreate.mockRejectedValue(new Error("db down"));
    await expect(createBooking(input)).rejects.toThrow("db down");
    expect(flightUpdateOne).toHaveBeenCalledWith({ _id: "f1" }, { $inc: { availableSeats: 2 } });
  });
});

describe("changeBookingStatus", () => {
  it("cancels a confirmed booking and releases its seats", async () => {
    bookingFindOne.mockResolvedValue({ _id: "b1", status: "Confirmed", flightId: "f1", passengers: 2 });
    bookingFindOneAndUpdate.mockResolvedValue({ status: "Cancelled" });
    await changeBookingStatus("JT-X", "Cancelled");
    expect(flightUpdateOne).toHaveBeenCalledWith({ _id: "f1" }, { $inc: { availableSeats: 2 } });
  });

  it("rejects invalid transitions and does not touch seats", async () => {
    bookingFindOne.mockResolvedValue({ _id: "b1", status: "Cancelled", flightId: "f1", passengers: 2 });
    await expect(changeBookingStatus("JT-X", "Confirmed")).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    expect(flightUpdateOne).not.toHaveBeenCalled();
  });

  it("does not release seats twice when a concurrent change wins", async () => {
    bookingFindOne.mockResolvedValue({ _id: "b1", status: "Confirmed", flightId: "f1", passengers: 2 });
    bookingFindOneAndUpdate.mockResolvedValue(null);
    await expect(changeBookingStatus("JT-X", "Cancelled")).rejects.toMatchObject({ code: "CONFLICT" });
    expect(flightUpdateOne).not.toHaveBeenCalled();
  });
});

describe("lookupBooking", () => {
  it("requires both reference and email to match", async () => {
    bookingFindOne.mockResolvedValueOnce({ bookingReference: "JT-X" });
    await lookupBooking("JT-X", "a@b.co");
    expect(bookingFindOne).toHaveBeenCalledWith({ bookingReference: "JT-X", email: "a@b.co" });
  });
  it("404s with a generic message when nothing matches", async () => {
    await expect(lookupBooking("JT-X", "a@b.co")).rejects.toMatchObject({ status: 404 });
  });
});

describe("mock payment", () => {
  it("derives the status from the method", async () => {
    const { paymentStatusFor } = await import("@/lib/bookings/payment");
    expect(paymentStatusFor("Card")).toBe("Paid");
    expect(paymentStatusFor("GCash")).toBe("Paid");
    expect(paymentStatusFor("Airport counter")).toBe("Pay later");
    expect(paymentStatusFor("Jetour office")).toBe("Pay later");
  });
});

describe("markBookingPaid", () => {
  it("only flips unpaid, non-cancelled bookings (compare-and-set)", async () => {
    bookingFindOneAndUpdate.mockResolvedValue({ paymentStatus: "Paid" });
    await markBookingPaid("JT-ABC12345");
    const [filter, update] = bookingFindOneAndUpdate.mock.calls[0];
    expect(filter).toMatchObject({
      bookingReference: "JT-ABC12345",
      status: { $ne: "Cancelled" },
      paymentStatus: { $ne: "Paid" },
    });
    expect(update).toMatchObject({ paymentStatus: "Paid" });
  });

  it("refuses a cancelled booking and a double payment", async () => {
    bookingFindOneAndUpdate.mockResolvedValue(null);
    bookingFindOne.mockResolvedValueOnce({ status: "Cancelled" });
    await expect(markBookingPaid("JT-X")).rejects.toMatchObject({ code: "BOOKING_CANCELLED" });
    bookingFindOne.mockResolvedValueOnce({ status: "Confirmed", paymentStatus: "Paid" });
    await expect(markBookingPaid("JT-X")).rejects.toMatchObject({ code: "ALREADY_PAID" });
    bookingFindOne.mockResolvedValueOnce(null);
    await expect(markBookingPaid("JT-X")).rejects.toMatchObject({ code: "BOOKING_NOT_FOUND" });
  });
});

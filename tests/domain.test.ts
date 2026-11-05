import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { computeTotal } from "@/lib/bookings/pricing";
import { generateBookingReference } from "@/lib/bookings/reference";
import { canTransition } from "@/lib/bookings/status";
import { ApiError, handleError } from "@/lib/api/response";
import {
  bookingInputSchema,
  bookingLookupSchema,
  bookingStatusPatchSchema,
} from "@/lib/validation/booking";
import { flightInputSchema, flightPatchSchema } from "@/lib/validation/flight";

describe("booking reference", () => {
  it("matches the format and avoids ambiguous characters", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateBookingReference()).toMatch(/^JT-[A-HJKMNP-Z2-9]{8}$/);
    }
  });
  it("does not collide in a large sample", () => {
    const set = new Set(Array.from({ length: 20000 }, () => generateBookingReference()));
    expect(set.size).toBe(20000);
  });
});

describe("pricing", () => {
  it("multiplies unit price by passengers", () => {
    expect(computeTotal(12499, 3)).toBe(37497);
  });
  it("avoids floating point drift", () => {
    expect(computeTotal(0.1, 3)).toBe(0.3);
  });
  it("rejects invalid input", () => {
    expect(() => computeTotal(-1, 1)).toThrow();
    expect(() => computeTotal(100, 0)).toThrow();
    expect(() => computeTotal(100, 1.5)).toThrow();
    expect(() => computeTotal(NaN, 1)).toThrow();
  });
});

describe("booking status machine", () => {
  it("allows forward transitions only", () => {
    expect(canTransition("Pending", "Confirmed")).toBe(true);
    expect(canTransition("Pending", "Cancelled")).toBe(true);
    expect(canTransition("Confirmed", "Cancelled")).toBe(true);
  });
  it("blocks reversals and self-transitions", () => {
    expect(canTransition("Cancelled", "Confirmed")).toBe(false);
    expect(canTransition("Cancelled", "Pending")).toBe(false);
    expect(canTransition("Confirmed", "Pending")).toBe(false);
    expect(canTransition("Confirmed", "Confirmed")).toBe(false);
  });
});

const validBooking = {
  flightNo: "jt-204",
  fullName: "Juan Dela Cruz",
  email: " Juan@Example.com ",
  phone: "+63 917 123 4567",
  passengers: "2",
  additionalPassengers: ["Maria Dela Cruz"],
};

describe("booking validation", () => {
  it("normalizes valid input", () => {
    const r = bookingInputSchema.parse(validBooking);
    expect(r.flightNo).toBe("JT-204");
    expect(r.email).toBe("juan@example.com");
    expect(r.passengers).toBe(2);
    expect(r.seatPreference).toBe("Window seat");
  });
  it.each([
    ["zero passengers", { passengers: 0 }],
    ["too many passengers", { passengers: 50 }],
    ["negative passengers", { passengers: -1 }],
    ["bad email", { email: "nope" }],
    ["bad phone", { phone: "abc" }],
    ["short name", { fullName: "J" }],
    ["unknown seat pref", { seatPreference: "Cockpit" }],
  ])("rejects %s", (_n, override) => {
    expect(() => bookingInputSchema.parse({ ...validBooking, ...override })).toThrow(ZodError);
  });
  it("ignores client-supplied price/status/class (not in schema)", () => {
    const r = bookingInputSchema.parse({
      ...validBooking,
      totalAmount: 1,
      status: "Confirmed",
      classType: "Business",
    });
    expect(r).not.toHaveProperty("totalAmount");
    expect(r).not.toHaveProperty("status");
    expect(r).not.toHaveProperty("classType");
  });
  it("normalizes lookup input", () => {
    expect(
      bookingLookupSchema.parse({ reference: " jt-abc12345 ", email: "A@B.co" })
    ).toEqual({ reference: "JT-ABC12345", email: "a@b.co" });
  });
  it("only accepts a status in the status patch", () => {
    expect(() => bookingStatusPatchSchema.parse({ status: "Confirmed", totalAmount: 1 })).toThrow();
    expect(() => bookingStatusPatchSchema.parse({ status: "Refunded" })).toThrow();
  });
});

const validFlight = {
  flightNo: "jt-1",
  origin: "Manila",
  destination: "Tokyo",
  originCode: "mnl",
  destinationCode: "nrt",
  departureDate: "2026-12-01",
  departureTime: "08:00",
  arrivalTime: "13:00",
  duration: "4h",
  price: "12499",
  availableSeats: "30",
};

describe("flight validation", () => {
  it("applies defaults and normalization", () => {
    const f = flightInputSchema.parse(validFlight);
    expect(f.flightNo).toBe("JT-1");
    expect(f.originCode).toBe("MNL");
    expect(f.price).toBe(12499);
    expect(f.classType).toBe("Economy");
    expect(f.stops).toBe(0);
  });
  it("rejects bad price, seats and codes", () => {
    expect(() => flightInputSchema.parse({ ...validFlight, price: 0 })).toThrow();
    expect(() => flightInputSchema.parse({ ...validFlight, availableSeats: -1 })).toThrow();
    expect(() => flightInputSchema.parse({ ...validFlight, originCode: "MANILA" })).toThrow();
  });
  it("PATCH rejects unknown fields and empty bodies", () => {
    expect(() => flightPatchSchema.parse({ _id: "x" })).toThrow();
    expect(() => flightPatchSchema.parse({})).toThrow();
    expect(flightPatchSchema.parse({ status: "Delayed" })).toEqual({ status: "Delayed" });
  });
});

describe("api error handling", () => {
  it("maps ApiError to its status", async () => {
    const res = handleError(new ApiError(409, "X", "nope"), "t");
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ success: false, code: "X" });
  });
  it("maps ZodError to 400 with field details", async () => {
    const err = (() => {
      try { bookingInputSchema.parse({}); } catch (e) { return e; }
    })();
    const res = handleError(err, "t");
    expect(res.status).toBe(400);
    expect((await res.json()).details.fields.length).toBeGreaterThan(0);
  });
  it("maps duplicate key to 409 and unknown errors to 500 without leaking", async () => {
    expect(handleError({ code: 11000 }, "t").status).toBe(409);
    const res = handleError(new Error("mongodb://user:pw@host"), "t");
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("mongodb://");
  });
  it("maps bad JSON to 400", () => {
    expect(handleError(new SyntaxError("x"), "t").status).toBe(400);
  });
});

describe("flight PATCH never applies defaults", () => {
  it("a partial update contains only the submitted fields", () => {
    expect(flightPatchSchema.parse({ price: "5000" })).toEqual({ price: 5000 });
  });
});

import { toPublicBooking } from "@/lib/bookings/serialize";

describe("passenger names", () => {
  it("requires exactly passengers - 1 additional names", () => {
    expect(() => bookingInputSchema.parse({ ...validBooking, additionalPassengers: [] })).toThrow(ZodError);
    expect(() =>
      bookingInputSchema.parse({ ...validBooking, additionalPassengers: ["Maria Dela Cruz", "Extra Person"] })
    ).toThrow(ZodError);
    expect(
      bookingInputSchema.parse({ ...validBooking, passengers: 1, additionalPassengers: [] }).additionalPassengers
    ).toEqual([]);
  });
  it("defaults a solo traveller without sending names", () => {
    const { additionalPassengers } = bookingInputSchema.parse({ ...validBooking, passengers: 1, additionalPassengers: undefined });
    expect(additionalPassengers).toEqual([]);
  });
  it("rejects blank or too-short additional names", () => {
    expect(() => bookingInputSchema.parse({ ...validBooking, additionalPassengers: ["x"] })).toThrow(ZodError);
  });
});

describe("public booking serialization", () => {
  it("exposes guest fields only (no ids or idempotency key)", () => {
    const out = toPublicBooking({
      _id: "abc",
      __v: 0,
      idempotencyKey: "secret-key-123456",
      bookingReference: "JT-ABCD2345",
      status: "Confirmed",
      flightNo: "JT-101",
      route: "MNL → NRT",
      departureDate: "2026-12-01",
      departureTime: "08:00",
      classType: "Economy",
      fullName: "Juan",
      email: "j@x.co",
      phone: "+63 917 000 0000",
      passengers: 2,
      additionalPassengers: ["Maria"],
      seatPreference: "Window seat",
      totalAmount: 20000,
      createdAt: new Date("2026-11-04T00:00:00Z"),
    } as never);
    expect(out).not.toHaveProperty("_id");
    expect(out).not.toHaveProperty("idempotencyKey");
    expect(out.createdAt).toBe("2026-11-04T00:00:00.000Z");
    expect(out.additionalPassengers).toEqual(["Maria"]);
    expect(out.specialRequest).toBe("");
  });
  it("tolerates legacy bookings without additionalPassengers", () => {
    const out = toPublicBooking({ bookingReference: "JT-BKG-1234", status: "Confirmed", passengers: 1 } as never);
    expect(out.additionalPassengers).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";

import { parseConfirmation, parseRecent } from "@/lib/bookings/clientStore";

describe("client store parsing (never trusts storage)", () => {
  it("parses a valid recent list and drops malformed entries", () => {
    const raw = JSON.stringify([
      { reference: "JT-AAAA2222", email: "a@b.co" },
      { reference: 5, email: "x" },
      "junk",
      null,
    ]);
    expect(parseRecent(raw)).toEqual([{ reference: "JT-AAAA2222", email: "a@b.co" }]);
  });
  it("returns [] for null, garbage or non-array JSON", () => {
    expect(parseRecent(null)).toEqual([]);
    expect(parseRecent("{not json")).toEqual([]);
    expect(parseRecent('{"a":1}')).toEqual([]);
  });
  it("parses a stored confirmation or returns null", () => {
    expect(parseConfirmation('{"bookingReference":"JT-X"}')).toMatchObject({ bookingReference: "JT-X" });
    expect(parseConfirmation(null)).toBeNull();
    expect(parseConfirmation("%%%")).toBeNull();
  });
});

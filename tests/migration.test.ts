import { describe, expect, it } from "vitest";

import { floatingDeparture } from "../scripts/floating-departure.mjs";

describe("migration: floatingDeparture", () => {
  it("stores the printed wall-clock time as UTC, independent of machine timezone", () => {
    expect(floatingDeparture("2026-12-01", "07:30")!.toISOString()).toBe("2026-12-01T07:30:00.000Z");
    expect(floatingDeparture("2026-12-01", "7:05")!.toISOString()).toBe("2026-12-01T07:05:00.000Z");
    expect(floatingDeparture(" 2026-12-31 ", " 23:59 ")!.toISOString()).toBe("2026-12-31T23:59:00.000Z");
  });
  it("never guesses: returns null for anything it can't read exactly", () => {
    for (const [d, t] of [
      ["May 24, 2026", "08:00"], // not the admin-form format
      ["2026-12-01", "8:00 AM"],
      ["2026-02-31", "08:00"], // impossible date must not roll over to March
      ["2026-12-01", "25:00"],
      ["2026-12-01", "08:60"],
      ["", ""],
      [undefined, undefined],
    ]) {
      expect(floatingDeparture(d, t)).toBeNull();
    }
  });
});

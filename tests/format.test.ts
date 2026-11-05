import { describe, expect, it } from "vitest";

import { formatPeso } from "@/lib/format";

describe("formatPeso", () => {
  it("formats whole pesos with grouping", () => {
    expect(formatPeso(12499)).toBe("₱12,499");
  });
  it("shows centavos when exact", () => {
    expect(formatPeso(1234.5, true)).toBe("₱1,234.50");
  });
});

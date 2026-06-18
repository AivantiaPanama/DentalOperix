import { describe, expect, it } from "vitest";
import { formatDateMX, formatDateTimeMX } from "./date-format";

describe("date-format utils", () => {
  it("formats YYYY-MM-DD to dd/MM/yyyy", () => {
    expect(formatDateMX("2026-06-30")).toBe("30/06/2026");
  });

  it("formats Date objects to dd/MM/yyyy", () => {
    expect(formatDateMX(new Date("2026-12-01"))).toBe("01/12/2026");
  });

  it("returns raw string for invalid date values", () => {
    expect(formatDateMX("invalid-date")).toBe("invalid-date");
  });

  it("formats date and time to dd/MM/yyyy HH:mm", () => {
    expect(formatDateTimeMX("2026-06-30", "14:30")).toBe("30/06/2026 14:30");
  });
});

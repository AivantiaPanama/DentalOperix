import { describe, expect, it } from "vitest";
import { normalizeDisplayText, normalizeMojibakeText, normalizeServiceName } from "./text-normalization";

describe("text normalization", () => {
  it("normalizes common UTF-8 mojibake without changing valid Spanish text", () => {
    expect(normalizeMojibakeText("OdontologÃa Preventiva")).toBe("Odontología Preventiva");
    expect(normalizeMojibakeText("DiseÃ±o de Sonrisa")).toBe("Diseño de Sonrisa");
    expect(normalizeMojibakeText("RevisiÃ³n Dental")).toBe("Revisión Dental");
    expect(normalizeMojibakeText("Juanito AlimaÃ±a")).toBe("Juanito Alimaña");
    expect(normalizeMojibakeText("Odontología Preventiva")).toBe("Odontología Preventiva");
  });

  it("normalizes display values defensively", () => {
    expect(normalizeDisplayText("  Roxana MartÃnes  ")).toBe("Roxana Martínes");
    expect(normalizeDisplayText(undefined)).toBe("");
    expect(normalizeDisplayText(null)).toBe("");
  });

  it("returns unknown for empty service names", () => {
    expect(normalizeServiceName(" Implantes Dentales ")).toBe("Implantes Dentales");
    expect(normalizeServiceName("")).toBe("unknown");
  });
});

import { describe, expect, it } from "vitest";
import { calculateLeadScore } from "./lead-scoring";

describe("calculateLeadScore", () => {
  it("scores a high urgency prioritized service as warm", () => {
    const result = calculateLeadScore({
      urgency: "alta",
      treatment: "Ortodoncia",
      status: "nuevo",
    });

    expect(result.score).toBe(65);
    expect(result.category).toBe("warm");
    expect(result.reasons).toEqual(
      expect.arrayContaining(["Alta urgencia", "Servicio prioritario: Ortodoncia", "Lead nuevo"]),
    );
  });

  it("scores a cold lead with low urgency and no service", () => {
    const result = calculateLeadScore({
      urgency: "baja",
      treatment: "",
      status: "nuevo",
      source: "",
    });

    expect(result.score).toBe(25);
    expect(result.category).toBe("cold");
  });

  it("classifies strong qualified leads as hot", () => {
    const result = calculateLeadScore({
      urgency: "alta",
      treatment: "Implantes Dentales",
      status: "nuevo",
      source: "superconversion",
    });

    expect(result.score).toBe(80);
    expect(result.category).toBe("hot");
  });
});

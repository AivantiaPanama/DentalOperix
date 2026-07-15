import { describe, expect, it } from "vitest";
import type { CommercialDemoContext } from "../context/commercialDemoContext.types";
import { buildCommercialNarrative } from "./buildCommercialNarrative";

function createContext(overrides: Partial<CommercialDemoContext> = {}): CommercialDemoContext {
  return {
    version: "1.0",
    readinessLevel: "developing",
    focusAreas: ["patient-follow-up", "appointment-management"],
    recommendedJourney: ["lead-management", "appointment-operations"],
    source: "growth-readiness-report",
    ...overrides,
  };
}

describe("buildCommercialNarrative", () => {
  it("builds a narrative for a developing clinic from a growth readiness report", () => {
    const narrative = buildCommercialNarrative(
      createContext({ readinessLevel: "developing", source: "growth-readiness-report" }),
    );

    expect(narrative.clinicSituation.toLowerCase()).toContain("base funcional");
    expect(narrative.openingMessage.toLowerCase()).toContain("considerando");
    expect(narrative.primaryOpportunity.toLowerCase()).toContain("continuidad");
  });

  it("builds a narrative for an organized clinic from a direct demo", () => {
    const narrative = buildCommercialNarrative(
      createContext({ readinessLevel: "organized", source: "direct-demo" }),
    );

    expect(narrative.clinicSituation.toLowerCase()).toContain("organizada");
    expect(narrative.openingMessage.toLowerCase()).toContain("demostración");
    expect(narrative.meetingObjective.toLowerCase()).toContain("mostrar");
  });

  it("builds a narrative that emphasizes high-opportunity positioning", () => {
    const narrative = buildCommercialNarrative(
      createContext({ readinessLevel: "high-opportunity", focusAreas: ["operational-visibility"] }),
    );

    expect(narrative.clinicSituation.toLowerCase()).toContain("oportunidades");
    expect(narrative.expectedBenefit.toLowerCase()).toContain("impacto");
  });

  it("prioritizes the first focus area as the primary opportunity", () => {
    const narrative = buildCommercialNarrative(
      createContext({ focusAreas: ["patient-follow-up", "appointment-management"] }),
    );

    expect(narrative.primaryOpportunity.toLowerCase()).toContain("continuidad");
    expect(narrative.expectedBenefit.toLowerCase()).toContain("relación");
  });

  it("adds evidence emphasis from multiple focus areas", () => {
    const narrative = buildCommercialNarrative(
      createContext({
        focusAreas: ["patient-follow-up", "appointment-management", "team-coordination"],
      }),
    );

    expect(narrative.evidenceEmphasis.length).toBeGreaterThanOrEqual(2);
    expect(
      narrative.evidenceEmphasis.some((item) => item.toLowerCase().includes("seguimiento")),
    ).toBe(true);
    expect(
      narrative.evidenceEmphasis.some((item) => item.toLowerCase().includes("visibilidad")),
    ).toBe(true);
  });

  it("builds a journey rationale from several journey steps", () => {
    const narrative = buildCommercialNarrative(
      createContext({
        recommendedJourney: [
          "lead-management",
          "appointment-operations",
          "assistant-workspace",
          "operational-evidence",
        ],
      }),
    );

    expect(narrative.journeyRationale.toLowerCase()).toContain("recorrido");
    expect(narrative.journeyRationale.toLowerCase()).toContain("contacto");
  });

  it("falls back to operational visibility when focus areas are empty", () => {
    const narrative = buildCommercialNarrative(createContext({ focusAreas: [] }));

    expect(narrative.primaryOpportunity.toLowerCase()).toContain("visión");
    expect(narrative.evidenceEmphasis.length).toBeGreaterThan(0);
  });

  it("falls back to a general journey rationale when the journey is empty", () => {
    const narrative = buildCommercialNarrative(createContext({ recommendedJourney: [] }));

    expect(narrative.journeyRationale.toLowerCase()).toContain("recorrido");
    expect(narrative.journeyRationale.toLowerCase()).toContain("clínica");
  });

  it("is deterministic for the same input", () => {
    const context = createContext({
      readinessLevel: "organized",
      focusAreas: ["operational-visibility", "team-coordination"],
    });

    const first = buildCommercialNarrative(context);
    const second = buildCommercialNarrative(context);

    expect(first).toEqual(second);
  });

  it("does not mutate the input context", () => {
    const context = createContext({ focusAreas: ["patient-follow-up", "operational-visibility"] });
    const original = structuredClone(context);

    buildCommercialNarrative(context);

    expect(context).toEqual(original);
  });

  it("returns non-empty text for all required fields", () => {
    const narrative = buildCommercialNarrative(createContext());

    const stringFields = [
      narrative.headline,
      narrative.openingMessage,
      narrative.clinicSituation,
      narrative.primaryOpportunity,
      narrative.expectedBenefit,
      narrative.meetingObjective,
      narrative.journeyRationale,
      narrative.closingMessage,
    ];

    expect(
      stringFields.every((value) => typeof value === "string" && value.trim().length > 0),
    ).toBe(true);
    expect(Array.isArray(narrative.evidenceEmphasis)).toBe(true);
    expect(narrative.evidenceEmphasis.length).toBeGreaterThan(0);
  });
});

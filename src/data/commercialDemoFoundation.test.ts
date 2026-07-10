import { describe, expect, it } from "vitest";

import {
  commercialDemoFoundation,
  getCommercialDemoFoundationById,
} from "./commercialDemoFoundation";

describe("commercial demo foundation", () => {
  it("exposes the initial new-patient-acquisition scenario with the requested fields", () => {
    expect(commercialDemoFoundation.scenario).toMatchObject({
      id: "new-patient-acquisition",
      name: "Paciente nuevo interesado en iniciar un tratamiento dental",
      description: expect.stringContaining("paciente nuevo"),
      audience: expect.stringContaining("paciente"),
      commercialGoal: expect.stringContaining("captar"),
    });
  });

  it("includes patient, clinic, and commercial evidence layers", () => {
    expect(commercialDemoFoundation.patientJourney.length).toBeGreaterThan(0);
    expect(commercialDemoFoundation.clinicJourney.length).toBeGreaterThan(0);
    expect(commercialDemoFoundation.commercialEvidence.length).toBeGreaterThan(0);
    expect(commercialDemoFoundation.supportingCapabilities).toEqual(
      expect.arrayContaining(["Lead Management", "Patient Identity Foundation"]),
    );
  });

  it("can retrieve the foundation by id", () => {
    const scenario = getCommercialDemoFoundationById("new-patient-acquisition");

    expect(scenario?.scenario.id).toBe("new-patient-acquisition");
  });
});

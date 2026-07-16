import { describe, expect, it } from "vitest";

import { buildPatientContinuityContext } from "../context/patient-continuity/buildPatientContinuityContext";
import { SignalRegistry } from "../registry";
import { LeadFollowUpRule } from "../rules";
import { PatientContinuityRule } from "./PatientContinuityRule";

function createBaseContext(overrides?: Partial<Parameters<typeof buildPatientContinuityContext>[0]>) {
  return buildPatientContinuityContext(
    {
      patientId: "patient-001",
      patientProfile: {
        id: "patient-001",
        displayName: "Ana Díaz",
        firstName: "Ana",
        lastName: "Díaz",
        phone: "987654321",
        email: "ana@example.com",
        birthDate: "1990-02-14",
        address: "Av. Siempre Viva 123",
        emergencyContact: "José Díaz · 912345678",
        preferredContactMethod: "WhatsApp",
        treatmentInterest: "Ortodoncia",
        preferredDate: "",
        latestStatus: "contactado",
        source: "read-model",
        createdAt: "2024-02-02",
        notes: "Perfil validado",
        sourceLeadIds: ["lead-001"],
        missingFields: [],
        completionPercentage: 100,
        administrativeStatus: "verified",
      },
      appointments: [
        {
          id: "a-1",
          name: "Ana Díaz",
          email: "ana@example.com",
          phone: "987654321",
          service: "Ortodoncia",
          date: "2026-06-01",
          time: "10:00",
          status: "confirmed",
          notes: "Última cita registrada",
        },
      ],
      clinicalAggregate: {
        patientId: "patient-001",
        treatmentPlans: [
          {
            patientId: "patient-001",
            treatmentPlanId: "tp-001",
            planName: "Plan ortodoncia",
            status: "active",
            priority: "high",
            startDate: "2026-01-01",
            targetEndDate: "2026-12-01",
            source: "read-model",
            isMock: false,
            notes: "",
          },
        ],
        treatmentStages: [],
        clinicalOutcomes: [],
      },
      ...overrides,
    },
    new Date("2026-07-15T12:00:00.000Z"),
  );
}

describe("PatientContinuityRule", () => {
  it("generates a signal when continuity is stale and no future appointment exists", () => {
    const rule = new PatientContinuityRule();
    const context = createBaseContext();

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));

    expect(signal).not.toBeNull();
    expect(signal?.type).toBe("patient_continuity_attention");
    expect(signal?.priority).toBe("medium");
  });

  it("does not generate a signal when activity is recent", () => {
    const rule = new PatientContinuityRule();
    const context = createBaseContext({
      appointments: [
        {
          id: "a-1",
          name: "Ana Díaz",
          email: "ana@example.com",
          phone: "987654321",
          service: "Ortodoncia",
          date: "2026-07-10",
          time: "10:00",
          status: "confirmed",
        },
      ],
    });

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));

    expect(signal).toBeNull();
  });

  it("does not generate a signal when a future appointment exists", () => {
    const rule = new PatientContinuityRule();
    const context = createBaseContext({
      appointments: [
        {
          id: "a-1",
          name: "Ana Díaz",
          email: "ana@example.com",
          phone: "987654321",
          service: "Ortodoncia",
          date: "2026-06-01",
          time: "10:00",
          status: "confirmed",
        },
        {
          id: "a-2",
          name: "Ana Díaz",
          email: "ana@example.com",
          phone: "987654321",
          service: "Ortodoncia",
          date: "2026-07-20",
          time: "10:00",
          status: "confirmed",
        },
      ],
    });

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));

    expect(signal).toBeNull();
  });

  it("does not generate a signal for incomplete context", () => {
    const rule = new PatientContinuityRule();
    const context = buildPatientContinuityContext(
      {
        patientId: "patient-002",
        patientProfile: undefined,
        appointments: [],
        clinicalAggregate: undefined,
      },
      new Date("2026-07-15T12:00:00.000Z"),
    );

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));

    expect(signal).toBeNull();
  });

  it("builds explainable operational evidence", () => {
    const rule = new PatientContinuityRule();
    const context = createBaseContext();

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));

    expect(signal?.evidence).toHaveLength(4);
    expect(signal?.evidence[0].description).toContain("days ago");
    expect(signal?.evidence.some((item) => /diagnostic|treatment|abandon/i.test(item.description))).toBe(false);
  });

  it("registers the rule definition and preserves lead intelligence", () => {
    const registry = new SignalRegistry();
    const rule = new PatientContinuityRule();
    const leadRule = new LeadFollowUpRule();

    rule.registerWithRegistry(registry);
    leadRule.registerWithRegistry(registry);

    expect(registry.get("patient-continuity-attention")).toBeDefined();
    expect(registry.get("lead-follow-up-required")).toBeDefined();
  });

  it("uses the provided reference date for deterministic evaluation", () => {
    const rule = new PatientContinuityRule();
    const context = createBaseContext();

    const signal = rule.evaluate(context, new Date("2026-07-15T12:00:00.000Z"));
    const signalLater = rule.evaluate(context, new Date("2026-07-20T12:00:00.000Z"));

    expect(signal).not.toBeNull();
    expect(signalLater).not.toBeNull();
  });
});

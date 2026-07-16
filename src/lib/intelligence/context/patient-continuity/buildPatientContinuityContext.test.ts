import { describe, expect, it } from "vitest";

import { buildPatientContinuityContext } from "./buildPatientContinuityContext";

describe("buildPatientContinuityContext", () => {
  it("builds a neutral continuity snapshot from existing patient and clinical context", () => {
    const context = buildPatientContinuityContext({
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
          date: "2026-07-10",
          time: "10:00",
          status: "confirmed",
          notes: "Control de seguimiento",
        },
        {
          id: "a-2",
          name: "Ana Díaz",
          email: "ana@example.com",
          phone: "987654321",
          service: "Limpieza",
          date: "2026-08-15",
          time: "09:00",
          status: "pending",
        },
      ],
      clinicalAggregate: {
        patientId: "patient-001",
        treatmentPlans: [{ patientId: "patient-001", treatmentPlanId: "tp-001", planName: "Plan ortodoncia", status: "active", priority: "high", startDate: "2026-01-01", targetEndDate: "2026-12-01", source: "read-model", isMock: false, notes: "" }],
        treatmentStages: [{ treatmentStageId: "ts-001", treatmentPlanId: "tp-001", patientId: "patient-001", stageName: "Colocación de brackets", status: "completed", sequence: "1", startedAt: "2026-01-10", completedAt: "2026-02-01", source: "read-model", isMock: false, notes: "" }],
        clinicalOutcomes: [{ clinicalOutcomeId: "co-001", treatmentPlanId: "tp-001", patientId: "patient-001", outcomeType: "Seguimiento", status: "recorded", outcomeValue: "Correcto", recordedAt: "2026-02-02", source: "read-model", isMock: false, notes: "" }],
      },
    });

    expect(context.entityType).toBe("patient");
    expect(context.entityId).toBe("patient-001");
    expect(context.patientName).toBe("Ana Díaz");
    expect(context.state).toBe("ready");
    expect(context.metadata?.latestAppointment?.service).toBe("Limpieza");
    expect(context.metadata?.appointmentCount).toBe(2);
    expect(context.metadata?.treatmentPlanNames).toContain("Plan ortodoncia");
    expect(context.metadata?.latestClinicalOutcome).toBe("Seguimiento");
  });

  it("falls back to an incomplete state when continuity data is missing", () => {
    const context = buildPatientContinuityContext({
      patientId: "patient-002",
      patientProfile: undefined,
      appointments: [],
      clinicalAggregate: undefined,
    });

    expect(context.state).toBe("incomplete");
    expect(context.metadata?.appointmentCount).toBe(0);
    expect(context.metadata?.notes).toContain("No operational continuity data");
  });
});

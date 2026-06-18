import { describe, expect, it } from "vitest";
import { buildOperationalDataQualitySummary } from "./operational-data-quality";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";

function patient(overrides: Partial<PatientAdministrativeProfile>): PatientAdministrativeProfile {
  return {
    id: "patient-1",
    displayName: "Paciente Demo",
    firstName: "Paciente",
    lastName: "Demo",
    phone: "+507 6000 0000",
    email: "paciente@example.com",
    birthDate: "",
    address: "",
    emergencyContact: "",
    preferredContactMethod: "",
    treatmentInterest: "Ortodoncia",
    preferredDate: "",
    latestStatus: "nuevo",
    source: "web",
    createdAt: "2025-01-01T00:00:00.000Z",
    notes: "",
    sourceLeadIds: ["lead-1"],
    missingFields: [],
    completionPercentage: 100,
    administrativeStatus: "pending-verification",
    ...overrides,
  };
}

function lead(overrides: Partial<LeadOperationsProfile>): LeadOperationsProfile {
  return {
    leadId: "lead-1",
    lead: {
      id: "lead-1",
      name: "Paciente Demo",
      phone: "+507 6000 0000",
      email: "paciente@example.com",
      treatment: "Ortodoncia",
      preferredDate: "",
      status: "nuevo",
      source: "web",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    operationalStatus: "seguimiento",
    priority: "normal",
    lastContactAt: "",
    nextFollowUpAt: "",
    contactResult: "",
    internalNote: "",
    updatedAt: "2025-01-01T00:00:00.000Z",
    updatedBy: "sistema",
    ...overrides,
  };
}

describe("operational data quality", () => {
  it("detects administrative and operational issues without clinical fields", () => {
    const summary = buildOperationalDataQualitySummary({
      patients: [patient({ phone: "", email: "", administrativeStatus: "incomplete" })],
      leadOperations: [lead({ lead: { ...lead({}).lead, phone: "", email: "" } })],
    });

    expect(summary.scope).toBe("administrative-operational");
    expect(summary.totals.issues).toBeGreaterThan(0);
    expect(summary.issues.some((issue) => issue.type === "patient.phone.missing")).toBe(true);
    expect(summary.limits.join(" ").toLowerCase()).toContain("no incluye historia clínica");
  });

  it("detects duplicate administrative contact data", () => {
    const summary = buildOperationalDataQualitySummary({
      patients: [
        patient({ id: "patient-1", email: "dup@example.com", phone: "+507 6000 0000" }),
        patient({ id: "patient-2", email: "DUP@example.com", phone: "+507 6000 0000" }),
      ],
      leadOperations: [],
    });

    expect(summary.issues.some((issue) => issue.type === "consistency.email.duplicate")).toBe(true);
    expect(summary.issues.some((issue) => issue.type === "consistency.phone.duplicate")).toBe(true);
  });

  it("treats placeholders and invalid email values as operational quality issues", () => {
    const summary = buildOperationalDataQualitySummary({
      patients: [
        patient({
          email: "Correo no registrado",
          phone: "Teléfono no registrado",
          displayName: "Paciente sin nombre",
          firstName: "",
          lastName: "",
          administrativeStatus: "incomplete",
        }),
      ],
      leadOperations: [lead({ lead: { ...lead({}).lead, email: "Blanqueamiento", treatment: "" } })],
    });

    expect(summary.issues.some((issue) => issue.type === "patient.email.missing")).toBe(true);
    expect(summary.issues.some((issue) => issue.type === "patient.phone.missing")).toBe(true);
    expect(summary.issues.some((issue) => issue.type === "lead.email.invalid")).toBe(true);
    expect(summary.issues.some((issue) => issue.type === "consistency.source_mapping.suspect")).toBe(true);
  });
});

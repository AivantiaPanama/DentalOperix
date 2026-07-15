import { describe, expect, it } from "vitest";
import { buildOperationalExecutiveKpis } from "./operational-kpis";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

function lead(overrides: Partial<LeadOperationsProfile>): LeadOperationsProfile {
  return {
    leadId: "lead-1",
    lead: {
      id: "lead-1",
      name: "Paciente Demo",
      phone: "+507 6000 0000",
      email: "paciente@example.com",
      treatment: "Ortodoncia",
      preferredDate: "2026-06-18",
      status: "agendada",
      source: "web",
      createdAt: "2026-06-10",
      notes: "",
    },
    operationalStatus: "nuevo",
    priority: "normal",
    lastContactAt: "",
    nextFollowUpAt: "",
    contactResult: "",
    internalNote: "",
    updatedAt: "2026-06-10",
    updatedBy: "sistema",
    ...overrides,
  };
}

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
    preferredDate: "2026-06-18",
    latestStatus: "nuevo",
    source: "web",
    createdAt: "2026-06-10",
    notes: "",
    sourceLeadIds: ["lead-1"],
    missingFields: [],
    completionPercentage: 100,
    administrativeStatus: "verified",
    ...overrides,
  };
}

describe("operational executive KPIs", () => {
  it("builds administrative-operational KPIs without clinical scope", () => {
    const kpis = buildOperationalExecutiveKpis({
      generatedAt: "2026-06-16T12:00:00.000Z",
      leadOperations: [
        lead({ operationalStatus: "nuevo" }),
        lead({
          leadId: "lead-2",
          operationalStatus: "descartado",
          lead: { ...lead({}).lead, id: "lead-2", status: "cancelada" },
        }),
      ],
      patients: [
        patient({}),
        patient({
          id: "patient-2",
          administrativeStatus: "pending-verification",
          completionPercentage: 70,
        }),
      ],
      auditEvents: [
        {
          id: "audit-1",
          timestamp: "2026-06-16T11:00:00.000Z",
          action: "report.operational.exported",
          resourceType: "report",
          resourceId: "operational",
          actorRole: "admin",
        },
      ],
    });

    expect(kpis.scope).toBe("administrative-operational");
    expect(kpis.leads.total).toBe(2);
    expect(kpis.leads.active).toBe(1);
    expect(kpis.patients.verified).toBe(1);
    expect(kpis.reports.csvExports).toBe(1);
    expect(kpis.limits).toContain("No usa información clínica.");
  });
});

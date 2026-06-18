import { describe, expect, it } from "vitest";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";
import {
  buildOperationalAnalyticsReport,
  buildOperationalReportCsv,
  InvalidOperationalReportFiltersError,
  parseOperationalReportFilters,
} from "./operational-analytics";

function createLead(overrides: Partial<LeadOperationsProfile>): LeadOperationsProfile {
  return {
    leadId: "LD-1",
    lead: {
      id: "LD-1",
      createdAt: "2026-06-10",
      name: "Paciente Demo",
      email: "paciente@example.com",
      phone: "+507 6000 0000",
      treatment: "Ortodoncia",
      status: "nuevo",
      source: "web",
      preferredDate: "2026-06-18",
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

function createPatient(
  overrides: Partial<PatientAdministrativeProfile>,
): PatientAdministrativeProfile {
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
    notes: "Perfil administrativo pendiente de validación amable.",
    sourceLeadIds: ["LD-1"],
    missingFields: [],
    completionPercentage: 100,
    administrativeStatus: "pending-verification",
    ...overrides,
  };
}

describe("operational analytics report", () => {
  it("applies administrative-operational filters without clinical fields", () => {
    const report = buildOperationalAnalyticsReport({
      generatedAt: "2026-06-16T12:00:00.000Z",
      filters: {
        from: "2026-06-09",
        to: "2026-06-12",
        status: "seguimiento",
        priority: "alta",
        service: "Implantes",
        source: "chat",
      },
      leadOperations: [
        createLead({
          leadId: "LD-1",
          operationalStatus: "seguimiento",
          priority: "alta",
          lead: {
            ...createLead({}).lead,
            id: "LD-1",
            treatment: "Implantes Dentales",
            source: "chat-widget",
            createdAt: "2026-06-10",
          },
        }),
        createLead({ leadId: "LD-2", operationalStatus: "nuevo", priority: "normal" }),
      ],
      patients: [
        createPatient({ treatmentInterest: "Implantes Dentales", source: "chat-widget" }),
        createPatient({ id: "patient-2", treatmentInterest: "Ortodoncia", source: "web" }),
      ],
    });

    expect(report.scope).toBe("administrative-operational");
    expect(report.filters).toMatchObject({ status: "seguimiento", priority: "alta" });
    expect(report.totals.totalLeads).toBe(1);
    expect(report.totals.highPriority).toBe(1);
    expect(report.totals.totalPatients).toBe(1);
    expect(report.source.leadOperations).toBe(1);
    expect(report.source.patientAdministrativeProfiles).toBe(1);
    expect(report.limits).toContain("No usa información clínica.");
  });

  it("rejects invalid filter values", () => {
    const request = new Request("https://dentaloperix.test/api/reports/operational?status=clinico");

    expect(() => parseOperationalReportFilters(request)).toThrow(
      InvalidOperationalReportFiltersError,
    );
  });

  it("builds csv with applied filter metadata", () => {
    const report = buildOperationalAnalyticsReport({
      generatedAt: "2026-06-16T12:00:00.000Z",
      filters: { service: "Ortodoncia" },
      leadOperations: [createLead({})],
      patients: [createPatient({})],
    });

    expect(buildOperationalReportCsv(report)).toContain('"Servicio","Ortodoncia"');
  });

  it("can expose read model diagnostics without changing report totals", () => {
    const report = buildOperationalAnalyticsReport({
      generatedAt: "2026-06-16T12:00:00.000Z",
      leadOperations: [createLead({})],
      patients: [createPatient({})],
      sourceDiagnostics: {
        mode: "read-model",
        usedReadModel: true,
        checkedReadModelPatients: 1,
      },
    });

    expect(report.totals.totalLeads).toBe(1);
    expect(report.totals.totalPatients).toBe(1);
    expect(report.source.mode).toBe("read-model");
    expect(report.source.usedReadModel).toBe(true);
    expect(report.source.checkedReadModelPatients).toBe(1);
  });
});

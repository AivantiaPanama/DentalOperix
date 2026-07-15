import { describe, expect, it } from "vitest";
import { buildCrmReadAggregatesFromReadModels } from "./crm-read-aggregate-service";
import type {
  CrmFolioReadModel,
  PatientReadModel,
  TreatmentInterestReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";

const patient = (patientId: string): PatientReadModel => ({
  patientId,
  displayName: patientId,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  administrativeStatus: "active",
  identityStatus: "pending",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
});

const interest = (overrides: Partial<TreatmentInterestReadModel>): TreatmentInterestReadModel => ({
  treatmentInterestId: "TI-001",
  patientId: "PAT-001",
  leadId: "LEAD-001",
  serviceSlug: "implantologia",
  serviceName: "Implantología",
  status: "active",
  interestSource: "crm",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const folio = (overrides: Partial<CrmFolioReadModel>): CrmFolioReadModel => ({
  crmFolioId: "CF-001",
  folio: "CRM-2026-001",
  patientId: "PAT-001",
  leadId: "LEAD-001",
  originSheet: "Leads",
  originRow: "2",
  createdAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const models = (overrides: Partial<WorksheetReadModels>): WorksheetReadModels => ({
  patients: [patient("PAT-001")],
  identifiers: [],
  contacts: [],
  administrativeProfiles: [],
  treatmentInterests: [],
  crmFolios: [],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
  ...overrides,
});

describe("crm read aggregate service", () => {
  it("builds CRM aggregates without extending the Patient aggregate", () => {
    const result = buildCrmReadAggregatesFromReadModels(
      models({
        treatmentInterests: [interest({ treatmentInterestId: "TI-001" })],
        crmFolios: [folio({ crmFolioId: "CF-001" })],
      }),
    );

    expect(result.crmAggregates).toEqual([
      {
        patientId: "PAT-001",
        treatmentInterests: [expect.objectContaining({ treatmentInterestId: "TI-001" })],
        crmFolios: [expect.objectContaining({ crmFolioId: "CF-001" })],
      },
    ]);
    expect(result.diagnostics).toMatchObject({
      totalPatients: 1,
      totalTreatmentInterests: 1,
      totalCrmFolios: 1,
      patientsWithTreatmentInterests: 1,
      patientsWithCrmFolios: 1,
    });
  });

  it("keeps orphan CRM rows diagnostic instead of failing the read model", () => {
    const result = buildCrmReadAggregatesFromReadModels(
      models({
        treatmentInterests: [interest({ patientId: "PAT-MISSING" })],
        crmFolios: [folio({ patientId: "PAT-MISSING" })],
      }),
    );

    expect(result.crmAggregates).toEqual([
      { patientId: "PAT-001", treatmentInterests: [], crmFolios: [] },
    ]);
    expect(result.diagnostics).toMatchObject({ orphanTreatmentInterests: 1, orphanCrmFolios: 1 });
  });

  it("sorts CRM data by newest operational timestamp", () => {
    const result = buildCrmReadAggregatesFromReadModels(
      models({
        treatmentInterests: [
          interest({ treatmentInterestId: "TI-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
          interest({ treatmentInterestId: "TI-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
        ],
        crmFolios: [
          folio({ crmFolioId: "CF-OLD", createdAt: "2026-01-01T00:00:00.000Z" }),
          folio({ crmFolioId: "CF-NEW", createdAt: "2026-01-03T00:00:00.000Z" }),
        ],
      }),
    );

    expect(
      result.crmAggregates[0]?.treatmentInterests.map((item) => item.treatmentInterestId),
    ).toEqual(["TI-NEW", "TI-OLD"]);
    expect(result.crmAggregates[0]?.crmFolios.map((item) => item.crmFolioId)).toEqual([
      "CF-NEW",
      "CF-OLD",
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { buildBillingReadAggregatesFromReadModels } from "./billing-read-aggregate-service";
import type {
  PatientBillingProfileReadModel,
  PatientReadModel,
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

const billingProfile = (
  overrides: Partial<PatientBillingProfileReadModel>,
): PatientBillingProfileReadModel => ({
  billingProfileId: "BIL-001",
  patientId: "PAT-001",
  billingType: "company",
  taxIdType: "RUC",
  taxIdValue: "155-123-456",
  ruc: "155-123-456",
  dv: "42",
  legalName: "Dental Demo SA",
  fiscalAddress: "Ciudad de Panama",
  billingEmail: "billing@example.com",
  billingPhone: "+507 6000 0000",
  country: "PA",
  billingStatus: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
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

describe("billing read aggregate service", () => {
  it("builds isolated billing aggregates without extending Patient or CRM aggregates", () => {
    const result = buildBillingReadAggregatesFromReadModels(
      models({
        billingProfiles: [billingProfile({ billingProfileId: "BIL-001" })],
      }),
    );

    expect(result.billingAggregates).toEqual([
      {
        patientId: "PAT-001",
        billingProfiles: [
          expect.objectContaining({ billingProfileId: "BIL-001", ruc: "155-123-456", dv: "42" }),
        ],
      },
    ]);
    expect(result.diagnostics).toMatchObject({
      totalPatients: 1,
      totalBillingProfiles: 1,
      patientsWithBillingProfiles: 1,
      orphanBillingProfiles: 0,
    });
  });

  it("keeps orphan billing profiles diagnostic instead of failing the read model", () => {
    const result = buildBillingReadAggregatesFromReadModels(
      models({
        billingProfiles: [billingProfile({ patientId: "PAT-MISSING" })],
      }),
    );

    expect(result.billingAggregates).toEqual([{ patientId: "PAT-001", billingProfiles: [] }]);
    expect(result.diagnostics).toMatchObject({ orphanBillingProfiles: 1 });
  });

  it("filters incomplete fiscal rows from the consumer payload but keeps diagnostics", () => {
    const result = buildBillingReadAggregatesFromReadModels(
      models({
        billingProfiles: [
          billingProfile({
            billingProfileId: "BIL-INCOMPLETE",
            taxIdValue: "",
            ruc: "",
            legalName: "",
            fiscalAddress: "",
          }),
        ],
      }),
    );

    expect(result.billingAggregates).toEqual([{ patientId: "PAT-001", billingProfiles: [] }]);
    expect(result.diagnostics).toMatchObject({
      totalBillingProfiles: 1,
      incompleteBillingProfiles: 1,
    });
  });

  it("sorts billing profiles by newest operational timestamp", () => {
    const result = buildBillingReadAggregatesFromReadModels(
      models({
        billingProfiles: [
          billingProfile({ billingProfileId: "BIL-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
          billingProfile({ billingProfileId: "BIL-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
        ],
      }),
    );

    expect(
      result.billingAggregates[0]?.billingProfiles.map((profile) => profile.billingProfileId),
    ).toEqual(["BIL-NEW", "BIL-OLD"]);
  });
});

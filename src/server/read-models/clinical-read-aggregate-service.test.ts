import { describe, expect, it } from "vitest";
import { buildClinicalReadAggregatesFromReadModels } from "./clinical-read-aggregate-service";
import type {
  ClinicalOutcomeReadModel,
  PatientReadModel,
  TreatmentPlanReadModel,
  TreatmentStageReadModel,
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

const treatmentPlan = (overrides: Partial<TreatmentPlanReadModel>): TreatmentPlanReadModel => ({
  treatmentPlanId: "TPL-001",
  patientId: "PAT-001",
  planName: "Ortodoncia",
  status: "active",
  priority: "normal",
  startDate: "2026-01-01",
  targetEndDate: "2026-06-01",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const treatmentStage = (overrides: Partial<TreatmentStageReadModel>): TreatmentStageReadModel => ({
  treatmentStageId: "TST-001",
  treatmentPlanId: "TPL-001",
  patientId: "PAT-001",
  stageName: "Diagnostico",
  status: "complete",
  sequence: "1",
  startedAt: "2026-01-01",
  completedAt: "2026-01-05",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-05T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const clinicalOutcome = (overrides: Partial<ClinicalOutcomeReadModel>): ClinicalOutcomeReadModel => ({
  clinicalOutcomeId: "COUT-001",
  treatmentPlanId: "TPL-001",
  patientId: "PAT-001",
  outcomeType: "progress",
  status: "improving",
  outcomeValue: "80%",
  recordedAt: "2026-01-10T00:00:00.000Z",
  createdAt: "2026-01-10T00:00:00.000Z",
  updatedAt: "2026-01-10T00:00:00.000Z",
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

describe("clinical read aggregate service", () => {
  it("builds isolated clinical aggregates without extending Patient, CRM, or Billing", () => {
    const result = buildClinicalReadAggregatesFromReadModels(models({
      treatmentPlans: [treatmentPlan({})],
      treatmentStages: [treatmentStage({})],
      clinicalOutcomes: [clinicalOutcome({})],
    }));

    expect(result.clinicalAggregates).toEqual([
      {
        patientId: "PAT-001",
        treatmentPlans: [expect.objectContaining({ treatmentPlanId: "TPL-001", planName: "Ortodoncia" })],
        treatmentStages: [expect.objectContaining({ treatmentStageId: "TST-001", stageName: "Diagnostico" })],
        clinicalOutcomes: [expect.objectContaining({ clinicalOutcomeId: "COUT-001", outcomeType: "progress" })],
      },
    ]);
    expect(result.diagnostics).toMatchObject({
      totalPatients: 1,
      patientsWithTreatmentPlans: 1,
      patientsWithTreatmentStages: 1,
      patientsWithClinicalOutcomes: 1,
    });
  });

  it("keeps orphan clinical rows diagnostic instead of failing the read model", () => {
    const result = buildClinicalReadAggregatesFromReadModels(models({
      treatmentPlans: [treatmentPlan({ patientId: "PAT-MISSING" })],
      treatmentStages: [treatmentStage({ patientId: "PAT-MISSING" })],
      clinicalOutcomes: [clinicalOutcome({ patientId: "PAT-MISSING" })],
    }));

    expect(result.clinicalAggregates).toEqual([
      { patientId: "PAT-001", treatmentPlans: [], treatmentStages: [], clinicalOutcomes: [] },
    ]);
    expect(result.diagnostics).toMatchObject({
      orphanTreatmentPlans: 1,
      orphanTreatmentStages: 1,
      orphanClinicalOutcomes: 1,
    });
  });

  it("filters incomplete clinical rows from consumer payload but keeps diagnostics", () => {
    const result = buildClinicalReadAggregatesFromReadModels(models({
      treatmentPlans: [treatmentPlan({ planName: "" })],
      treatmentStages: [treatmentStage({ stageName: "" })],
      clinicalOutcomes: [clinicalOutcome({ outcomeType: "" })],
    }));

    expect(result.clinicalAggregates).toEqual([
      { patientId: "PAT-001", treatmentPlans: [], treatmentStages: [], clinicalOutcomes: [] },
    ]);
    expect(result.diagnostics).toMatchObject({
      incompleteTreatmentPlans: 1,
      incompleteTreatmentStages: 1,
      incompleteClinicalOutcomes: 1,
    });
  });

  it("sorts treatment plans by newest timestamp and stages by sequence", () => {
    const result = buildClinicalReadAggregatesFromReadModels(models({
      treatmentPlans: [
        treatmentPlan({ treatmentPlanId: "TPL-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        treatmentPlan({ treatmentPlanId: "TPL-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      treatmentStages: [
        treatmentStage({ treatmentStageId: "TST-2", sequence: "2" }),
        treatmentStage({ treatmentStageId: "TST-1", sequence: "1" }),
      ],
    }));

    expect(result.clinicalAggregates[0]?.treatmentPlans.map((plan) => plan.treatmentPlanId)).toEqual([
      "TPL-NEW",
      "TPL-OLD",
    ]);
    expect(result.clinicalAggregates[0]?.treatmentStages.map((stage) => stage.treatmentStageId)).toEqual([
      "TST-1",
      "TST-2",
    ]);
  });
});

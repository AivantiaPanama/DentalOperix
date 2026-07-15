import {
  readClinicalOutcomesForPatient,
  type ClinicalOutcomeReadDto,
} from "@/server/read-models/clinical-outcome-read-adapter";
import {
  readTreatmentPlansForPatient,
  type TreatmentPlanReadDto,
} from "@/server/read-models/treatment-plan-read-adapter";
import {
  readTreatmentStagesForPatient,
  type TreatmentStageReadDto,
} from "@/server/read-models/treatment-stage-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type ClinicalReadAggregate = {
  patientId: string;
  treatmentPlans: TreatmentPlanReadDto[];
  treatmentStages: TreatmentStageReadDto[];
  clinicalOutcomes: ClinicalOutcomeReadDto[];
};

export type ClinicalReadAggregateDiagnostics = {
  totalPatients: number;
  totalTreatmentPlans: number;
  totalTreatmentStages: number;
  totalClinicalOutcomes: number;
  patientsWithTreatmentPlans: number;
  patientsWithTreatmentStages: number;
  patientsWithClinicalOutcomes: number;
  orphanTreatmentPlans: number;
  orphanTreatmentStages: number;
  orphanClinicalOutcomes: number;
  incompleteTreatmentPlans: number;
  incompleteTreatmentStages: number;
  incompleteClinicalOutcomes: number;
};

export type ClinicalReadAggregateResult = {
  clinicalAggregates: ClinicalReadAggregate[];
  diagnostics: ClinicalReadAggregateDiagnostics;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function getPatientIds(models: WorksheetReadModels) {
  return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}

export function buildClinicalReadAggregatesFromReadModels(
  models: WorksheetReadModels,
): ClinicalReadAggregateResult {
  const patientIds = getPatientIds(models);
  const treatmentPlans = models.treatmentPlans ?? [];
  const treatmentStages = models.treatmentStages ?? [];
  const clinicalOutcomes = models.clinicalOutcomes ?? [];

  const clinicalAggregates = [...patientIds].map((patientId) => ({
    patientId,
    treatmentPlans: readTreatmentPlansForPatient(patientId, treatmentPlans),
    treatmentStages: readTreatmentStagesForPatient(patientId, treatmentStages),
    clinicalOutcomes: readClinicalOutcomesForPatient(patientId, clinicalOutcomes),
  }));

  return {
    clinicalAggregates,
    diagnostics: {
      totalPatients: patientIds.size,
      totalTreatmentPlans: treatmentPlans.length,
      totalTreatmentStages: treatmentStages.length,
      totalClinicalOutcomes: clinicalOutcomes.length,
      patientsWithTreatmentPlans: clinicalAggregates.filter(
        (aggregate) => aggregate.treatmentPlans.length > 0,
      ).length,
      patientsWithTreatmentStages: clinicalAggregates.filter(
        (aggregate) => aggregate.treatmentStages.length > 0,
      ).length,
      patientsWithClinicalOutcomes: clinicalAggregates.filter(
        (aggregate) => aggregate.clinicalOutcomes.length > 0,
      ).length,
      orphanTreatmentPlans: treatmentPlans.filter((plan) => !patientIds.has(plan.patientId)).length,
      orphanTreatmentStages: treatmentStages.filter((stage) => !patientIds.has(stage.patientId))
        .length,
      orphanClinicalOutcomes: clinicalOutcomes.filter(
        (outcome) => !patientIds.has(outcome.patientId),
      ).length,
      incompleteTreatmentPlans: treatmentPlans.filter(
        (plan) => !normalize(plan.treatmentPlanId) || !normalize(plan.planName),
      ).length,
      incompleteTreatmentStages: treatmentStages.filter(
        (stage) => !normalize(stage.treatmentStageId) || !normalize(stage.stageName),
      ).length,
      incompleteClinicalOutcomes: clinicalOutcomes.filter(
        (outcome) => !normalize(outcome.clinicalOutcomeId) || !normalize(outcome.outcomeType),
      ).length,
    },
  };
}

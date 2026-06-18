import type { ClinicalOutcomeReadModel } from "@/server/read-models/worksheet-read-models";

export type ClinicalOutcomeReadDto = {
  clinicalOutcomeId: string;
  treatmentPlanId: string;
  patientId: string;
  outcomeType: string;
  status: string;
  outcomeValue?: string;
  recordedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(outcome: ClinicalOutcomeReadModel) {
  const timestamp = Date.parse(outcome.recordedAt || outcome.updatedAt || outcome.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableOutcome(outcome: ClinicalOutcomeReadModel) {
  return Boolean(normalize(outcome.clinicalOutcomeId) && normalize(outcome.patientId) && normalize(outcome.outcomeType));
}

function toClinicalOutcomeDto(outcome: ClinicalOutcomeReadModel): ClinicalOutcomeReadDto {
  return {
    clinicalOutcomeId: normalize(outcome.clinicalOutcomeId),
    treatmentPlanId: normalize(outcome.treatmentPlanId),
    patientId: normalize(outcome.patientId),
    outcomeType: normalize(outcome.outcomeType),
    status: normalize(outcome.status),
    ...(normalize(outcome.outcomeValue) ? { outcomeValue: normalize(outcome.outcomeValue) } : {}),
    ...(normalize(outcome.recordedAt) ? { recordedAt: normalize(outcome.recordedAt) } : {}),
    source: normalize(outcome.source) || "read-model",
    isMock: outcome.isMock,
    ...(normalize(outcome.notes) ? { notes: normalize(outcome.notes) } : {}),
  };
}

export function readClinicalOutcomesForPatient(
  patientId: string,
  clinicalOutcomes: ClinicalOutcomeReadModel[],
): ClinicalOutcomeReadDto[] {
  return clinicalOutcomes
    .filter((outcome) => normalize(outcome.patientId) === patientId && isUsableOutcome(outcome))
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toClinicalOutcomeDto);
}

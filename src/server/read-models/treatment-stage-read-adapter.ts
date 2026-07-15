import type { TreatmentStageReadModel } from "@/server/read-models/worksheet-read-models";

export type TreatmentStageReadDto = {
  treatmentStageId: string;
  treatmentPlanId: string;
  patientId: string;
  stageName: string;
  status: string;
  sequence?: string;
  startedAt?: string;
  completedAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function sequenceValue(stage: TreatmentStageReadModel) {
  const value = Number.parseInt(normalize(stage.sequence), 10);
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function isUsableStage(stage: TreatmentStageReadModel) {
  return Boolean(
    normalize(stage.treatmentStageId) && normalize(stage.patientId) && normalize(stage.stageName),
  );
}

function toTreatmentStageDto(stage: TreatmentStageReadModel): TreatmentStageReadDto {
  return {
    treatmentStageId: normalize(stage.treatmentStageId),
    treatmentPlanId: normalize(stage.treatmentPlanId),
    patientId: normalize(stage.patientId),
    stageName: normalize(stage.stageName),
    status: normalize(stage.status),
    ...(normalize(stage.sequence) ? { sequence: normalize(stage.sequence) } : {}),
    ...(normalize(stage.startedAt) ? { startedAt: normalize(stage.startedAt) } : {}),
    ...(normalize(stage.completedAt) ? { completedAt: normalize(stage.completedAt) } : {}),
    source: normalize(stage.source) || "read-model",
    isMock: stage.isMock,
    ...(normalize(stage.notes) ? { notes: normalize(stage.notes) } : {}),
  };
}

export function readTreatmentStagesForPatient(
  patientId: string,
  treatmentStages: TreatmentStageReadModel[],
): TreatmentStageReadDto[] {
  return treatmentStages
    .filter((stage) => normalize(stage.patientId) === patientId && isUsableStage(stage))
    .sort((left, right) => sequenceValue(left) - sequenceValue(right))
    .map(toTreatmentStageDto);
}

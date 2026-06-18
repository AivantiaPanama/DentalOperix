import type { TreatmentPlanReadModel } from "@/server/read-models/worksheet-read-models";

export type TreatmentPlanReadDto = {
  treatmentPlanId: string;
  patientId: string;
  planName: string;
  status: string;
  priority: string;
  startDate?: string;
  targetEndDate?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(plan: TreatmentPlanReadModel) {
  const timestamp = Date.parse(plan.updatedAt || plan.createdAt || plan.startDate || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsablePlan(plan: TreatmentPlanReadModel) {
  return Boolean(normalize(plan.treatmentPlanId) && normalize(plan.patientId) && normalize(plan.planName));
}

function toTreatmentPlanDto(plan: TreatmentPlanReadModel): TreatmentPlanReadDto {
  return {
    treatmentPlanId: normalize(plan.treatmentPlanId),
    patientId: normalize(plan.patientId),
    planName: normalize(plan.planName),
    status: normalize(plan.status),
    priority: normalize(plan.priority),
    ...(normalize(plan.startDate) ? { startDate: normalize(plan.startDate) } : {}),
    ...(normalize(plan.targetEndDate) ? { targetEndDate: normalize(plan.targetEndDate) } : {}),
    source: normalize(plan.source) || "read-model",
    isMock: plan.isMock,
    ...(normalize(plan.notes) ? { notes: normalize(plan.notes) } : {}),
  };
}

export function readTreatmentPlansForPatient(
  patientId: string,
  treatmentPlans: TreatmentPlanReadModel[],
): TreatmentPlanReadDto[] {
  return treatmentPlans
    .filter((plan) => normalize(plan.patientId) === patientId && isUsablePlan(plan))
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toTreatmentPlanDto);
}

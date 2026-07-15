import type { AutomationRunReadModel } from "@/server/read-models/worksheet-read-models";

export type AutomationRunReadDto = {
  automationRunId: string;
  patientId?: string;
  leadId?: string;
  workflowName: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(run: AutomationRunReadModel) {
  const timestamp = Date.parse(
    run.updatedAt || run.completedAt || run.startedAt || run.createdAt || "",
  );
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableRun(run: AutomationRunReadModel) {
  return Boolean(normalize(run.automationRunId) && normalize(run.workflowName));
}

function toAutomationRunDto(run: AutomationRunReadModel): AutomationRunReadDto {
  return {
    automationRunId: normalize(run.automationRunId),
    ...(normalize(run.patientId) ? { patientId: normalize(run.patientId) } : {}),
    ...(normalize(run.leadId) ? { leadId: normalize(run.leadId) } : {}),
    workflowName: normalize(run.workflowName),
    status: normalize(run.status),
    ...(normalize(run.startedAt) ? { startedAt: normalize(run.startedAt) } : {}),
    ...(normalize(run.completedAt) ? { completedAt: normalize(run.completedAt) } : {}),
    ...(normalize(run.durationMs) ? { durationMs: normalize(run.durationMs) } : {}),
    source: normalize(run.source) || "read-model",
    isMock: run.isMock,
    ...(normalize(run.notes) ? { notes: normalize(run.notes) } : {}),
  };
}

export function readAutomationRuns(
  automationRuns: AutomationRunReadModel[],
): AutomationRunReadDto[] {
  return automationRuns
    .filter(isUsableRun)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toAutomationRunDto);
}

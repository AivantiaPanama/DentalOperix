import type { WorkflowExecutionStatusReadModel } from "@/server/read-models/worksheet-read-models";

export type WorkflowExecutionReadDto = {
  workflowExecutionStatusId: string;
  automationRunId?: string;
  workflowName: string;
  status: string;
  currentStep?: string;
  lastTransitionAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(status: WorkflowExecutionStatusReadModel) {
  const timestamp = Date.parse(
    status.updatedAt || status.lastTransitionAt || status.createdAt || "",
  );
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableStatus(status: WorkflowExecutionStatusReadModel) {
  return Boolean(normalize(status.workflowExecutionStatusId) && normalize(status.workflowName));
}

function toWorkflowExecutionDto(
  status: WorkflowExecutionStatusReadModel,
): WorkflowExecutionReadDto {
  return {
    workflowExecutionStatusId: normalize(status.workflowExecutionStatusId),
    ...(normalize(status.automationRunId)
      ? { automationRunId: normalize(status.automationRunId) }
      : {}),
    workflowName: normalize(status.workflowName),
    status: normalize(status.status),
    ...(normalize(status.currentStep) ? { currentStep: normalize(status.currentStep) } : {}),
    ...(normalize(status.lastTransitionAt)
      ? { lastTransitionAt: normalize(status.lastTransitionAt) }
      : {}),
    source: normalize(status.source) || "read-model",
    isMock: status.isMock,
    ...(normalize(status.notes) ? { notes: normalize(status.notes) } : {}),
  };
}

export function readWorkflowExecutionStatuses(
  workflowExecutionStatus: WorkflowExecutionStatusReadModel[],
): WorkflowExecutionReadDto[] {
  return workflowExecutionStatus
    .filter(isUsableStatus)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toWorkflowExecutionDto);
}

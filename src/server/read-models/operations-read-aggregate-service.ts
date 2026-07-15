import {
  readAutomationRuns,
  type AutomationRunReadDto,
} from "@/server/read-models/automation-run-read-adapter";
import {
  readOperationalKpis,
  type OperationalKpiReadDto,
} from "@/server/read-models/operational-kpi-read-adapter";
import {
  readWorkflowExecutionStatuses,
  type WorkflowExecutionReadDto,
} from "@/server/read-models/workflow-execution-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type OperationsReadAggregate = {
  automationRuns: AutomationRunReadDto[];
  operationalKpis: OperationalKpiReadDto[];
  workflowExecutionStatus: WorkflowExecutionReadDto[];
};

export type OperationsReadAggregateDiagnostics = {
  totalAutomationRuns: number;
  totalOperationalKpis: number;
  totalWorkflowExecutionStatus: number;
  usableAutomationRuns: number;
  usableOperationalKpis: number;
  usableWorkflowExecutionStatus: number;
  incompleteAutomationRuns: number;
  incompleteOperationalKpis: number;
  incompleteWorkflowExecutionStatus: number;
};

export type OperationsReadAggregateResult = {
  operationsAggregate: OperationsReadAggregate;
  diagnostics: OperationsReadAggregateDiagnostics;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function buildOperationsReadAggregateFromReadModels(
  models: WorksheetReadModels,
): OperationsReadAggregateResult {
  const automationRuns = models.automationRuns ?? [];
  const operationalKpis = models.operationalKpis ?? [];
  const workflowExecutionStatus = models.workflowExecutionStatus ?? [];

  const usableAutomationRuns = readAutomationRuns(automationRuns);
  const usableOperationalKpis = readOperationalKpis(operationalKpis);
  const usableWorkflowExecutionStatus = readWorkflowExecutionStatuses(workflowExecutionStatus);

  return {
    operationsAggregate: {
      automationRuns: usableAutomationRuns,
      operationalKpis: usableOperationalKpis,
      workflowExecutionStatus: usableWorkflowExecutionStatus,
    },
    diagnostics: {
      totalAutomationRuns: automationRuns.length,
      totalOperationalKpis: operationalKpis.length,
      totalWorkflowExecutionStatus: workflowExecutionStatus.length,
      usableAutomationRuns: usableAutomationRuns.length,
      usableOperationalKpis: usableOperationalKpis.length,
      usableWorkflowExecutionStatus: usableWorkflowExecutionStatus.length,
      incompleteAutomationRuns: automationRuns.filter(
        (run) => !normalize(run.automationRunId) || !normalize(run.workflowName),
      ).length,
      incompleteOperationalKpis: operationalKpis.filter(
        (kpi) => !normalize(kpi.operationalKpiId) || !normalize(kpi.metricName),
      ).length,
      incompleteWorkflowExecutionStatus: workflowExecutionStatus.filter(
        (status) => !normalize(status.workflowExecutionStatusId) || !normalize(status.workflowName),
      ).length,
    },
  };
}

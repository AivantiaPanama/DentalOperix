import { describe, expect, it } from "vitest";
import { buildOperationsReadAggregateFromReadModels } from "./operations-read-aggregate-service";
import type {
  AutomationRunReadModel,
  OperationalKpiReadModel,
  WorkflowExecutionStatusReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";

const automationRun = (overrides: Partial<AutomationRunReadModel>): AutomationRunReadModel => ({
  automationRunId: "RUN-001",
  patientId: "PAT-001",
  leadId: "LEAD-001",
  workflowName: "lead-follow-up",
  status: "completed",
  startedAt: "2026-01-01T10:00:00.000Z",
  completedAt: "2026-01-01T10:05:00.000Z",
  durationMs: "300000",
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:05:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const operationalKpi = (overrides: Partial<OperationalKpiReadModel>): OperationalKpiReadModel => ({
  operationalKpiId: "KPI-001",
  metricName: "automation_success_rate",
  metricValue: "0.98",
  metricUnit: "ratio",
  periodStart: "2026-01-01T00:00:00.000Z",
  periodEnd: "2026-01-01T23:59:59.999Z",
  domain: "Operations",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const workflowStatus = (overrides: Partial<WorkflowExecutionStatusReadModel>): WorkflowExecutionStatusReadModel => ({
  workflowExecutionStatusId: "WF-001",
  automationRunId: "RUN-001",
  workflowName: "lead-follow-up",
  status: "completed",
  currentStep: "done",
  lastTransitionAt: "2026-01-01T10:05:00.000Z",
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:05:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const models = (overrides: Partial<WorksheetReadModels>): WorksheetReadModels => ({
  patients: [],
  identifiers: [],
  contacts: [],
  administrativeProfiles: [],
  treatmentInterests: [],
  crmFolios: [],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
  automationRuns: [],
  operationalKpis: [],
  workflowExecutionStatus: [],
  ...overrides,
});

describe("operations read aggregate service", () => {
  it("builds an isolated operations aggregate without extending Patient, CRM, Billing, or Clinical", () => {
    const result = buildOperationsReadAggregateFromReadModels(models({
      automationRuns: [automationRun({ automationRunId: "RUN-001" })],
      operationalKpis: [operationalKpi({ operationalKpiId: "KPI-001" })],
      workflowExecutionStatus: [workflowStatus({ workflowExecutionStatusId: "WF-001" })],
    }));

    expect(result.operationsAggregate).toEqual({
      automationRuns: [expect.objectContaining({ automationRunId: "RUN-001", workflowName: "lead-follow-up" })],
      operationalKpis: [expect.objectContaining({ operationalKpiId: "KPI-001", metricName: "automation_success_rate" })],
      workflowExecutionStatus: [expect.objectContaining({ workflowExecutionStatusId: "WF-001", status: "completed" })],
    });
    expect(result.diagnostics).toMatchObject({
      totalAutomationRuns: 1,
      totalOperationalKpis: 1,
      totalWorkflowExecutionStatus: 1,
      usableAutomationRuns: 1,
      usableOperationalKpis: 1,
      usableWorkflowExecutionStatus: 1,
    });
  });

  it("filters incomplete operational rows from payloads while keeping diagnostics", () => {
    const result = buildOperationsReadAggregateFromReadModels(models({
      automationRuns: [automationRun({ automationRunId: "", workflowName: "" })],
      operationalKpis: [operationalKpi({ operationalKpiId: "", metricName: "" })],
      workflowExecutionStatus: [workflowStatus({ workflowExecutionStatusId: "", workflowName: "" })],
    }));

    expect(result.operationsAggregate).toEqual({
      automationRuns: [],
      operationalKpis: [],
      workflowExecutionStatus: [],
    });
    expect(result.diagnostics).toMatchObject({
      incompleteAutomationRuns: 1,
      incompleteOperationalKpis: 1,
      incompleteWorkflowExecutionStatus: 1,
    });
  });

  it("sorts operational records by newest timestamp", () => {
    const result = buildOperationsReadAggregateFromReadModels(models({
      automationRuns: [
        automationRun({ automationRunId: "RUN-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        automationRun({ automationRunId: "RUN-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      operationalKpis: [
        operationalKpi({ operationalKpiId: "KPI-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        operationalKpi({ operationalKpiId: "KPI-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      workflowExecutionStatus: [
        workflowStatus({ workflowExecutionStatusId: "WF-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        workflowStatus({ workflowExecutionStatusId: "WF-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
    }));

    expect(result.operationsAggregate.automationRuns.map((run) => run.automationRunId)).toEqual(["RUN-NEW", "RUN-OLD"]);
    expect(result.operationsAggregate.operationalKpis.map((kpi) => kpi.operationalKpiId)).toEqual(["KPI-NEW", "KPI-OLD"]);
    expect(result.operationsAggregate.workflowExecutionStatus.map((status) => status.workflowExecutionStatusId)).toEqual(["WF-NEW", "WF-OLD"]);
  });
});

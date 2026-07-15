import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSupportReadAggregateFromReadModels } from "./support-read-aggregate-service";
import type {
  ResolutionMetricReadModel,
  SatisfactionMetricReadModel,
  SupportCaseReadModel,
  SupportTicketReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";

const supportCase = (overrides: Partial<SupportCaseReadModel>): SupportCaseReadModel => ({
  supportCaseId: "CASE-001",
  patientId: "PAT-001",
  caseStatus: "open",
  casePriority: "high",
  caseCategory: "clinical-support",
  openedAt: "2026-01-01T00:00:00.000Z",
  closedAt: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const supportTicket = (overrides: Partial<SupportTicketReadModel>): SupportTicketReadModel => ({
  supportTicketId: "TICKET-001",
  supportCaseId: "CASE-001",
  patientId: "PAT-001",
  ticketStatus: "in_progress",
  ticketHistory: "created,triaged",
  openedAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const resolutionMetric = (
  overrides: Partial<ResolutionMetricReadModel>,
): ResolutionMetricReadModel => ({
  resolutionMetricId: "RES-001",
  supportTicketId: "TICKET-001",
  firstResponseTimeMinutes: "15",
  resolutionTimeMinutes: "120",
  escalationRate: "0.10",
  periodStart: "2026-01-01",
  periodEnd: "2026-01-31",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const satisfactionMetric = (
  overrides: Partial<SatisfactionMetricReadModel>,
): SatisfactionMetricReadModel => ({
  satisfactionMetricId: "SAT-001",
  supportTicketId: "TICKET-001",
  csat: "4.8",
  nps: "72",
  surveyResult: "satisfied",
  recordedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
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
  invoices: [],
  payments: [],
  collections: [],
  financialKpis: [],
  products: [],
  consumables: [],
  stockLevels: [],
  warehouses: [],
  supportCases: [],
  supportTickets: [],
  resolutionMetrics: [],
  satisfactionMetrics: [],
  ...overrides,
});

describe("support read aggregate service", () => {
  it("builds an isolated support aggregate for cases, tickets, resolution metrics, and satisfaction metrics", () => {
    const result = buildSupportReadAggregateFromReadModels(
      models({
        supportCases: [supportCase({ supportCaseId: "CASE-001" })],
        supportTickets: [supportTicket({ supportTicketId: "TICKET-001" })],
        resolutionMetrics: [resolutionMetric({ resolutionMetricId: "RES-001" })],
        satisfactionMetrics: [satisfactionMetric({ satisfactionMetricId: "SAT-001" })],
      }),
    );

    expect(result.supportAggregate).toEqual({
      supportCases: [expect.objectContaining({ supportCaseId: "CASE-001", caseStatus: "open" })],
      supportTickets: [
        expect.objectContaining({ supportTicketId: "TICKET-001", ticketStatus: "in_progress" }),
      ],
      resolutionMetrics: [
        expect.objectContaining({ resolutionMetricId: "RES-001", firstResponseTimeMinutes: "15" }),
      ],
      satisfactionMetrics: [
        expect.objectContaining({ satisfactionMetricId: "SAT-001", csat: "4.8" }),
      ],
    });
    expect(result.diagnostics).toMatchObject({
      totalSupportCases: 1,
      totalSupportTickets: 1,
      totalResolutionMetrics: 1,
      totalSatisfactionMetrics: 1,
      usableSupportCases: 1,
      usableSupportTickets: 1,
      usableResolutionMetrics: 1,
      usableSatisfactionMetrics: 1,
    });
  });

  it("filters incomplete support rows while preserving diagnostics", () => {
    const result = buildSupportReadAggregateFromReadModels(
      models({
        supportCases: [supportCase({ supportCaseId: "" })],
        supportTickets: [supportTicket({ supportTicketId: "" })],
        resolutionMetrics: [resolutionMetric({ resolutionMetricId: "" })],
        satisfactionMetrics: [satisfactionMetric({ satisfactionMetricId: "" })],
      }),
    );

    expect(result.supportAggregate).toEqual({
      supportCases: [],
      supportTickets: [],
      resolutionMetrics: [],
      satisfactionMetrics: [],
    });
    expect(result.diagnostics).toMatchObject({
      incompleteSupportCases: 1,
      incompleteSupportTickets: 1,
      incompleteResolutionMetrics: 1,
      incompleteSatisfactionMetrics: 1,
    });
  });

  it("keeps support workflow execution and automation out of support v1", () => {
    const result = buildSupportReadAggregateFromReadModels(models({}));
    const source = readFileSync(
      join(process.cwd(), "src/server/read-models/support-read-aggregate-service.ts"),
      "utf8",
    );

    expect(Object.keys(result.supportAggregate).sort()).toEqual([
      "resolutionMetrics",
      "satisfactionMetrics",
      "supportCases",
      "supportTickets",
    ]);
    expect(source.toLowerCase()).not.toContain("surveyprocessing");
    expect(source.toLowerCase()).not.toContain("escalationautomation");
    expect(source.toLowerCase()).not.toContain("ticketworkflowexecution");
    expect(source).not.toContain("crm-read-aggregate-service");
    expect(source).not.toContain("operations-read-aggregate-service");
  });
});

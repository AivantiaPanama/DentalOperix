import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSupportReadAggregateFromReadModels } from "./support-read-aggregate-service";
import type { WorksheetReadModels } from "./worksheet-read-models";

const emptyModels = (): WorksheetReadModels => ({
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
});

describe("support read domain closure", () => {
  it("keeps the support v1 aggregate scoped to read-only support visibility", () => {
    const result = buildSupportReadAggregateFromReadModels(emptyModels());

    expect(Object.keys(result.supportAggregate).sort()).toEqual([
      "resolutionMetrics",
      "satisfactionMetrics",
      "supportCases",
      "supportTickets",
    ]);
    expect(JSON.stringify(result.supportAggregate).toLowerCase()).not.toContain("surveyprocessing");
    expect(JSON.stringify(result.supportAggregate).toLowerCase()).not.toContain(
      "escalationautomation",
    );
    expect(JSON.stringify(result.supportAggregate).toLowerCase()).not.toContain(
      "ticketworkflowexecution",
    );
  });

  it("does not import other domain aggregate services into the support aggregate", () => {
    const source = readFileSync(
      join(process.cwd(), "src/server/read-models/support-read-aggregate-service.ts"),
      "utf8",
    );

    expect(source).not.toContain("patient-aggregate-read-service");
    expect(source).not.toContain("crm-read-aggregate-service");
    expect(source).not.toContain("billing-read-aggregate-service");
    expect(source).not.toContain("clinical-read-aggregate-service");
    expect(source).not.toContain("operations-read-aggregate-service");
    expect(source).not.toContain("finance-read-aggregate-service");
    expect(source).not.toContain("inventory-read-aggregate-service");
  });
});

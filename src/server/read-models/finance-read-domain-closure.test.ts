import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildFinanceReadAggregateFromReadModels } from "./finance-read-aggregate-service";
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
});

describe("finance read domain closure", () => {
  it("keeps the finance v1 aggregate scoped to reporting entities only", () => {
    const result = buildFinanceReadAggregateFromReadModels(emptyModels());

    expect(Object.keys(result.financeAggregate).sort()).toEqual([
      "collections",
      "financialKpis",
      "invoices",
      "payments",
    ]);
    expect(JSON.stringify(result.financeAggregate).toLowerCase()).not.toContain("ledger");
    expect(JSON.stringify(result.financeAggregate).toLowerCase()).not.toContain("reconciliation");
    expect(JSON.stringify(result.financeAggregate).toLowerCase()).not.toContain("accountingentries");
  });

  it("does not import other domain aggregate services into the finance aggregate", () => {
    const source = readFileSync(join(process.cwd(), "src/server/read-models/finance-read-aggregate-service.ts"), "utf8");

    expect(source).not.toContain("patient-aggregate-read-service");
    expect(source).not.toContain("crm-read-aggregate-service");
    expect(source).not.toContain("billing-read-aggregate-service");
    expect(source).not.toContain("clinical-read-aggregate-service");
    expect(source).not.toContain("operations-read-aggregate-service");
  });
});

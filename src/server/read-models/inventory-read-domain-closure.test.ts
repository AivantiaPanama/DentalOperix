import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildInventoryReadAggregateFromReadModels } from "./inventory-read-aggregate-service";
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
});

describe("inventory read domain closure", () => {
  it("keeps the inventory v1 aggregate scoped to read-only inventory state", () => {
    const result = buildInventoryReadAggregateFromReadModels(emptyModels());

    expect(Object.keys(result.inventoryAggregate).sort()).toEqual([
      "consumables",
      "products",
      "stockLevels",
      "warehouses",
    ]);
    expect(JSON.stringify(result.inventoryAggregate).toLowerCase()).not.toContain("stockmovement");
    expect(JSON.stringify(result.inventoryAggregate).toLowerCase()).not.toContain(
      "inventoryadjustment",
    );
    expect(JSON.stringify(result.inventoryAggregate).toLowerCase()).not.toContain("purchaseorder");
    expect(JSON.stringify(result.inventoryAggregate).toLowerCase()).not.toContain("supplierorder");
    expect(JSON.stringify(result.inventoryAggregate).toLowerCase()).not.toContain("reconciliation");
  });

  it("does not import other domain aggregate services into the inventory aggregate", () => {
    const source = readFileSync(
      join(process.cwd(), "src/server/read-models/inventory-read-aggregate-service.ts"),
      "utf8",
    );

    expect(source).not.toContain("patient-aggregate-read-service");
    expect(source).not.toContain("crm-read-aggregate-service");
    expect(source).not.toContain("billing-read-aggregate-service");
    expect(source).not.toContain("clinical-read-aggregate-service");
    expect(source).not.toContain("operations-read-aggregate-service");
    expect(source).not.toContain("finance-read-aggregate-service");
  });
});

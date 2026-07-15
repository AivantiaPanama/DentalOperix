import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildInventoryReadAggregateFromReadModels } from "./inventory-read-aggregate-service";
import type {
  ConsumableReadModel,
  ProductReadModel,
  StockLevelReadModel,
  WarehouseReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";

const product = (overrides: Partial<ProductReadModel>): ProductReadModel => ({
  productId: "PROD-001",
  sku: "SKU-001",
  productName: "Resina compuesta",
  category: "Dental",
  status: "active",
  unit: "unit",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const consumable = (overrides: Partial<ConsumableReadModel>): ConsumableReadModel => ({
  consumableId: "CONS-001",
  productId: "PROD-001",
  consumableName: "Guantes nitrilo",
  category: "Clinical Supplies",
  status: "active",
  unit: "box",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const stockLevel = (overrides: Partial<StockLevelReadModel>): StockLevelReadModel => ({
  stockLevelId: "STK-001",
  productId: "PROD-001",
  warehouseId: "WH-001",
  availableQuantity: "25",
  reservedQuantity: "3",
  reorderThreshold: "10",
  status: "available",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const warehouse = (overrides: Partial<WarehouseReadModel>): WarehouseReadModel => ({
  warehouseId: "WH-001",
  warehouseName: "Bodega Clínica",
  location: "Panamá",
  status: "active",
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
  ...overrides,
});

describe("inventory read aggregate service", () => {
  it("builds an isolated inventory aggregate for products, consumables, stock levels, and warehouses", () => {
    const result = buildInventoryReadAggregateFromReadModels(
      models({
        products: [product({ productId: "PROD-001" })],
        consumables: [consumable({ consumableId: "CONS-001" })],
        stockLevels: [stockLevel({ stockLevelId: "STK-001" })],
        warehouses: [warehouse({ warehouseId: "WH-001" })],
      }),
    );

    expect(result.inventoryAggregate).toEqual({
      products: [
        expect.objectContaining({ productId: "PROD-001", productName: "Resina compuesta" }),
      ],
      consumables: [
        expect.objectContaining({ consumableId: "CONS-001", consumableName: "Guantes nitrilo" }),
      ],
      stockLevels: [
        expect.objectContaining({
          stockLevelId: "STK-001",
          productId: "PROD-001",
          warehouseId: "WH-001",
        }),
      ],
      warehouses: [
        expect.objectContaining({ warehouseId: "WH-001", warehouseName: "Bodega Clínica" }),
      ],
    });
    expect(result.diagnostics).toMatchObject({
      totalProducts: 1,
      totalConsumables: 1,
      totalStockLevels: 1,
      totalWarehouses: 1,
      usableProducts: 1,
      usableConsumables: 1,
      usableStockLevels: 1,
      usableWarehouses: 1,
    });
  });

  it("filters incomplete inventory rows while preserving diagnostics", () => {
    const result = buildInventoryReadAggregateFromReadModels(
      models({
        products: [product({ productId: "", productName: "" })],
        consumables: [consumable({ consumableId: "", consumableName: "" })],
        stockLevels: [stockLevel({ stockLevelId: "", productId: "", warehouseId: "" })],
        warehouses: [warehouse({ warehouseId: "", warehouseName: "" })],
      }),
    );

    expect(result.inventoryAggregate).toEqual({
      products: [],
      consumables: [],
      stockLevels: [],
      warehouses: [],
    });
    expect(result.diagnostics).toMatchObject({
      incompleteProducts: 1,
      incompleteConsumables: 1,
      incompleteStockLevels: 1,
      incompleteWarehouses: 1,
    });
  });

  it("keeps stock movements and purchasing entities out of inventory v1", () => {
    const result = buildInventoryReadAggregateFromReadModels(models({}));
    const source = readFileSync(
      join(process.cwd(), "src/server/read-models/inventory-read-aggregate-service.ts"),
      "utf8",
    );

    expect(Object.keys(result.inventoryAggregate).sort()).toEqual([
      "consumables",
      "products",
      "stockLevels",
      "warehouses",
    ]);
    expect(source.toLowerCase()).not.toContain("stockmovement");
    expect(source.toLowerCase()).not.toContain("purchaseorder");
    expect(source.toLowerCase()).not.toContain("reconciliation");
    expect(source).not.toContain("finance-read-aggregate-service");
    expect(source).not.toContain("operations-read-aggregate-service");
  });
});

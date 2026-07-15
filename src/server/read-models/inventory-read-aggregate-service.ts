import {
  readConsumables,
  type ConsumableReadDto,
} from "@/server/read-models/consumable-read-adapter";
import { readProducts, type ProductReadDto } from "@/server/read-models/product-read-adapter";
import {
  readStockLevels,
  type StockLevelReadDto,
} from "@/server/read-models/stock-level-read-adapter";
import { readWarehouses, type WarehouseReadDto } from "@/server/read-models/warehouse-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type InventoryReadAggregate = {
  products: ProductReadDto[];
  consumables: ConsumableReadDto[];
  stockLevels: StockLevelReadDto[];
  warehouses: WarehouseReadDto[];
};

export type InventoryReadAggregateDiagnostics = {
  totalProducts: number;
  totalConsumables: number;
  totalStockLevels: number;
  totalWarehouses: number;
  usableProducts: number;
  usableConsumables: number;
  usableStockLevels: number;
  usableWarehouses: number;
  incompleteProducts: number;
  incompleteConsumables: number;
  incompleteStockLevels: number;
  incompleteWarehouses: number;
};

export type InventoryReadAggregateResult = {
  inventoryAggregate: InventoryReadAggregate;
  diagnostics: InventoryReadAggregateDiagnostics;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function buildInventoryReadAggregateFromReadModels(
  models: WorksheetReadModels,
): InventoryReadAggregateResult {
  const products = models.products ?? [];
  const consumables = models.consumables ?? [];
  const stockLevels = models.stockLevels ?? [];
  const warehouses = models.warehouses ?? [];

  const usableProducts = readProducts(products);
  const usableConsumables = readConsumables(consumables);
  const usableStockLevels = readStockLevels(stockLevels);
  const usableWarehouses = readWarehouses(warehouses);

  return {
    inventoryAggregate: {
      products: usableProducts,
      consumables: usableConsumables,
      stockLevels: usableStockLevels,
      warehouses: usableWarehouses,
    },
    diagnostics: {
      totalProducts: products.length,
      totalConsumables: consumables.length,
      totalStockLevels: stockLevels.length,
      totalWarehouses: warehouses.length,
      usableProducts: usableProducts.length,
      usableConsumables: usableConsumables.length,
      usableStockLevels: usableStockLevels.length,
      usableWarehouses: usableWarehouses.length,
      incompleteProducts: products.filter(
        (product) => !normalize(product.productId) || !normalize(product.productName),
      ).length,
      incompleteConsumables: consumables.filter(
        (consumable) =>
          !normalize(consumable.consumableId) || !normalize(consumable.consumableName),
      ).length,
      incompleteStockLevels: stockLevels.filter(
        (stockLevel) =>
          !normalize(stockLevel.stockLevelId) ||
          !normalize(stockLevel.productId) ||
          !normalize(stockLevel.warehouseId),
      ).length,
      incompleteWarehouses: warehouses.filter(
        (warehouse) => !normalize(warehouse.warehouseId) || !normalize(warehouse.warehouseName),
      ).length,
    },
  };
}

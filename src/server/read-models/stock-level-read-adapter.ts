import type { StockLevelReadModel } from "@/server/read-models/worksheet-read-models";

export type StockLevelReadDto = {
  stockLevelId: string;
  productId: string;
  warehouseId: string;
  availableQuantity: string;
  reservedQuantity?: string;
  reorderThreshold?: string;
  status: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(stockLevel: StockLevelReadModel) {
  const timestamp = Date.parse(stockLevel.updatedAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableStockLevel(stockLevel: StockLevelReadModel) {
  return Boolean(
    normalize(stockLevel.stockLevelId) &&
    normalize(stockLevel.productId) &&
    normalize(stockLevel.warehouseId),
  );
}

function toStockLevelDto(stockLevel: StockLevelReadModel): StockLevelReadDto {
  return {
    stockLevelId: normalize(stockLevel.stockLevelId),
    productId: normalize(stockLevel.productId),
    warehouseId: normalize(stockLevel.warehouseId),
    availableQuantity: normalize(stockLevel.availableQuantity),
    ...(normalize(stockLevel.reservedQuantity)
      ? { reservedQuantity: normalize(stockLevel.reservedQuantity) }
      : {}),
    ...(normalize(stockLevel.reorderThreshold)
      ? { reorderThreshold: normalize(stockLevel.reorderThreshold) }
      : {}),
    status: normalize(stockLevel.status),
    source: normalize(stockLevel.source) || "read-model",
    isMock: stockLevel.isMock,
    ...(normalize(stockLevel.notes) ? { notes: normalize(stockLevel.notes) } : {}),
  };
}

export function readStockLevels(stockLevels: StockLevelReadModel[]): StockLevelReadDto[] {
  return stockLevels
    .filter(isUsableStockLevel)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toStockLevelDto);
}

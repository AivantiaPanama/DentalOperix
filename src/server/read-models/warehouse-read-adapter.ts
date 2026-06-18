import type { WarehouseReadModel } from "@/server/read-models/worksheet-read-models";

export type WarehouseReadDto = {
  warehouseId: string;
  warehouseName: string;
  location?: string;
  status: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(warehouse: WarehouseReadModel) {
  const timestamp = Date.parse(warehouse.updatedAt || warehouse.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableWarehouse(warehouse: WarehouseReadModel) {
  return Boolean(normalize(warehouse.warehouseId) && normalize(warehouse.warehouseName));
}

function toWarehouseDto(warehouse: WarehouseReadModel): WarehouseReadDto {
  return {
    warehouseId: normalize(warehouse.warehouseId),
    warehouseName: normalize(warehouse.warehouseName),
    ...(normalize(warehouse.location) ? { location: normalize(warehouse.location) } : {}),
    status: normalize(warehouse.status),
    source: normalize(warehouse.source) || "read-model",
    isMock: warehouse.isMock,
    ...(normalize(warehouse.notes) ? { notes: normalize(warehouse.notes) } : {}),
  };
}

export function readWarehouses(warehouses: WarehouseReadModel[]): WarehouseReadDto[] {
  return warehouses
    .filter(isUsableWarehouse)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toWarehouseDto);
}

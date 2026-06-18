import type { ConsumableReadModel } from "@/server/read-models/worksheet-read-models";

export type ConsumableReadDto = {
  consumableId: string;
  productId?: string;
  consumableName: string;
  category?: string;
  status: string;
  unit?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(consumable: ConsumableReadModel) {
  const timestamp = Date.parse(consumable.updatedAt || consumable.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableConsumable(consumable: ConsumableReadModel) {
  return Boolean(normalize(consumable.consumableId) && normalize(consumable.consumableName));
}

function toConsumableDto(consumable: ConsumableReadModel): ConsumableReadDto {
  return {
    consumableId: normalize(consumable.consumableId),
    ...(normalize(consumable.productId) ? { productId: normalize(consumable.productId) } : {}),
    consumableName: normalize(consumable.consumableName),
    ...(normalize(consumable.category) ? { category: normalize(consumable.category) } : {}),
    status: normalize(consumable.status),
    ...(normalize(consumable.unit) ? { unit: normalize(consumable.unit) } : {}),
    source: normalize(consumable.source) || "read-model",
    isMock: consumable.isMock,
    ...(normalize(consumable.notes) ? { notes: normalize(consumable.notes) } : {}),
  };
}

export function readConsumables(consumables: ConsumableReadModel[]): ConsumableReadDto[] {
  return consumables
    .filter(isUsableConsumable)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toConsumableDto);
}

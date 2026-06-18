import type { CollectionReadModel } from "@/server/read-models/worksheet-read-models";

export type CollectionReadDto = {
  collectionId: string;
  invoiceId?: string;
  patientId?: string;
  status: string;
  outstandingAmount: string;
  attempts?: string;
  lastAttemptAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(collection: CollectionReadModel) {
  const timestamp = Date.parse(collection.updatedAt || collection.lastAttemptAt || collection.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableCollection(collection: CollectionReadModel) {
  return Boolean(normalize(collection.collectionId) && normalize(collection.status));
}

function toCollectionDto(collection: CollectionReadModel): CollectionReadDto {
  return {
    collectionId: normalize(collection.collectionId),
    ...(normalize(collection.invoiceId) ? { invoiceId: normalize(collection.invoiceId) } : {}),
    ...(normalize(collection.patientId) ? { patientId: normalize(collection.patientId) } : {}),
    status: normalize(collection.status),
    outstandingAmount: normalize(collection.outstandingAmount),
    ...(normalize(collection.attempts) ? { attempts: normalize(collection.attempts) } : {}),
    ...(normalize(collection.lastAttemptAt) ? { lastAttemptAt: normalize(collection.lastAttemptAt) } : {}),
    source: normalize(collection.source) || "read-model",
    isMock: collection.isMock,
    ...(normalize(collection.notes) ? { notes: normalize(collection.notes) } : {}),
  };
}

export function readCollections(collections: CollectionReadModel[]): CollectionReadDto[] {
  return collections
    .filter(isUsableCollection)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toCollectionDto);
}

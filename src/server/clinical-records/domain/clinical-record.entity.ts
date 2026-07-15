import type {
  ClinicalRecordAggregateRoot,
  CreateClinicalRecordInput,
  CreateClinicalRecordOptions,
} from "./clinical-record.types";
import {
  createClinicalRecordIdValue,
  createClinicalRecordPatientIdValue,
} from "./clinical-record.value-objects";
import { validateCreateClinicalRecordInput } from "./clinical-record.validation";

function resolveOperationTimestamp(now?: string): string {
  return now ?? new Date().toISOString();
}

function createEventId(recordId: string, eventName: string): string {
  return `${recordId}_${eventName}`;
}

export function createClinicalRecordAggregate(
  input: CreateClinicalRecordInput,
  options: CreateClinicalRecordOptions = {},
): ClinicalRecordAggregateRoot {
  const validated = validateCreateClinicalRecordInput(input);
  const now = resolveOperationTimestamp(options.now);
  const id = createClinicalRecordIdValue(
    validated.id ?? options.id,
    `clinical_record_${Date.now()}`,
  );
  const patientId = createClinicalRecordPatientIdValue(validated.patientId);
  const status = validated.status ?? "draft";
  const actor = validated.actor;

  return {
    id,
    patientId,
    status,
    createdByUserId: actor?.userId,
    createdByRole: actor?.role,
    createdVia: actor?.via ?? "clinical-record-foundation",
    createdAt: now,
    updatedAt: now,
    domainEvents: [
      {
        id: createEventId(id, "created"),
        type: "ClinicalRecordCreated",
        clinicalRecordId: id,
        patientId,
        occurredAt: now,
      },
      ...(status === "active"
        ? [
            {
              id: createEventId(id, "activated"),
              type: "ClinicalRecordActivated" as const,
              clinicalRecordId: id,
              patientId,
              occurredAt: now,
            },
          ]
        : []),
    ],
  };
}

export const createClinicalRecordEntity = createClinicalRecordAggregate;

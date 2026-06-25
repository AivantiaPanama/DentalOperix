import type { ClinicalRecord, ClinicalRecordDomainEvent } from "../domain/clinical-record.types";

export type RelationalClinicalRecordRow = {
  id: string;
  patient_id: string;
  status: "draft" | "active";
  created_by_user_id: string | null;
  created_by_role: string | null;
  created_via: "clinical-record-foundation";
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalClinicalRecordDomainEventRow = {
  id: string;
  clinical_record_id: string;
  patient_id: string;
  type: "ClinicalRecordCreated" | "ClinicalRecordActivated";
  occurred_at: string | Date;
};

function serializeTimestamp(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function mapClinicalRecordToRelationalValues(record: ClinicalRecord): unknown[] {
  return [
    record.id,
    record.patientId,
    record.status,
    record.createdByUserId ?? null,
    record.createdByRole ?? null,
    record.createdVia,
    record.createdAt,
    record.updatedAt,
  ];
}

export function mapClinicalRecordEventToRelationalValues(event: ClinicalRecordDomainEvent): unknown[] {
  return [event.id, event.clinicalRecordId, event.patientId, event.type, event.occurredAt];
}

export function mapRelationalClinicalRecordGraphToDomain(input: {
  record: RelationalClinicalRecordRow;
  events: RelationalClinicalRecordDomainEventRow[];
}): ClinicalRecord {
  return {
    id: input.record.id,
    patientId: input.record.patient_id,
    status: input.record.status,
    createdByUserId: input.record.created_by_user_id ?? undefined,
    createdByRole: input.record.created_by_role ?? undefined,
    createdVia: input.record.created_via,
    createdAt: serializeTimestamp(input.record.created_at),
    updatedAt: serializeTimestamp(input.record.updated_at),
    domainEvents: input.events.map((event) => ({
      id: event.id,
      type: event.type,
      clinicalRecordId: event.clinical_record_id,
      patientId: event.patient_id,
      occurredAt: serializeTimestamp(event.occurred_at),
    })),
  };
}

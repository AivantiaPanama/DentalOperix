import type { PatientActorRole, PatientCreationSource, PatientId } from "./patient-domain";

export const PATIENT_AUDIT_EVENT_TYPES = [
  "patient_created",
  "patient_updated",
  "contact_point_added",
  "contact_point_updated",
  "identifier_added",
  "identifier_updated",
  "manual_merge_requested",
  "manual_merge_completed",
] as const;

export type PatientAuditEventType = (typeof PATIENT_AUDIT_EVENT_TYPES)[number];

export type PatientAuditEvent = {
  id?: string;
  patientId: PatientId;
  type: PatientAuditEventType;
  actorUserId?: string;
  actorRole?: PatientActorRole;
  source: PatientCreationSource;
  occurredAt: string;
  metadata?: Record<string, unknown>;
};

export interface PatientAuditContract {
  recordPatientAuditEvent(event: PatientAuditEvent): Promise<void>;
}

export class NoopPatientAuditContract implements PatientAuditContract {
  async recordPatientAuditEvent(): Promise<void> {
    return undefined;
  }
}

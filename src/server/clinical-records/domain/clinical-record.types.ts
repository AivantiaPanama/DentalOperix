export type ClinicalRecordId = string;
export type ClinicalRecordPatientId = string;
export type ClinicalRecordStatus = "draft" | "active";
export type ClinicalRecordSource = "clinical-record-foundation";

export type ClinicalRecordAuditActor = {
  userId?: string;
  role?: string;
  via: ClinicalRecordSource;
};

export type ClinicalRecordDomainEventType = "ClinicalRecordCreated" | "ClinicalRecordActivated";

export type ClinicalRecordDomainEvent = {
  id: string;
  type: ClinicalRecordDomainEventType;
  clinicalRecordId: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  occurredAt: string;
};

export type ClinicalRecord = {
  id: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  status: ClinicalRecordStatus;
  createdByUserId?: string;
  createdByRole?: string;
  createdVia: ClinicalRecordSource;
  createdAt: string;
  updatedAt: string;
  domainEvents: ClinicalRecordDomainEvent[];
};

export type ClinicalRecordAggregateRoot = ClinicalRecord;

export type CreateClinicalRecordInput = {
  id?: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  status?: ClinicalRecordStatus;
  actor?: ClinicalRecordAuditActor;
};

export type CreateClinicalRecordOptions = {
  id?: ClinicalRecordId;
  now?: string;
};

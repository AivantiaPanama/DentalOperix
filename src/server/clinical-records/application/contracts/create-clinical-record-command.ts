import type {
  ClinicalRecordAuditActor,
  ClinicalRecordId,
  ClinicalRecordPatientId,
  ClinicalRecordStatus,
} from "../../domain/clinical-record.types";

export type CreateClinicalRecordCommand = {
  id?: ClinicalRecordId;
  patientId: ClinicalRecordPatientId;
  status?: ClinicalRecordStatus;
  actor?: ClinicalRecordAuditActor;
};

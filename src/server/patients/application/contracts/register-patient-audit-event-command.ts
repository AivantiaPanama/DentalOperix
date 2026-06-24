import type { PatientServiceContext } from "../types/patient-service-context";

export type RegisterPatientAuditEventCommand = {
  patientId: string;
  eventType: string;
  context: PatientServiceContext;
  beforeState?: object;
  afterState?: object;
};

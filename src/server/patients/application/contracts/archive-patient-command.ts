import type { PatientServiceContext } from "../types/patient-service-context";

export type ArchivePatientCommand = {
  patientId: string;
  reason: string;
  context: PatientServiceContext;
};

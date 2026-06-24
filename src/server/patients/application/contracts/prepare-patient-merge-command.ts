import type { PatientServiceContext } from "../types/patient-service-context";

export type PreparePatientMergeCommand = {
  sourcePatientId: string;
  targetPatientId: string;
  context: PatientServiceContext;
};

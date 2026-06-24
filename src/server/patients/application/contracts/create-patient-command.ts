import type { PatientServiceContext } from "../types/patient-service-context";

/**
 * Request Patient creation.
 *
 * Restrictions:
 * - No patientId.
 * - No persistence identifiers.
 */
export type CreatePatientCommand = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | null;
  phones?: string[];
  emails?: string[];
  source: string;
  context: PatientServiceContext;
};

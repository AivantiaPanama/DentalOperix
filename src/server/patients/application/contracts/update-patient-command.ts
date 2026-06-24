import type { PatientServiceContext } from "../types/patient-service-context";

/**
 * Request Patient update.
 *
 * Restrictions:
 * - Cannot replace identity authority.
 * - Cannot bypass domain validation.
 */
export type UpdatePatientCommand = {
  patientId: string;
  firstName?: string;
  lastName?: string;
  phones?: string[];
  emails?: string[];
  context: PatientServiceContext;
};

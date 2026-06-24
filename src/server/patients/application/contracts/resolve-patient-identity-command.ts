import type { PatientServiceContext } from "../types/patient-service-context";

/**
 * Request patient identity resolution.
 *
 * Constraint:
 * - At least one search criterion is required by the future application service.
 */
export type ResolvePatientIdentityCommand = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  identifier?: string;
  context: PatientServiceContext;
};

import type { PatientApplicationError } from "./patient-application-errors";

/**
 * 61.3-03-A Patient Application Services standard response wrapper.
 *
 * Governance boundary:
 * - Application result envelope only.
 * - Service implementation and orchestration are intentionally out of scope for this batch.
 */
export type PatientServiceResult<T> =
  | {
      success: true;
      data: T;
      errors: [];
    }
  | {
      success: false;
      data?: undefined;
      errors: PatientApplicationError[];
    };

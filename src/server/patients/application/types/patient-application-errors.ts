/**
 * 61.3-03-A Patient Application Services shared error contract.
 *
 * Governance boundary:
 * - Application DTO only.
 * - No domain rules, persistence references, UI models, or Lead ownership changes.
 */
export type PatientApplicationError = {
  code: string;
  message: string;
  details?: string;
};

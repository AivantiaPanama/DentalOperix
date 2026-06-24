export type IdentityResolutionCandidate = {
  patientId: string;
  confidence: number;
  matchedFields: string[];
};

/**
 * Patient identity resolution result.
 *
 * Restriction:
 * - No automatic merge.
 */
export type IdentityResolutionResult = {
  candidates: IdentityResolutionCandidate[];
  ambiguous: boolean;
  exactMatch: boolean;
};

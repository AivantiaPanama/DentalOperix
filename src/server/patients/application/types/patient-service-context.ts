/**
 * 61.3-03-A Patient Application Services execution context.
 *
 * Governance boundary:
 * - Execution metadata only.
 * - No business rules and no persistence references.
 */
export type PatientServiceContext = {
  actorId: string;
  actorType: string;
  correlationId: string;
  timestamp: Date;
};

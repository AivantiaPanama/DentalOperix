export type MergeConflict = {
  fieldName: string;
  sourceValue: string;
  targetValue: string;
};

/**
 * Manual merge preparation result.
 *
 * Restrictions:
 * - Merge execution prohibited.
 * - Manual review required.
 */
export type MergePreparationResult = {
  sourcePatientId: string;
  targetPatientId: string;
  conflicts: MergeConflict[];
  reviewRequired: boolean;
};

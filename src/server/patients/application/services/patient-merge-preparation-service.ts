import type { Patient } from "../../patient-domain";
import type { PatientRepository } from "../../patient-repository";
import type { MergeConflict, MergePreparationResult } from "../contracts/merge-preparation-result";
import type { PreparePatientMergeCommand } from "../contracts/prepare-patient-merge-command";
import type { PatientApplicationError } from "../types/patient-application-errors";
import type { PatientServiceResult } from "../types/patient-service-result";

function failure(code: string, message: string, details?: string): PatientServiceResult<never> {
  const error: PatientApplicationError = details ? { code, message, details } : { code, message };
  return { success: false, errors: [error] };
}

function addConflict(
  conflicts: MergeConflict[],
  fieldName: string,
  sourceValue?: string | boolean,
  targetValue?: string | boolean,
) {
  if (sourceValue === undefined || targetValue === undefined || sourceValue === targetValue) return;
  conflicts.push({ fieldName, sourceValue: String(sourceValue), targetValue: String(targetValue) });
}

function buildConflicts(source: Patient, target: Patient): MergeConflict[] {
  const conflicts: MergeConflict[] = [];
  addConflict(conflicts, "displayName", source.displayName, target.displayName);
  addConflict(conflicts, "firstName", source.firstName, target.firstName);
  addConflict(conflicts, "lastName", source.lastName, target.lastName);
  addConflict(conflicts, "status", source.status, target.status);
  addConflict(conflicts, "requiresInvoice", source.requiresInvoice, target.requiresInvoice);
  addConflict(conflicts, "hasInsurance", source.hasInsurance, target.hasInsurance);
  return conflicts;
}

export class PreparePatientMergeService {
  constructor(private readonly repository: PatientRepository) {}

  async execute(
    command: PreparePatientMergeCommand,
  ): Promise<PatientServiceResult<MergePreparationResult>> {
    if (command.sourcePatientId === command.targetPatientId) {
      return failure(
        "INVALID_MERGE_TARGET",
        "Source and target patient identifiers must be different.",
      );
    }

    try {
      const [source, target] = await Promise.all([
        this.repository.findPatientById(command.sourcePatientId),
        this.repository.findPatientById(command.targetPatientId),
      ]);

      if (!source)
        return failure(
          "SOURCE_PATIENT_NOT_FOUND",
          `Patient ${command.sourcePatientId} was not found.`,
        );
      if (!target)
        return failure(
          "TARGET_PATIENT_NOT_FOUND",
          `Patient ${command.targetPatientId} was not found.`,
        );

      return {
        success: true,
        data: {
          sourcePatientId: source.id,
          targetPatientId: target.id,
          conflicts: buildConflicts(source, target),
          reviewRequired: true,
        },
        errors: [],
      };
    } catch (error) {
      return failure(
        "PATIENT_MERGE_PREPARATION_FAILED",
        "Patient merge preparation failed.",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

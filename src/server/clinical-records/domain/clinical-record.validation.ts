import { ClinicalRecordValidationError } from "./clinical-record.errors";
import type { CreateClinicalRecordInput } from "./clinical-record.types";

export function validateCreateClinicalRecordInput(
  input: CreateClinicalRecordInput,
): CreateClinicalRecordInput {
  const issues: string[] = [];
  if (!input.patientId?.trim()) issues.push("patientId is required.");
  if (input.status && input.status !== "draft" && input.status !== "active")
    issues.push("status must be draft or active.");
  if (issues.length)
    throw new ClinicalRecordValidationError("Invalid clinical record input.", issues);
  return { ...input, patientId: input.patientId.trim() };
}

import { z } from "zod";
import { ClinicalRecordValidationError } from "../domain/clinical-record.errors";

export const CLINICAL_NOTE_API_CONTRACT_VERSION = "75.0-WP-02-I1-M5-CLINICAL-NOTE-API-CONTRACTS" as const;

const optionalTrimmedString = z.string().trim().min(1).optional();

export const registerClinicalNoteApiSchema = z
  .object({
    id: optionalTrimmedString,
    clinicalRecordId: z.string().trim().min(1, "clinicalRecordId is required."),
    appointmentId: optionalTrimmedString,
    title: optionalTrimmedString,
    narrative: z.string().trim().min(1, "Clinical note narrative is required."),
    healthcareProfessionalId: z.string().trim().min(1, "healthcareProfessionalId is required."),
    now: optionalTrimmedString,
  })
  .strict();

export const updateClinicalNoteApiSchema = z
  .discriminatedUnion("operation", [
    z.object({
      operation: z.literal("complete"),
      healthcareProfessionalId: z.string().trim().min(1, "healthcareProfessionalId is required."),
      reason: optionalTrimmedString,
      now: optionalTrimmedString,
    }),
    z.object({
      operation: z.literal("reopen"),
      healthcareProfessionalId: z.string().trim().min(1, "healthcareProfessionalId is required."),
      reason: optionalTrimmedString,
      now: optionalTrimmedString,
    }),
    z.object({
      operation: z.literal("amend"),
      healthcareProfessionalId: z.string().trim().min(1, "healthcareProfessionalId is required."),
      title: optionalTrimmedString,
      narrative: z.string().trim().min(1, "Clinical note narrative cannot be empty.").optional(),
      now: optionalTrimmedString,
    }),
    z.object({
      operation: z.literal("archive"),
      healthcareProfessionalId: z.string().trim().min(1, "healthcareProfessionalId is required."),
      reason: optionalTrimmedString,
      now: optionalTrimmedString,
    }),
  ]);

export type RegisterClinicalNoteApiPayload = z.infer<typeof registerClinicalNoteApiSchema>;
export type UpdateClinicalNoteApiPayload = z.infer<typeof updateClinicalNoteApiSchema>;

export function clinicalNoteJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function readClinicalNoteJsonPayload(request: Request): Promise<unknown> {
  return request.json().catch(() => ({}));
}

export function parseClinicalNoteApiError(error: unknown): { status: number; message: string } {
  if (error instanceof z.ZodError) {
    return { status: 400, message: error.issues.map((issue) => issue.message).join(" ") };
  }

  if (error instanceof ClinicalRecordValidationError) {
    return { status: 400, message: error.issues.join(" ") };
  }

  return { status: 500, message: error instanceof Error ? error.message : "Unknown clinical note API error." };
}

export function getClinicalNotePatientIdFromPath(request: Request): string {
  const url = new URL(request.url, "http://localhost");
  const segments = url.pathname.split("/").filter(Boolean);
  const clinicalRecordsIndex = segments.indexOf("clinical-records");
  const patientId = clinicalRecordsIndex >= 0 ? segments[clinicalRecordsIndex + 1] : undefined;

  if (!patientId || patientId === "notes") {
    throw new ClinicalRecordValidationError("Clinical note patientId path parameter is required.");
  }

  return decodeURIComponent(patientId);
}

export function getClinicalNoteIdFromPath(request: Request): string {
  const url = new URL(request.url, "http://localhost");
  const segments = url.pathname.split("/").filter(Boolean);
  const notesIndex = segments.indexOf("notes");
  const clinicalNoteId = notesIndex >= 0 ? segments[notesIndex + 1] : undefined;

  if (!clinicalNoteId) {
    throw new ClinicalRecordValidationError("clinicalNoteId path parameter is required.");
  }

  return decodeURIComponent(clinicalNoteId);
}

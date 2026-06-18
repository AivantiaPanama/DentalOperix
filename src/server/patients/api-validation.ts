import { z } from "zod";
import {
  CLINICAL_PROFILE_FIELDS,
  PATIENT_ADMINISTRATIVE_UPDATE_FIELDS,
  type PatientAdministrativeProfileUpdate,
} from "@/lib/patients/admin-profile";

const administrativeUpdateSchema = z
  .object({
    displayName: z.string().trim().min(1).max(160).optional(),
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(6).max(30).optional(),
    email: z.string().trim().email().max(180).optional(),
    birthDate: z.string().trim().max(40).optional(),
    address: z.string().trim().max(280).optional(),
    emergencyContact: z.string().trim().max(180).optional(),
    preferredContactMethod: z.string().trim().max(80).optional(),
  })
  .strict();

export class InvalidPatientPayloadError extends Error {}

function getPayloadKeys(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  return Object.keys(payload);
}

export function parseAdministrativeProfileUpdate(payload: unknown): PatientAdministrativeProfileUpdate {
  const keys = getPayloadKeys(payload);
  const clinicalFields = keys.filter((key) =>
    CLINICAL_PROFILE_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase()),
  );

  if (clinicalFields.length > 0) {
    throw new InvalidPatientPayloadError(
      `El perfil administrativo no acepta campos clínicos: ${clinicalFields.join(", ")}.`,
    );
  }

  const invalidFields = keys.filter(
    (key) => !PATIENT_ADMINISTRATIVE_UPDATE_FIELDS.includes(key as never),
  );

  if (invalidFields.length > 0) {
    throw new InvalidPatientPayloadError(
      `Campos administrativos no permitidos: ${invalidFields.join(", ")}.`,
    );
  }

  const result = administrativeUpdateSchema.safeParse(payload);
  if (!result.success) {
    throw new InvalidPatientPayloadError(result.error.issues.map((issue) => issue.message).join(" "));
  }

  if (Object.keys(result.data).length === 0) {
    throw new InvalidPatientPayloadError("No se enviaron campos administrativos para actualizar.");
  }

  return result.data;
}

export function getPatientIdFromPath(request: Request, suffix = ""): string {
  const pathname = new URL(request.url).pathname;
  const prefix = "/api/patients/";
  if (!pathname.startsWith(prefix)) return "";

  const raw = pathname.slice(prefix.length, suffix ? -suffix.length : undefined);
  return decodeURIComponent(raw.replace(/\/$/, ""));
}

export function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

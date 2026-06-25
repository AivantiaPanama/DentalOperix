import { z } from "zod";
import {
  CLINICAL_PROFILE_FIELDS,
  PATIENT_ADMINISTRATIVE_UPDATE_FIELDS,
  type PatientAdministrativeProfileUpdate,
} from "@/lib/patients/admin-profile";
import { PATIENT_CREATION_SOURCES, PATIENT_IDENTIFIER_TYPES, PATIENT_STATUSES } from "@/server/patients/domain/patient.enums";
import type { CreatePatientApplicationCommand, PatientIdentitySearchCommand, UpdatePatientApplicationCommand } from "@/server/patients/application";

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

const actorSchema = z
  .object({
    userId: z.string().trim().min(1).max(120).optional(),
    role: z.enum(["administrator", "doctor", "assistant", "system"]).optional(),
    via: z.enum(PATIENT_CREATION_SOURCES),
  })
  .strict();

const metadataSchema = z
  .object({
    correlationId: z.string().trim().min(1).max(120).optional(),
    requestedByUserId: z.string().trim().min(1).max(120).optional(),
  })
  .strict();

const createPhoneSchema = z
  .object({
    phone: z.string().trim().min(6).max(30),
    label: z.string().trim().min(1).max(80).optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict();

const createEmailSchema = z
  .object({
    email: z.string().trim().email().max(180),
    label: z.string().trim().min(1).max(80).optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict();

const createIdentifierSchema = z
  .object({
    type: z.enum(PATIENT_IDENTIFIER_TYPES),
    value: z.string().trim().min(1).max(120),
    issuingAuthority: z.string().trim().min(1).max(120).optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict();

const createPatientSchema = z
  .object({
    displayName: z.string().trim().min(1).max(160).optional(),
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().min(1).max(120).optional(),
    secondLastName: z.string().trim().min(1).max(120).optional(),
    source: z.enum(PATIENT_CREATION_SOURCES).default("admin"),
    requiresInvoice: z.boolean().optional(),
    isRetired: z.boolean().optional(),
    hasInsurance: z.boolean().optional(),
    phones: z.array(createPhoneSchema).max(5).optional(),
    emails: z.array(createEmailSchema).max(5).optional(),
    identifiers: z.array(createIdentifierSchema).max(5).optional(),
    actor: actorSchema.optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .refine((value) => value.displayName || value.firstName || value.lastName, {
    message: "Patient creation requires displayName, firstName, or lastName.",
  })
  .refine((value) => !value.actor || value.actor.via === undefined || value.actor.via === value.source, {
    message: "Patient actor.via must match the creation source when provided.",
  });

const updatePatientSchema = z
  .object({
    patientId: z.string().trim().min(1).max(120),
    displayName: z.string().trim().min(1).max(160).optional(),
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().min(1).max(120).optional(),
    secondLastName: z.string().trim().min(1).max(120).optional(),
    status: z.enum(PATIENT_STATUSES).optional(),
    requiresInvoice: z.boolean().optional(),
    isRetired: z.boolean().optional(),
    hasInsurance: z.boolean().optional(),
    actor: actorSchema.optional(),
    metadata: metadataSchema.optional(),
  })
  .strict();

const searchPatientSchema = z
  .object({
    normalizedName: z.string().trim().min(1).max(180).optional(),
    email: z.string().trim().email().max(180).optional(),
    phone: z.string().trim().min(6).max(30).optional(),
    identifierType: z.enum(PATIENT_IDENTIFIER_TYPES).optional(),
    identifierValue: z.string().trim().min(1).max(120).optional(),
    excludePatientId: z.string().trim().min(1).max(120).optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      Boolean(value.normalizedName || value.email || value.phone || value.identifierValue),
    { message: "Patient search requires at least one identity criterion." },
  )
  .refine((value) => !value.identifierType || Boolean(value.identifierValue), {
    message: "identifierValue is required when identifierType is provided.",
  });

export class InvalidPatientPayloadError extends Error {}

function getPayloadKeys(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  return Object.keys(payload);
}

function parseSchema<T>(schema: z.ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new InvalidPatientPayloadError(result.error.issues.map((issue) => issue.message).join(" "));
  }

  return result.data;
}

export async function readJsonPayload(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (_error) {
    throw new InvalidPatientPayloadError("Invalid or missing JSON payload.");
  }
}

export function parsePatientCreatePayload(payload: unknown): CreatePatientApplicationCommand {
  return parseSchema(createPatientSchema, payload) as CreatePatientApplicationCommand;
}

export function parsePatientUpdatePayload(payload: unknown): { patientId: string; command: UpdatePatientApplicationCommand } {
  const parsed = parseSchema(updatePatientSchema, payload);
  const { patientId, ...command } = parsed;

  if (Object.keys(command).filter((key) => key !== "metadata" && key !== "actor").length === 0) {
    throw new InvalidPatientPayloadError("Patient update requires at least one mutable patient field.");
  }

  return { patientId, command: command as UpdatePatientApplicationCommand };
}

export function parsePatientSearchPayload(payload: unknown): PatientIdentitySearchCommand {
  return parseSchema(searchPatientSchema, payload) as PatientIdentitySearchCommand;
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

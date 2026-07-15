import { z } from "zod";

export const LEAD_OPERATIONAL_STATUSES = [
  "nuevo",
  "contactado",
  "seguimiento",
  "descartado",
] as const;
export const LEAD_OPERATION_PRIORITIES = ["baja", "normal", "alta"] as const;

export type LeadOperationalStatus = (typeof LEAD_OPERATIONAL_STATUSES)[number];
export type LeadOperationPriority = (typeof LEAD_OPERATION_PRIORITIES)[number];

export type LeadOperationsUpdate = {
  operationalStatus?: LeadOperationalStatus;
  priority?: LeadOperationPriority;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  contactResult?: string;
  internalNote?: string;
};

export const LEAD_OPERATIONS_UPDATE_FIELDS = [
  "operationalStatus",
  "priority",
  "lastContactAt",
  "nextFollowUpAt",
  "contactResult",
  "internalNote",
] as const;

export const PROTECTED_LEAD_FIELDS = [
  "calendarEventId",
  "emailSent",
  "appointmentDate",
  "appointmentTime",
  "date",
  "time",
  "eventLink",
  "gmailMessageId",
  "diagnosis",
  "diagnóstico",
  "treatmentPlan",
  "clinicalNotes",
  "odontogram",
  "radiographs",
  "medicalDocuments",
  "historiaClinica",
  "notasMedicas",
] as const;

const optionalDateValue = z
  .string()
  .trim()
  .max(40)
  .refine(
    (value) => value === "" || !Number.isNaN(Date.parse(value)),
    "La fecha enviada no es válida.",
  )
  .optional();

const leadOperationsUpdateSchema = z
  .object({
    operationalStatus: z.enum(LEAD_OPERATIONAL_STATUSES).optional(),
    priority: z.enum(LEAD_OPERATION_PRIORITIES).optional(),
    lastContactAt: optionalDateValue,
    nextFollowUpAt: optionalDateValue,
    contactResult: z.string().trim().max(160).optional(),
    internalNote: z.string().trim().max(1200).optional(),
  })
  .strict();

export class InvalidLeadOperationsPayloadError extends Error {}

function getPayloadKeys(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  return Object.keys(payload);
}

export function parseLeadOperationsUpdate(payload: unknown): LeadOperationsUpdate {
  const keys = getPayloadKeys(payload);
  const protectedFields = keys.filter((key) =>
    PROTECTED_LEAD_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase()),
  );

  if (protectedFields.length > 0) {
    throw new InvalidLeadOperationsPayloadError(
      `La operación de leads no acepta campos protegidos: ${protectedFields.join(", ")}.`,
    );
  }

  const invalidFields = keys.filter((key) => !LEAD_OPERATIONS_UPDATE_FIELDS.includes(key as never));
  if (invalidFields.length > 0) {
    throw new InvalidLeadOperationsPayloadError(
      `Campos operativos no permitidos: ${invalidFields.join(", ")}.`,
    );
  }

  const result = leadOperationsUpdateSchema.safeParse(payload);
  if (!result.success) {
    throw new InvalidLeadOperationsPayloadError(
      result.error.issues.map((issue) => issue.message).join(" "),
    );
  }

  if (Object.keys(result.data).length === 0) {
    throw new InvalidLeadOperationsPayloadError(
      "No se enviaron campos operativos para actualizar.",
    );
  }

  return result.data;
}

export function getLeadIdFromPath(request: Request, suffix = ""): string {
  const pathname = new URL(request.url).pathname;
  const prefix = "/api/leads/";
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

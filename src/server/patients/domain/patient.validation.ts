import { z } from "zod";
import {
  PATIENT_ACTOR_ROLES,
  PATIENT_CONTACT_POINT_STATUSES,
  PATIENT_CREATION_SOURCES,
  PATIENT_IDENTIFIER_TYPES,
  PATIENT_STATUSES,
} from "./patient.enums";
import { PatientValidationError } from "./patient.errors";

const optionalTrimmedString = z.string().trim().min(1).optional();
const requiredTrimmedString = z.string().trim().min(1);

export const patientStatusSchema = z.enum(PATIENT_STATUSES);
export const patientCreationSourceSchema = z.enum(PATIENT_CREATION_SOURCES);
export const patientActorRoleSchema = z.enum(PATIENT_ACTOR_ROLES);
export const patientContactPointStatusSchema = z.enum(PATIENT_CONTACT_POINT_STATUSES);
export const patientIdentifierTypeSchema = z.enum(PATIENT_IDENTIFIER_TYPES);

export const patientAuditActorSchema = z.object({
  userId: optionalTrimmedString,
  role: patientActorRoleSchema.optional(),
  via: patientCreationSourceSchema,
});

export const createPatientPhoneInputSchema = z.object({
  id: optionalTrimmedString,
  phone: requiredTrimmedString,
  label: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientEmailInputSchema = z.object({
  id: optionalTrimmedString,
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  label: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientAddressInputSchema = z.object({
  id: optionalTrimmedString,
  line1: requiredTrimmedString,
  line2: optionalTrimmedString,
  city: optionalTrimmedString,
  state: optionalTrimmedString,
  postalCode: optionalTrimmedString,
  country: optionalTrimmedString,
  label: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientIdentifierInputSchema = z.object({
  id: optionalTrimmedString,
  type: patientIdentifierTypeSchema,
  value: requiredTrimmedString,
  issuingAuthority: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientInputSchema = z
  .object({
    id: optionalTrimmedString,
    displayName: optionalTrimmedString,
    firstName: optionalTrimmedString,
    lastName: optionalTrimmedString,
    secondLastName: optionalTrimmedString,
    status: patientStatusSchema.optional().default("active"),
    source: patientCreationSourceSchema,
    linkedLeadId: optionalTrimmedString,
    linkedAppointmentId: optionalTrimmedString,
    requiresInvoice: z.boolean().optional().default(false),
    isRetired: z.boolean().optional().default(false),
    hasInsurance: z.boolean().optional().default(false),
    phones: z.array(createPatientPhoneInputSchema).optional().default([]),
    emails: z.array(createPatientEmailInputSchema).optional().default([]),
    addresses: z.array(createPatientAddressInputSchema).optional().default([]),
    identifiers: z.array(createPatientIdentifierInputSchema).optional().default([]),
    actor: patientAuditActorSchema.optional(),
  })
  .superRefine((value, ctx) => {
    const hasName = Boolean(value.displayName || value.firstName || value.lastName || value.secondLastName);
    if (!hasName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["displayName"], message: "Patient name is required." });
    }

    if (["web", "chat", "whatsapp"].includes(value.source) && value.emails.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emails"],
        message: "Public-channel patient creation requires at least one email.",
      });
    }

    if (["phone", "walk_in", "assistant", "admin", "doctor"].includes(value.source) && value.phones.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phones"],
        message: "Clinic/internal patient creation requires at least one phone.",
      });
    }

    if (value.requiresInvoice && !value.identifiers.some((identifier) => identifier.type === "cid")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identifiers"],
        message: "CID identifier is required when invoice data is required.",
      });
    }
  });

export const updatePatientInputSchema = z
  .object({
    displayName: optionalTrimmedString,
    firstName: optionalTrimmedString,
    lastName: optionalTrimmedString,
    secondLastName: optionalTrimmedString,
    status: patientStatusSchema.optional(),
    requiresInvoice: z.boolean().optional(),
    isRetired: z.boolean().optional(),
    hasInsurance: z.boolean().optional(),
    actor: patientAuditActorSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one patient field must be provided for update.",
  });

function validationErrorFromZod(error: z.ZodError): PatientValidationError {
  return new PatientValidationError(
    "Invalid patient data.",
    error.issues.map((issue) => issue.message),
  );
}

export function validateCreatePatientInput(input: unknown) {
  const result = createPatientInputSchema.safeParse(input);
  if (!result.success) throw validationErrorFromZod(result.error);
  return result.data;
}

export function validateUpdatePatientInput(input: unknown) {
  const result = updatePatientInputSchema.safeParse(input);
  if (!result.success) throw validationErrorFromZod(result.error);
  return result.data;
}

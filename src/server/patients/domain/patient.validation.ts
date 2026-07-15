import { z } from "zod";
import {
  PATIENT_ACTOR_ROLES,
  PATIENT_CONTACT_POINT_STATUSES,
  PATIENT_CREATION_SOURCES,
  PATIENT_IDENTIFIER_TYPES,
  PATIENT_STATUSES,
} from "./patient.enums";
import { PatientValidationError } from "./patient.errors";
import {
  normalizeEmail,
  validatePatientAddressValue,
  validatePatientEmailValue,
  validatePatientIdentifierValue,
  validatePatientNameValue,
  validatePatientPhoneValue,
} from "./patient.value-objects";
import type { CreatePatientInput, UpdatePatientInput } from "./patient.types";

const optionalTrimmedString = z.string().trim().min(1).optional();
const requiredTrimmedString = z.string().trim().min(1);

function domainValueObjectIssue(message?: string): string {
  return message ?? "Invalid patient value object.";
}

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
  phone: requiredTrimmedString.refine((value) => validatePatientPhoneValue(value).valid, {
    message: domainValueObjectIssue(validatePatientPhoneValue("").message),
  }),
  label: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientEmailInputSchema = z.object({
  id: optionalTrimmedString,
  email: z
    .string()
    .trim()
    .refine((value) => validatePatientEmailValue(value).valid, {
      message: "Patient email must be valid.",
    })
    .transform((value) => normalizeEmail(value)),
  label: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export const createPatientAddressInputSchema = z.object({
  id: optionalTrimmedString,
  line1: requiredTrimmedString.refine(
    (value) => validatePatientAddressValue({ line1: value }).valid,
    {
      message: domainValueObjectIssue(validatePatientAddressValue({}).message),
    },
  ),
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
  value: requiredTrimmedString.refine((value) => validatePatientIdentifierValue(value).valid, {
    message: domainValueObjectIssue(validatePatientIdentifierValue("").message),
  }),
  issuingAuthority: optionalTrimmedString,
  isPrimary: z.boolean().optional().default(false),
  status: patientContactPointStatusSchema.optional().default("active"),
});

export type PatientDomainInvariantViolation = {
  path: string[];
  message: string;
};

export function collectCreatePatientDomainInvariantViolations(
  value: Pick<
    CreatePatientInput,
    "displayName" | "firstName" | "lastName" | "secondLastName" | "source" | "requiresInvoice"
  > & {
    emails: Array<unknown>;
    phones: Array<unknown>;
    identifiers: Array<{ type?: string }>;
  },
): PatientDomainInvariantViolation[] {
  const violations: PatientDomainInvariantViolation[] = [];
  const nameValidation = validatePatientNameValue(value);

  if (!nameValidation.valid) {
    violations.push({
      path: ["displayName"],
      message: domainValueObjectIssue(nameValidation.message),
    });
  }

  if (["web", "chat", "whatsapp"].includes(value.source) && value.emails.length === 0) {
    violations.push({
      path: ["emails"],
      message: "Public-channel patient creation requires at least one email.",
    });
  }

  if (
    ["phone", "walk_in", "assistant", "admin", "doctor"].includes(value.source) &&
    value.phones.length === 0
  ) {
    violations.push({
      path: ["phones"],
      message: "Clinic/internal patient creation requires at least one phone.",
    });
  }

  if (value.requiresInvoice && !value.identifiers.some((identifier) => identifier.type === "cid")) {
    violations.push({
      path: ["identifiers"],
      message: "CID identifier is required when invoice data is required.",
    });
  }

  return violations;
}

export function collectUpdatePatientDomainInvariantViolations(
  value: UpdatePatientInput,
): PatientDomainInvariantViolation[] {
  if (Object.keys(value).length === 0) {
    return [{ path: [], message: "At least one patient field must be provided for update." }];
  }

  return [];
}

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
    collectCreatePatientDomainInvariantViolations(value).forEach((violation) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: violation.path,
        message: violation.message,
      });
    });
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
  .superRefine((value, ctx) => {
    collectUpdatePatientDomainInvariantViolations(value).forEach((violation) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: violation.path,
        message: violation.message,
      });
    });
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

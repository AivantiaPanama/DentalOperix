import { z } from "zod";

/**
 * 61.3-01 Patient Identity Foundation domain model.
 *
 * Governance boundary:
 * - Patient is permanent person identity.
 * - Patient does not replace Lead or Appointment.
 * - Contact points and identifiers are mutable records under the Patient aggregate.
 * - No UI, treatment, billing, insurance benefits, automated merge, or RBAC bypass is implemented here.
 */
export const PATIENT_DOMAIN_VERSION = "61.3-01-FND-001" as const;

export const PATIENT_STATUSES = ["active", "inactive", "lost_contact", "archived"] as const;
export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const PATIENT_CREATION_SOURCES = [
  "web",
  "chat",
  "whatsapp",
  "phone",
  "walk_in",
  "lead",
  "appointment",
  "assistant",
  "admin",
  "doctor",
] as const;
export type PatientCreationSource = (typeof PATIENT_CREATION_SOURCES)[number];

export const PATIENT_ACTOR_ROLES = ["administrator", "doctor", "assistant", "system"] as const;
export type PatientActorRole = (typeof PATIENT_ACTOR_ROLES)[number];

export const PATIENT_CONTACT_POINT_STATUSES = ["active", "inactive"] as const;
export type PatientContactPointStatus = (typeof PATIENT_CONTACT_POINT_STATUSES)[number];

export const PATIENT_IDENTIFIER_TYPES = ["cid", "tax_id", "external", "other"] as const;
export type PatientIdentifierType = (typeof PATIENT_IDENTIFIER_TYPES)[number];

export type PatientId = string;

export type PatientAuditActor = {
  userId?: string;
  role?: PatientActorRole;
  via: PatientCreationSource;
};

export type PatientPhone = {
  id: string;
  patientId: PatientId;
  phone: string;
  normalizedPhone: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientEmail = {
  id: string;
  patientId: PatientId;
  email: string;
  normalizedEmail: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientAddress = {
  id: string;
  patientId: PatientId;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientIdentifier = {
  id: string;
  patientId: PatientId;
  type: PatientIdentifierType;
  value: string;
  normalizedValue: string;
  issuingAuthority?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type Patient = {
  id: PatientId;
  displayName: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  normalizedName: string;
  status: PatientStatus;
  source: PatientCreationSource;
  linkedLeadId?: string;
  linkedAppointmentId?: string;
  requiresInvoice: boolean;
  isRetired: boolean;
  hasInsurance: boolean;
  createdByUserId?: string;
  createdByRole?: PatientActorRole;
  createdVia: PatientCreationSource;
  updatedByUserId?: string;
  updatedByRole?: PatientActorRole;
  updatedVia?: PatientCreationSource;
  createdAt: string;
  updatedAt: string;
  phones: PatientPhone[];
  emails: PatientEmail[];
  addresses: PatientAddress[];
  identifiers: PatientIdentifier[];
};

export type CreatePatientPhoneInput = {
  id?: string;
  phone: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientEmailInput = {
  id?: string;
  email: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientAddressInput = {
  id?: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientIdentifierInput = {
  id?: string;
  type: PatientIdentifierType;
  value: string;
  issuingAuthority?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientInput = {
  id?: PatientId;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  status?: PatientStatus;
  source: PatientCreationSource;
  linkedLeadId?: string;
  linkedAppointmentId?: string;
  requiresInvoice?: boolean;
  isRetired?: boolean;
  hasInsurance?: boolean;
  phones?: CreatePatientPhoneInput[];
  emails?: CreatePatientEmailInput[];
  addresses?: CreatePatientAddressInput[];
  identifiers?: CreatePatientIdentifierInput[];
  actor?: PatientAuditActor;
};

export type UpdatePatientInput = Partial<
  Pick<
    Patient,
    | "displayName"
    | "firstName"
    | "lastName"
    | "secondLastName"
    | "status"
    | "requiresInvoice"
    | "isRetired"
    | "hasInsurance"
  >
> & {
  actor?: PatientAuditActor;
};

export class PatientValidationError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "PatientValidationError";
    this.issues = issues;
  }
}

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
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
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
    const hasName = Boolean(
      value.displayName || value.firstName || value.lastName || value.secondLastName,
    );
    if (!hasName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["displayName"],
        message: "Patient name is required.",
      });
    }

    if (["web", "chat", "whatsapp"].includes(value.source) && value.emails.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emails"],
        message: "Public-channel patient creation requires at least one email.",
      });
    }

    if (
      ["phone", "walk_in", "assistant", "admin", "doctor"].includes(value.source) &&
      value.phones.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phones"],
        message: "Clinic/internal patient creation requires at least one phone.",
      });
    }

    if (
      value.requiresInvoice &&
      !value.identifiers.some((identifier) => identifier.type === "cid")
    ) {
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

export function normalizeName(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeIdentifier(value: string): string {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

function buildDisplayName(
  input: Pick<CreatePatientInput, "displayName" | "firstName" | "lastName" | "secondLastName">,
): string {
  return (
    input.displayName ??
    [input.firstName, input.lastName, input.secondLastName].filter(Boolean).join(" ")
  ).trim();
}

function normalizePrimaryFlags<T extends { isPrimary: boolean }>(items: T[]): T[] {
  if (!items.length || items.some((item) => item.isPrimary)) return items;
  return items.map((item, index) => ({ ...item, isPrimary: index === 0 }));
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

export function createPatientEntity(
  input: CreatePatientInput,
  options: { id?: PatientId; now?: string } = {},
): Patient {
  const validated = validateCreatePatientInput(input);
  const now = options.now ?? new Date().toISOString();
  const id = validated.id ?? options.id ?? `patient_${Date.now()}`;
  const displayName = buildDisplayName(validated);
  const actor = validated.actor;

  const phones = normalizePrimaryFlags(
    validated.phones.map((phone, index) => ({
      id: phone.id ?? `${id}_phone_${index + 1}`,
      patientId: id,
      phone: phone.phone,
      normalizedPhone: normalizePhone(phone.phone),
      label: phone.label,
      isPrimary: phone.isPrimary,
      status: phone.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const emails = normalizePrimaryFlags(
    validated.emails.map((email, index) => ({
      id: email.id ?? `${id}_email_${index + 1}`,
      patientId: id,
      email: email.email,
      normalizedEmail: email.email.toLowerCase(),
      label: email.label,
      isPrimary: email.isPrimary,
      status: email.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const addresses = normalizePrimaryFlags(
    validated.addresses.map((address, index) => ({
      id: address.id ?? `${id}_address_${index + 1}`,
      patientId: id,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      label: address.label,
      isPrimary: address.isPrimary,
      status: address.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const identifiers = normalizePrimaryFlags(
    validated.identifiers.map((identifier, index) => ({
      id: identifier.id ?? `${id}_identifier_${index + 1}`,
      patientId: id,
      type: identifier.type,
      value: identifier.value,
      normalizedValue: normalizeIdentifier(identifier.value),
      issuingAuthority: identifier.issuingAuthority,
      isPrimary: identifier.isPrimary,
      status: identifier.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  return {
    id,
    displayName,
    firstName: validated.firstName,
    lastName: validated.lastName,
    secondLastName: validated.secondLastName,
    normalizedName: normalizeName(displayName),
    status: validated.status,
    source: validated.source,
    linkedLeadId: validated.linkedLeadId,
    linkedAppointmentId: validated.linkedAppointmentId,
    requiresInvoice: validated.requiresInvoice,
    isRetired: validated.isRetired,
    hasInsurance: validated.hasInsurance,
    createdByUserId: actor?.userId,
    createdByRole: actor?.role,
    createdVia: actor?.via ?? validated.source,
    createdAt: now,
    updatedAt: now,
    phones,
    emails,
    addresses,
    identifiers,
  };
}

export function applyPatientUpdate(
  patient: Patient,
  input: UpdatePatientInput,
  now = new Date().toISOString(),
): Patient {
  const validated = validateUpdatePatientInput(input);
  const actor = validated.actor;
  const nextDisplayName = validated.displayName ?? patient.displayName;

  return {
    ...patient,
    ...validated,
    displayName: nextDisplayName,
    normalizedName: normalizeName(nextDisplayName),
    updatedByUserId: actor?.userId ?? patient.updatedByUserId,
    updatedByRole: actor?.role ?? patient.updatedByRole,
    updatedVia: actor?.via ?? patient.updatedVia,
    updatedAt: now,
  };
}

export function isPatientStatus(value: unknown): value is PatientStatus {
  return typeof value === "string" && (PATIENT_STATUSES as readonly string[]).includes(value);
}

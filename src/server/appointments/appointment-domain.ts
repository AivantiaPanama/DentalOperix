import { z } from "zod";

/**
 * 61.2-06B Appointment Foundation domain model.
 *
 * Governance boundary:
 * - Appointments are an operational scheduling domain.
 * - Appointments may reference Leads but never replace Leads as Source of Truth.
 * - Provider assignment is per appointment only; it is not Doctor <-> Patient assignment.
 */
export const APPOINTMENT_DOMAIN_VERSION = "61.2-06B-FND-001" as const;

export const APPOINTMENT_STATUSES = [
  "requested",
  "suggested_alternative",
  "pending_patient_confirmation",
  "confirmed",
  "needs_assistant_review",
  "rescheduled",
  "cancelled",
  "expired",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_SOURCES = [
  "public_booking",
  "assistant_workspace",
  "system",
  "manual_import",
] as const;

export type AppointmentSource = (typeof APPOINTMENT_SOURCES)[number];

export const APPOINTMENT_ACTOR_ROLES = [
  "administrator",
  "doctor",
  "assistant",
  "patient",
  "system",
] as const;

export type AppointmentActorRole = (typeof APPOINTMENT_ACTOR_ROLES)[number];

export type AppointmentAuditActor = {
  userId?: string;
  role?: AppointmentActorRole;
  via: AppointmentSource;
};

export type Appointment = {
  id: string;
  leadId?: string;
  providerId?: string;
  requestedDate?: string;
  requestedTime?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  durationMinutes: number;
  service: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  notes?: string;
  calendarEventId?: string;
  createdByUserId?: string;
  createdByRole?: AppointmentActorRole;
  createdVia: AppointmentSource;
  updatedByUserId?: string;
  updatedByRole?: AppointmentActorRole;
  updatedVia?: AppointmentSource;
  cancelledByUserId?: string;
  cancelledByRole?: AppointmentActorRole;
  cancelledVia?: AppointmentSource;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAppointmentInput = {
  id?: string;
  leadId?: string;
  providerId?: string;
  requestedDate?: string;
  requestedTime?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  durationMinutes?: number;
  service: string;
  status?: AppointmentStatus;
  source: AppointmentSource;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  notes?: string;
  calendarEventId?: string;
  actor?: AppointmentAuditActor;
};

export type UpdateAppointmentInput = Partial<
  Pick<
    Appointment,
    | "providerId"
    | "requestedDate"
    | "requestedTime"
    | "scheduledStartAt"
    | "scheduledEndAt"
    | "durationMinutes"
    | "service"
    | "status"
    | "patientName"
    | "patientEmail"
    | "patientPhone"
    | "notes"
    | "calendarEventId"
    | "cancellationReason"
  >
> & {
  actor?: AppointmentAuditActor;
};

export class AppointmentValidationError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "AppointmentValidationError";
    this.issues = issues;
  }
}

const optionalTrimmedString = z.string().trim().min(1).optional();
export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);
export const appointmentSourceSchema = z.enum(APPOINTMENT_SOURCES);
export const appointmentActorRoleSchema = z.enum(APPOINTMENT_ACTOR_ROLES);
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/);
const isoDateTimeSchema = z.string().datetime();

export const appointmentAuditActorSchema = z.object({
  userId: optionalTrimmedString,
  role: appointmentActorRoleSchema.optional(),
  via: appointmentSourceSchema,
});

export const createAppointmentInputSchema = z
  .object({
    id: optionalTrimmedString,
    leadId: optionalTrimmedString,
    providerId: optionalTrimmedString,
    requestedDate: isoDateSchema.optional(),
    requestedTime: timeSchema.optional(),
    scheduledStartAt: isoDateTimeSchema.optional(),
    scheduledEndAt: isoDateTimeSchema.optional(),
    durationMinutes: z.number().int().positive().default(60),
    service: z.string().trim().min(1),
    status: appointmentStatusSchema.default("requested"),
    source: appointmentSourceSchema,
    patientName: z.string().trim().min(1),
    patientEmail: z.string().trim().email().optional(),
    patientPhone: optionalTrimmedString,
    notes: z.string().optional(),
    calendarEventId: optionalTrimmedString,
    actor: appointmentAuditActorSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.scheduledStartAt && !value.scheduledEndAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledEndAt"],
        message: "scheduledEndAt is required when scheduledStartAt is provided.",
      });
    }

    if (value.scheduledEndAt && !value.scheduledStartAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledStartAt"],
        message: "scheduledStartAt is required when scheduledEndAt is provided.",
      });
    }

    if (value.scheduledStartAt && value.scheduledEndAt) {
      const start = Date.parse(value.scheduledStartAt);
      const end = Date.parse(value.scheduledEndAt);
      if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduledEndAt"],
          message: "scheduledEndAt must be after scheduledStartAt.",
        });
      }
    }

    if (value.status === "confirmed" && !value.providerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["providerId"],
        message: "providerId is required for confirmed appointments.",
      });
    }

    if (value.status === "confirmed" && (!value.scheduledStartAt || !value.scheduledEndAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledStartAt"],
        message: "scheduledStartAt and scheduledEndAt are required for confirmed appointments.",
      });
    }
  });

export const updateAppointmentInputSchema = z
  .object({
    providerId: optionalTrimmedString,
    requestedDate: isoDateSchema.optional(),
    requestedTime: timeSchema.optional(),
    scheduledStartAt: isoDateTimeSchema.optional(),
    scheduledEndAt: isoDateTimeSchema.optional(),
    durationMinutes: z.number().int().positive().optional(),
    service: z.string().trim().min(1).optional(),
    status: appointmentStatusSchema.optional(),
    patientName: z.string().trim().min(1).optional(),
    patientEmail: z.string().trim().email().optional(),
    patientPhone: optionalTrimmedString,
    notes: z.string().optional(),
    calendarEventId: optionalTrimmedString,
    cancellationReason: z.string().optional(),
    actor: appointmentAuditActorSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one appointment field must be provided for update.",
  });

function validationErrorFromZod(error: z.ZodError): AppointmentValidationError {
  const issues = error.issues.map((issue) => issue.message);
  return new AppointmentValidationError("Invalid appointment data.", issues);
}

export function validateCreateAppointmentInput(input: unknown) {
  const result = createAppointmentInputSchema.safeParse(input);
  if (!result.success) throw validationErrorFromZod(result.error);
  return result.data;
}

export function validateUpdateAppointmentInput(input: unknown) {
  const result = updateAppointmentInputSchema.safeParse(input);
  if (!result.success) throw validationErrorFromZod(result.error);
  return result.data;
}

export function isAppointmentStatus(value: unknown): value is AppointmentStatus {
  return typeof value === "string" && (APPOINTMENT_STATUSES as readonly string[]).includes(value);
}

export function statusConsumesProviderCapacity(status: AppointmentStatus): boolean {
  return status === "confirmed";
}

export function createAppointmentEntity(
  input: CreateAppointmentInput,
  options: { id?: string; now?: string } = {},
): Appointment {
  const validated = validateCreateAppointmentInput(input);
  const now = options.now ?? new Date().toISOString();
  const id = validated.id ?? options.id ?? `appt_${Date.now()}`;
  const actor = validated.actor;

  return {
    id,
    leadId: validated.leadId,
    providerId: validated.providerId,
    requestedDate: validated.requestedDate,
    requestedTime: validated.requestedTime,
    scheduledStartAt: validated.scheduledStartAt,
    scheduledEndAt: validated.scheduledEndAt,
    durationMinutes: validated.durationMinutes,
    service: validated.service,
    status: validated.status,
    source: validated.source,
    patientName: validated.patientName,
    patientEmail: validated.patientEmail,
    patientPhone: validated.patientPhone,
    notes: validated.notes,
    calendarEventId: validated.calendarEventId,
    createdByUserId: actor?.userId,
    createdByRole: actor?.role,
    createdVia: actor?.via ?? validated.source,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyAppointmentUpdate(
  appointment: Appointment,
  input: UpdateAppointmentInput,
  now = new Date().toISOString(),
): Appointment {
  const validated = validateUpdateAppointmentInput(input);
  const actor = validated.actor;
  const next: Appointment = {
    ...appointment,
    ...validated,
    actor: undefined,
    updatedByUserId: actor?.userId ?? appointment.updatedByUserId,
    updatedByRole: actor?.role ?? appointment.updatedByRole,
    updatedVia: actor?.via ?? appointment.updatedVia,
    updatedAt: now,
  } as Appointment;

  delete (next as Appointment & { actor?: AppointmentAuditActor }).actor;

  if (validated.status === "cancelled") {
    next.cancelledByUserId = actor?.userId ?? appointment.cancelledByUserId;
    next.cancelledByRole = actor?.role ?? appointment.cancelledByRole;
    next.cancelledVia = actor?.via ?? appointment.cancelledVia;
  }

  return next;
}

export function intervalsOverlap(
  first: { startAt: string; endAt: string },
  second: { startAt: string; endAt: string },
): boolean {
  const firstStart = Date.parse(first.startAt);
  const firstEnd = Date.parse(first.endAt);
  const secondStart = Date.parse(second.startAt);
  const secondEnd = Date.parse(second.endAt);

  if (![firstStart, firstEnd, secondStart, secondEnd].every(Number.isFinite)) {
    throw new AppointmentValidationError("Invalid interval datetime.");
  }

  return firstStart < secondEnd && secondStart < firstEnd;
}

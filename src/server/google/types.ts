import { z } from "zod";

export const CRM_STATUS = {
  NUEVO: "nuevo",
  AGENDADA: "agendada",
  COMPLETADA: "completada",
  CANCELADA: "cancelada",
  NO_ASISTIO: "no asistió",
} as const;

export type CRMStatus = (typeof CRM_STATUS)[keyof typeof CRM_STATUS];
export const CRM_STATUS_VALUES = Object.values(CRM_STATUS) as CRMStatus[];

export const googleCRMLeadSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  name: z.string().min(1),
  phone: z.string().min(6).max(20),
  email: z.string().email(),
  treatment: z.string().min(1),
  message: z.string().optional(),
  urgency: z.enum(["low", "media", "high"]).optional(),
  preferredDate: z.string().optional(),
  status: z.enum(CRM_STATUS_VALUES),
  source: z.string().optional(),
  aiSummary: z.string().optional(),
  calendarEventId: z.string().optional(),
  emailSent: z.boolean(),
});

export type GoogleCRMLeadPayload = z.infer<typeof googleCRMLeadSchema>;

export const googleCalendarAppointmentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(20),
  service: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  notes: z.string().optional(),
});

export type GoogleCalendarAppointmentInput = z.infer<typeof googleCalendarAppointmentSchema>;

export const googleDentalConfirmationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  service: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  eventLink: z.string().url(),
  notes: z.string().optional(),
});

export type GoogleDentalConfirmationInput = z.infer<typeof googleDentalConfirmationSchema>;

export const googleLeadPayloadSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z.string().min(8, "Ingresa un teléfono válido.").max(20, "Teléfono demasiado largo."),
  service: z.string().min(1, "Describe el tratamiento que buscas."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora válida."),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export type GoogleLeadPayload = z.infer<typeof googleLeadPayloadSchema>;

export type GoogleCalendarPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
};

export type GmailConfirmationPayload = {
  email: string;
  name: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  eventLink: string;
};

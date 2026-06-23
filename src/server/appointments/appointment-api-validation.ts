import { z } from "zod";
import { appointmentSourceSchema } from "./appointment-domain";

export const appointmentAvailabilityRequestSchema = z.object({
  providerId: z.string().trim().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  excludeAppointmentId: z.string().trim().min(1).optional(),
});

export const appointmentRequestApiSchema = z.object({
  leadId: z.string().trim().min(1).optional(),
  providerId: z.string().trim().min(1).optional(),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  requestedTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  durationMinutes: z.number().int().positive().optional(),
  service: z.string().trim().min(1),
  source: appointmentSourceSchema,
  patientName: z.string().trim().min(1),
  patientEmail: z.string().trim().email().optional(),
  patientPhone: z.string().trim().min(1).optional(),
  notes: z.string().optional(),
});

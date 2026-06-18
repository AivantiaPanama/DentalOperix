import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { GoogleLeadPayload } from "@/lib/google/schemas";

const appointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).max(15),
  service: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
});

export type DentalAppointmentInput = z.infer<typeof appointmentSchema>;
export type DentalLeadPayload = GoogleLeadPayload & {
  appointmentId?: string;
  source?: string;
};

export const createDentalAppointment = createServerFn({ method: "POST" })
  .validator(appointmentSchema)
  .handler(async ({ data }) => {
    const { processDentalLead } = await import("./dental.server");
    const completePayload: DentalLeadPayload = {
      ...data,
      appointmentId: `dental_${Date.now()}`,
      source: "web-form",
    };

    return processDentalLead(completePayload);
  });

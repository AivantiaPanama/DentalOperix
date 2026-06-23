import { z } from "zod";
import { appointmentServiceProvider } from "@/server/appointments/appointment-service-provider";
import { appointmentErrorResponse, appointmentJsonResponse, assistantActorFromRequest } from "./_shared";

const confirmAppointmentPayloadSchema = z
  .object({
    appointmentId: z.string().trim().min(1),
    providerId: z.string().trim().min(1),
    scheduledStartAt: z.string().datetime(),
    scheduledEndAt: z.string().datetime(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const actor = assistantActorFromRequest(request, "appointments:confirm");
    const payload = confirmAppointmentPayloadSchema.parse(await request.json().catch(() => ({})));
    const appointment = await appointmentServiceProvider.getAppointmentService().confirmAppointment(payload.appointmentId, {
      providerId: payload.providerId,
      scheduledStartAt: payload.scheduledStartAt,
      scheduledEndAt: payload.scheduledEndAt,
      actor,
    });

    return appointmentJsonResponse({ success: true, appointment });
  } catch (error) {
    return appointmentErrorResponse(error);
  }
}

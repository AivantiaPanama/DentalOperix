import { z } from "zod";
import { appointmentServiceProvider } from "@/server/appointments/appointment-service-provider";
import { appointmentErrorResponse, appointmentJsonResponse, assistantActorFromRequest } from "./_shared";

const markReviewPayloadSchema = z
  .object({
    appointmentId: z.string().trim().min(1),
    notes: z.string().optional(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const actor = assistantActorFromRequest(request, "appointments:update");
    const payload = markReviewPayloadSchema.parse(await request.json().catch(() => ({})));
    const appointment = await appointmentServiceProvider.getAppointmentService().markNeedsAssistantReview(payload.appointmentId, {
      notes: payload.notes,
      actor,
    });

    return appointmentJsonResponse({ success: true, appointment });
  } catch (error) {
    return appointmentErrorResponse(error);
  }
}

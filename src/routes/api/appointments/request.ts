import { appointmentRequestApiSchema } from "@/server/appointments/appointment-api-validation";
import { appointmentServiceProvider } from "@/server/appointments/appointment-service-provider";
import { appointmentErrorResponse, appointmentJsonResponse, assistantActorFromRequest } from "./_shared";

export async function POST(request: Request) {
  try {
    const actor = assistantActorFromRequest(request, "appointments:create");
    const payload = appointmentRequestApiSchema
      .omit({ source: true })
      .strict()
      .parse(await request.json().catch(() => ({})));

    const appointment = await appointmentServiceProvider.getAppointmentService().createRequest({
      ...payload,
      source: "assistant_workspace",
      actor,
    });

    return appointmentJsonResponse({ success: true, appointment }, 201);
  } catch (error) {
    return appointmentErrorResponse(error);
  }
}

import { appointmentAvailabilityRequestSchema } from "@/server/appointments/appointment-api-validation";
import { appointmentServiceProvider } from "@/server/appointments/appointment-service-provider";
import { appointmentErrorResponse, appointmentJsonResponse, assistantActorFromRequest } from "./_shared";

export async function POST(request: Request) {
  try {
    assistantActorFromRequest(request, "appointments:read");
    const payload = appointmentAvailabilityRequestSchema.strict().parse(await request.json().catch(() => ({})));
    const availability = await appointmentServiceProvider.getAvailabilityService().checkProviderAvailability(payload);

    return appointmentJsonResponse({ success: true, ...availability });
  } catch (error) {
    return appointmentErrorResponse(error);
  }
}

import { googleLeadPayloadSchema, type GoogleLeadPayload } from "@/lib/google/schemas";
import { processDentalLead } from "@/lib/api/dental.server";
import { z } from "zod";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = googleLeadPayloadSchema.safeParse(body);

  if (!parseResult.success) {
    const firstIssue = parseResult.error.errors[0];
    const baseMessage =
      firstIssue?.message ?? "Para continuar necesito saber qué tratamiento o servicio necesitas.";
    const message =
      firstIssue?.path.includes("service") ||
      firstIssue?.message.includes("Describe el tratamiento")
        ? "Para continuar necesito saber qué tratamiento o servicio necesitas."
        : baseMessage;

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await processDentalLead({
      ...parseResult.data,
      appointmentId: `lead_${Date.now()}`,
    } as GoogleLeadPayload);

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al procesar lead en CRM/Calendar/Gmail:", error);

    if (
      error instanceof z.ZodError ||
      (error instanceof Error && error.message.includes("Se requiere un tratamiento o servicio."))
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Para continuar necesito saber qué tratamiento o servicio necesitas.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const isDev = process.env.NODE_ENV !== "production";
    const errorMessage = isDev
      ? error instanceof Error
        ? error.message
        : "Error desconocido al procesar la solicitud."
      : "No se pudo procesar la solicitud.";

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

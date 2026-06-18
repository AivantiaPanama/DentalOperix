import { createGoogleEvent } from "@/server/google/calendar";
import { googleCalendarAppointmentSchema } from "@/server/google/types";
import {
  createUnauthorizedResponse,
  requireInternalApiKey,
  UnauthorizedApiKeyError,
} from "@/lib/internal-api-key.server";

export async function POST(request: Request) {
  try {
    requireInternalApiKey(request);
    const body = await request.json();
    const parseResult = googleCalendarAppointmentSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: parseResult.error.flatten(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const event = await createGoogleEvent(parseResult.data);

    return new Response(JSON.stringify({ success: true, eventLink: event.htmlLink }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof UnauthorizedApiKeyError) {
      return createUnauthorizedResponse();
    }

    console.error(error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

import { writeGoalSettingsToSheet } from "@/server/google/goals";
import { GoalSettings, validateGoalSettings } from "@/lib/goal-config";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";

export async function POST(request: Request) {
  try {
    requirePermission(request, "goals:write");
    const body = await request.json();
    const settings = body as GoalSettings;

    const validationErrors = validateGoalSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid goal settings", validationErrors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await writeGoalSettingsToSheet(settings);
    return new Response(JSON.stringify({ success: true, goals: settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }
    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }
    console.error("Failed to save goal settings to sheet:", error);
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

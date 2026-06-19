import { readGoalSettingsFromSheet } from "@/server/google/goals";
import { getDefaultGoals } from "@/lib/goal-config";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";

export async function GET(request: Request) {
  try {
    requirePermission(request, "goals:read");
    const goals = await readGoalSettingsFromSheet();
    return new Response(JSON.stringify({ success: true, goals }), {
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
    console.warn("Goal settings sheet unavailable; returning default goal configuration:", error);
    return new Response(
      JSON.stringify({
        success: true,
        goals: getDefaultGoals(),
        fallback: "default-goal-configuration",
        warning: "Goal settings sheet unavailable; returned safe defaults.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";

import { jsonResponse } from "@/server/leads/api-validation";

import { getOperationalDailyView } from "@/server/read-models/operational-daily-view-service";

export async function GET(request: Request) {
  try {
    requirePermission(request, "operations:read");

    const daily = await getOperationalDailyView();

    return jsonResponse({
      success: true,
      daily,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }

    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }

    console.error("Failed to build operational daily view:", error);

    return jsonResponse(
      {
        success: false,
        error: "No se pudo cargar la operación diaria.",
      },
      500,
    );
  }
}
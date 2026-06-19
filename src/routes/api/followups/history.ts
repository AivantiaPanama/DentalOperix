import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { logger } from "@/lib/logger.server";
import { readAutomationRunRecords } from "@/server/google/automation";

export async function GET(request: Request) {
  try {
    requirePermissionOrInternalApiKey(request, "automation:read");
    const records = await readAutomationRunRecords();
    return new Response(JSON.stringify({ success: true, records }), {
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

    logger.error("followups.history", "Failed to load automation history; returning degraded empty history", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return new Response(
      JSON.stringify({
        success: true,
        degraded: true,
        source: "empty-fallback",
        records: [],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

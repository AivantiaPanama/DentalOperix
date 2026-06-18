import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import { listLeadOperationsProfiles } from "@/server/leads/operations-repository";

export async function GET(request: Request) {
  try {
    requirePermission(request, "leads:read");
    const leadOperations = await listLeadOperationsProfiles();

    return jsonResponse({ success: true, leadOperations });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error("Failed to list lead operations:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

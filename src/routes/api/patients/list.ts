import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/patients/api-validation";
import { getReadModelSource } from "@/server/read-models/read-model-source-provider";

export async function GET(request: Request) {
  try {
    requirePermission(request, "patients:read");
    const source = await getReadModelSource({ consumerName: "Patient Management" });

    return jsonResponse({ success: true, patients: source.patients });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error("Failed to list patient administrative profiles:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/patients/api-validation";
import { createPatientReadService } from "@/server/patients/read";

export async function GET(request: Request) {
  try {
    requirePermission(request, "patients:read");
    const patients = await createPatientReadService().listPatients("Patient Management");

    return jsonResponse({ success: true, patients });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error("Failed to list patient administrative profiles through Patient Read Service:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

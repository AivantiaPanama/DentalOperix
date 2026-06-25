import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { getPatientIdFromPath, jsonResponse } from "@/server/patients/api-validation";
import { createPatientReadService, PatientReadServiceNotFoundError } from "@/server/patients/read";

export async function GET(request: Request) {
  try {
    requirePermission(request, "patients:read");
    const id = getPatientIdFromPath(request);
    const patient = await createPatientReadService().getPatientById(id, "Patient Management Detail");

    return jsonResponse({ success: true, patient });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof PatientReadServiceNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to get patient administrative profile through Patient Read Service:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { getPatientIdFromPath, jsonResponse } from "@/server/patients/api-validation";
import {
  PatientNotFoundError,
  verifyPatientAdministrativeProfile,
} from "@/server/patients/admin-repository";
import { recordOperationalAuditEventSafely } from "@/server/audit/operational-audit";

export async function POST(request: Request) {
  try {
    const session = requirePermission(request, "patients:verifyProfile");
    const id = getPatientIdFromPath(request, "/verify-profile");
    const patient = await verifyPatientAdministrativeProfile(id, session);

    recordOperationalAuditEventSafely(
      {
        action: "patient.profile.verified",
        resourceType: "patient",
        resourceId: id,
      },
      session,
    );

    return jsonResponse({ success: true, patient });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof PatientNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to verify patient administrative profile:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

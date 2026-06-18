import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import {
  getPatientIdFromPath,
  jsonResponse,
  parseAdministrativeProfileUpdate,
  InvalidPatientPayloadError,
} from "@/server/patients/api-validation";
import {
  PatientNotFoundError,
  updatePatientAdministrativeProfile,
} from "@/server/patients/admin-repository";
import { recordOperationalAuditEventSafely } from "@/server/audit/operational-audit";

export async function PATCH(request: Request) {
  try {
    const session = requirePermission(request, "patients:adminUpdate");
    const id = getPatientIdFromPath(request, "/admin-profile");
    const payload = await request.json();
    const update = parseAdministrativeProfileUpdate(payload);
    const patient = await updatePatientAdministrativeProfile(id, update, session);

    recordOperationalAuditEventSafely(
      {
        action: "patient.admin_profile.updated",
        resourceType: "patient",
        resourceId: id,
        metadata: { updatedFields: Object.keys(update).join(",") },
      },
      session,
    );

    return jsonResponse({ success: true, patient });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidPatientPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    if (error instanceof PatientNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to update patient administrative profile:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { PatientApplicationLayerNotFoundError, updatePatientUseCase } from "@/server/patients/application";
import { createPatientPersistencePort } from "@/server/patients/persistence";
import {
  InvalidPatientPayloadError,
  jsonResponse,
  parsePatientUpdatePayload,
  readJsonPayload,
} from "@/server/patients/api-validation";

export async function PATCH(request: Request) {
  try {
    requirePermission(request, "patients:write");
    const payload = await readJsonPayload(request);
    const { patientId, command } = parsePatientUpdatePayload(payload);
    const result = await updatePatientUseCase(createPatientPersistencePort(), patientId, command);

    return jsonResponse({ success: true, patient: result.patient });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidPatientPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    if (error instanceof PatientApplicationLayerNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to update patient through Patient Application Layer:", error);
    return jsonResponse({ success: false, error: "Controlled patient update failure." }, 500);
  }
}

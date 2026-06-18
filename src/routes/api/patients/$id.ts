import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { getPatientIdFromPath, jsonResponse } from "@/server/patients/api-validation";
import {
  getPatientAdministrativeProfile,
  PatientNotFoundError,
} from "@/server/patients/admin-repository";
import { getReadModelSource } from "@/server/read-models/read-model-source-provider";

export async function GET(request: Request) {
  try {
    requirePermission(request, "patients:read");
    const id = getPatientIdFromPath(request);
    const source = await getReadModelSource({ consumerName: "Patient Management Detail" });
    const patient = source.patients.find((candidate) => candidate.id === id);

    if (patient) return jsonResponse({ success: true, patient });

    if (source.mode === "read-model") {
      const fallbackPatient = await getPatientAdministrativeProfile(id);
      return jsonResponse({ success: true, patient: fallbackPatient });
    }

    throw new PatientNotFoundError(`Paciente ${id} no encontrado.`);
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof PatientNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to get patient administrative profile:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { createPatientUseCase } from "@/server/patients/application";
import { createPatientPersistencePort } from "@/server/patients/persistence";
import {
  InvalidPatientPayloadError,
  jsonResponse,
  parsePatientCreatePayload,
  readJsonPayload,
} from "@/server/patients/api-validation";

export async function POST(request: Request) {
  try {
    requirePermission(request, "patients:write");
    const payload = await readJsonPayload(request);
    const command = parsePatientCreatePayload(payload);
    const result = await createPatientUseCase(createPatientPersistencePort(), command);

    return jsonResponse({ success: true, patient: result.patient }, 201);
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidPatientPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to create patient through Patient Application Layer:", error);
    return jsonResponse({ success: false, error: "Controlled patient creation failure." }, 500);
  }
}

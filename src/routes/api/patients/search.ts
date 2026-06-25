import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import {
  InvalidPatientPayloadError,
  jsonResponse,
  parsePatientSearchPayload,
} from "@/server/patients/api-validation";
import { createPatientReadService } from "@/server/patients/read";

export async function GET(request: Request) {
  try {
    requirePermission(request, "patients:read");
    const params = new URL(request.url).searchParams;
    const searchPayload: Record<string, unknown> = {};
    const normalizedName = params.get("normalizedName") ?? params.get("name");
    const correlationId = params.get("correlationId");

    if (normalizedName) searchPayload.normalizedName = normalizedName;
    if (params.get("email")) searchPayload.email = params.get("email");
    if (params.get("phone")) searchPayload.phone = params.get("phone");
    if (params.get("identifierType")) searchPayload.identifierType = params.get("identifierType");
    if (params.get("identifierValue")) searchPayload.identifierValue = params.get("identifierValue");
    if (params.get("excludePatientId")) searchPayload.excludePatientId = params.get("excludePatientId");
    if (correlationId) searchPayload.metadata = { correlationId };

    const query = parsePatientSearchPayload(searchPayload);
    const patients = await createPatientReadService().searchPatients(query, "Patient Management Search");

    return jsonResponse({ success: true, patients });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidPatientPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to search patients through Patient Read Service:", error);
    return jsonResponse({ success: false, error: "Controlled patient search failure." }, 500);
  }
}

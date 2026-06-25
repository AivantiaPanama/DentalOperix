import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { searchPatientsByIdentityUseCase } from "@/server/patients/application";
import { createPatientPersistencePort } from "@/server/patients/persistence";
import {
  InvalidPatientPayloadError,
  jsonResponse,
  parsePatientSearchPayload,
} from "@/server/patients/api-validation";

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

    const command = parsePatientSearchPayload(searchPayload);
    const result = await searchPatientsByIdentityUseCase(createPatientPersistencePort(), command);

    if (result.duplicateReviewRequired) {
      return jsonResponse(
        {
          success: false,
          duplicateReviewRequired: true,
          candidates: result.patients,
          error: "Possible duplicate patients require manual review. Automated patient merge is not allowed.",
        },
        409,
      );
    }

    return jsonResponse({ success: true, patients: result.patients });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidPatientPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to search patients through Patient Application Layer:", error);
    return jsonResponse({ success: false, error: "Controlled patient search failure." }, 500);
  }
}

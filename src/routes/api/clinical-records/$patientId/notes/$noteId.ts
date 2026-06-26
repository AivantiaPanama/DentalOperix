import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import {
  clinicalNoteJsonResponse,
  createClinicalNoteApiController,
  getClinicalNoteIdFromPath,
  getClinicalNotePatientIdFromPath,
  parseClinicalNoteApiError,
} from "@/server/clinical-records/api";

function toClinicalNoteRouteErrorResponse(error: unknown): Response {
  if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
  if (error instanceof ForbiddenError) return createForbiddenResponse();
  const parsed = parseClinicalNoteApiError(error);
  return clinicalNoteJsonResponse({ success: false, error: parsed.message }, parsed.status);
}

export async function GET(request: Request) {
  try {
    requirePermission(request, "clinical:read");
    const patientId = getClinicalNotePatientIdFromPath(request);
    const clinicalNoteId = getClinicalNoteIdFromPath(request);
    return createClinicalNoteApiController().getClinicalNote(request, patientId, clinicalNoteId);
  } catch (error) {
    return toClinicalNoteRouteErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    requirePermission(request, "clinical:write");
    const patientId = getClinicalNotePatientIdFromPath(request);
    const clinicalNoteId = getClinicalNoteIdFromPath(request);
    return createClinicalNoteApiController().updateClinicalNote(request, patientId, clinicalNoteId);
  } catch (error) {
    return toClinicalNoteRouteErrorResponse(error);
  }
}

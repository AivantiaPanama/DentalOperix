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
    return createClinicalNoteApiController().listClinicalNotesByPatient(request, patientId);
  } catch (error) {
    return toClinicalNoteRouteErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    requirePermission(request, "clinical:write");
    const patientId = getClinicalNotePatientIdFromPath(request);
    return createClinicalNoteApiController().registerClinicalNote(request, patientId);
  } catch (error) {
    return toClinicalNoteRouteErrorResponse(error);
  }
}

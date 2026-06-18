import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import {
  InvalidOperationalAuditFiltersError,
  listOperationalAuditEvents,
  parseOperationalAuditFilters,
} from "@/server/audit/operational-audit";

export async function GET(request: Request) {
  try {
    requirePermission(request, "audit:read");
    const filters = parseOperationalAuditFilters(request);
    const events = await listOperationalAuditEvents(filters);

    return jsonResponse({ success: true, events, filters });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    if (error instanceof InvalidOperationalAuditFiltersError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to read operational audit trail:", error);
    return jsonResponse({ success: false, error: "No se pudo cargar la auditoría operativa." }, 500);
  }
}

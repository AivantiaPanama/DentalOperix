import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import {
  createExecutiveDashboardApiPayload,
  type ExecutiveDashboardApiAudience,
} from "@/server/read-models/executive-dashboard-api-service";

const EXECUTIVE_OBSERVABILITY_READ_PERMISSION = "executive-observability:read" as const;

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function getExecutiveDashboardApiResponse(
  request: Request,
  audience: ExecutiveDashboardApiAudience,
): Promise<Response> {
  try {
    requirePermissionOrInternalApiKey(request, EXECUTIVE_OBSERVABILITY_READ_PERMISSION);
    return jsonResponse(createExecutiveDashboardApiPayload(audience));
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error(`Failed to build executive observability ${audience} API response:`, error);
    return jsonResponse(
      { success: false, error: "No se pudieron cargar las métricas ejecutivas." },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import { getOperationalDataQualitySummary } from "@/server/data-quality/operational-data-quality";

export async function GET(request: Request) {
  try {
    requirePermission(request, "dataQuality:read");
    const quality = await getOperationalDataQualitySummary();
    return jsonResponse({ success: true, quality });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error("Failed to build operational data quality summary:", error);
    return jsonResponse(
      { success: false, error: "No se pudo cargar la calidad de datos operativa." },
      500,
    );
  }
}

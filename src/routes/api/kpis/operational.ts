import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import { getOperationalExecutiveKpis } from "@/server/kpis/operational-kpis";

export async function GET(request: Request) {
  try {
    requirePermission(request, "kpis:read");
    const kpis = await getOperationalExecutiveKpis();
    return jsonResponse({ success: true, kpis });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    console.error("Failed to build operational KPIs:", error);
    return jsonResponse({ success: false, error: "No se pudieron cargar los KPIs operativos." }, 500);
  }
}

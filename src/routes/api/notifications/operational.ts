import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import {
  getOperationalNotifications,
  InvalidOperationalNotificationFiltersError,
  parseOperationalNotificationFilters,
} from "@/server/notifications/operational-notifications";

export async function GET(request: Request) {
  try {
    const session = requirePermission(request, "notifications:read");
    const filters = parseOperationalNotificationFilters(request);
    const result = await getOperationalNotifications(filters, session.role);

    return jsonResponse({ success: true, ...result });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    if (error instanceof InvalidOperationalNotificationFiltersError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to build operational notifications:", error);
    return jsonResponse(
      { success: false, error: "No se pudieron cargar las notificaciones operativas." },
      500,
    );
  }
}

import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import {
  buildOperationalReportCsv,
  getOperationalAnalyticsReport,
  InvalidOperationalReportFiltersError,
  parseOperationalReportFilters,
} from "@/server/reporting/operational-analytics";
import { recordOperationalAuditEventSafely } from "@/server/audit/operational-audit";

export async function GET(request: Request) {
  try {
    const session = requirePermission(request, "reports:read");
    const filters = parseOperationalReportFilters(request);
    const report = await getOperationalAnalyticsReport(filters);

    if (filters.export === "csv") {
      recordOperationalAuditEventSafely(
        {
          action: "report.operational.exported",
          resourceType: "report",
          resourceId: "operational",
          metadata: { format: "csv" },
        },
        session,
      );

      return new Response(`${buildOperationalReportCsv(report)}\n`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="dentaloperix-reporte-operativo.csv"',
        },
      });
    }

    recordOperationalAuditEventSafely(
      {
        action: "report.operational.viewed",
        resourceType: "report",
        resourceId: "operational",
        metadata: { format: "json" },
      },
      session,
    );

    return jsonResponse({ success: true, report });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    if (error instanceof InvalidOperationalReportFiltersError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    console.error("Failed to build operational report:", error);
    return jsonResponse({ success: false, error: "No se pudo generar el reporte operativo." }, 500);
  }
}

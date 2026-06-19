import { getServerConfig } from "@/lib/config.server";
import type { CrmLeadRow } from "@/lib/crm-metrics";
import { filterLeadsByPeriod, normalizeDashboardPeriod } from "@/lib/date-filters";
import { createExecutiveAnalyticsSnapshot } from "@/lib/executive-analytics";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { createRevenueForecastSnapshot } from "@/lib/revenue-forecast";
import { createRevenueSnapshotV1 } from "@/lib/revenue-intelligence";
import { readLeadsFromSheet } from "@/server/google/sheets";

export async function GET(request: Request) {
  try {
    requirePermission(request, "reports:read");
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    throw error;
  }

  const config = getServerConfig();
  if (config.nodeEnv === "production" && !config.googleRefreshToken) {
    return new Response(
      JSON.stringify({ success: false, error: "Executive Analytics access is restricted in production." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const period = normalizeDashboardPeriod(new URL(request.url).searchParams.get("period"));
    const leads = (await readLeadsFromSheet()) as CrmLeadRow[];
    const filteredLeads = filterLeadsByPeriod(leads, period);
    const revenue = createRevenueSnapshotV1(filteredLeads);
    const forecast = createRevenueForecastSnapshot(revenue);
    const executive = createExecutiveAnalyticsSnapshot(revenue, forecast);

    return new Response(JSON.stringify({ success: true, period, executive }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to load Executive Analytics snapshot:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

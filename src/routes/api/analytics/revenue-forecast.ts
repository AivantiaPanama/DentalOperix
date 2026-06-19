import { getServerConfig } from "@/lib/config.server";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import type { CrmLeadRow } from "@/lib/crm-metrics";
import { filterLeadsByPeriod, normalizeDashboardPeriod } from "@/lib/date-filters";
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
      JSON.stringify({ success: false, error: "Revenue Forecast access is restricted in production." }),
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
    const snapshot = createRevenueSnapshotV1(filteredLeads);
    const forecast = createRevenueForecastSnapshot(snapshot);

    return new Response(JSON.stringify({ success: true, period, forecast }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to load Revenue Forecast snapshot:", error);
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

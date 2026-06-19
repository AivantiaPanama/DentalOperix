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

const jsonHeaders = { "Content-Type": "application/json" };

function createExecutiveSnapshotFromLeads(leads: CrmLeadRow[]) {
  const revenue = createRevenueSnapshotV1(leads);
  const forecast = createRevenueForecastSnapshot(revenue);
  return createExecutiveAnalyticsSnapshot(revenue, forecast);
}

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
        headers: jsonHeaders,
      },
    );
  }

  const period = normalizeDashboardPeriod(new URL(request.url).searchParams.get("period"));

  try {
    const leads = (await readLeadsFromSheet()) as CrmLeadRow[];
    const filteredLeads = filterLeadsByPeriod(leads, period);
    const executive = createExecutiveSnapshotFromLeads(filteredLeads);

    return new Response(JSON.stringify({ success: true, degraded: false, source: "google-sheets", period, executive }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.warn("Executive Analytics source unavailable; returning degraded empty snapshot:", error);
    const executive = createExecutiveSnapshotFromLeads([]);

    return new Response(
      JSON.stringify({
        success: true,
        degraded: true,
        source: "empty-fallback",
        period,
        warning: "Executive Analytics source unavailable; returned an empty read-only snapshot.",
        executive,
      }),
      {
        status: 200,
        headers: jsonHeaders,
      },
    );
  }
}

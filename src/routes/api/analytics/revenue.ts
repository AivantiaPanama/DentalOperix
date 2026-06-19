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
import { createRevenueSnapshotV1 } from "@/lib/revenue-intelligence";
import { readLeadsFromSheet } from "@/server/google/sheets";

const jsonHeaders = { "Content-Type": "application/json" };

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
      JSON.stringify({ success: false, error: "Revenue Intelligence access is restricted in production." }),
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
    const snapshot = createRevenueSnapshotV1(filteredLeads);

    return new Response(JSON.stringify({ success: true, degraded: false, source: "google-sheets", period, snapshot }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.warn("Revenue Intelligence source unavailable; returning degraded empty snapshot:", error);
    const snapshot = createRevenueSnapshotV1([]);

    return new Response(
      JSON.stringify({
        success: true,
        degraded: true,
        source: "empty-fallback",
        period,
        warning: "Revenue Intelligence source unavailable; returned an empty read-only snapshot.",
        snapshot,
      }),
      {
        status: 200,
        headers: jsonHeaders,
      },
    );
  }
}

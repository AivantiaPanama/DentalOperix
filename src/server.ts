import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getServerConfig } from "./lib/config.server";
import { getAuthSessionFromRequest } from "./lib/rbac/guards.server";
import { isRoleAllowed, type Role } from "./lib/rbac/roles";
import * as googleLoginHandler from "./routes/api/google/login";
import * as googleCallbackHandler from "./routes/api/google/callback";
import * as leadsCreateHandler from "./routes/api/leads/create";
import * as leadsListHandler from "./routes/api/leads/list";
import * as crmMetricsHandler from "./routes/api/crm/metrics";
import * as revenueAnalyticsHandler from "./routes/api/analytics/revenue";
import * as revenueForecastHandler from "./routes/api/analytics/revenue-forecast";
import * as calendarCreateEventHandler from "./routes/api/calendar/create-event";
import * as gmailSendConfirmationHandler from "./routes/api/gmail/send-confirmation";
import * as followupRunHandler from "./routes/api/followups/run";
import * as followupHistoryHandler from "./routes/api/followups/history";
import * as adminLoginHandler from "./routes/api/admin/login";
import * as adminLogoutHandler from "./routes/api/admin/logout";
import * as adminSessionHandler from "./routes/api/admin/session";
import * as goalsGetHandler from "./routes/api/goals/get";
import * as goalsSaveHandler from "./routes/api/goals/save";
import * as patientsListHandler from "./routes/api/patients/list";
import * as patientDetailHandler from "./routes/api/patients/$id";
import * as patientAdminProfileHandler from "./routes/api/patients/$id/admin-profile";
import * as patientVerifyProfileHandler from "./routes/api/patients/$id/verify-profile";
import * as leadOperationsListHandler from "./routes/api/leads/operations";
import * as leadOperationsDetailHandler from "./routes/api/leads/$id/operations";
import * as operationalReportHandler from "./routes/api/reports/operational";
import * as operationalAuditHandler from "./routes/api/audit/operational";
import * as operationalNotificationsHandler from "./routes/api/notifications/operational";
import * as operationalKpisHandler from "./routes/api/kpis/operational";
import * as operationalDataQualityHandler from "./routes/api/data-quality/operational";

const DASHBOARD_ROUTE_POLICIES: Array<{ prefix: string; allowedRoles: readonly Role[] }> = [
  { prefix: "/admin", allowedRoles: ["admin"] },
  { prefix: "/assistant", allowedRoles: ["assistant"] },
  { prefix: "/doctor", allowedRoles: ["doctor"] },
  { prefix: "/patient", allowedRoles: ["patient"] },
];

function getProtectedDashboardPolicy(pathname: string) {
  if (pathname === "/admin/login") return null;

  return (
    DASHBOARD_ROUTE_POLICIES.find(
      (policy) => pathname === policy.prefix || pathname.startsWith(`${policy.prefix}/`),
    ) ?? null
  );
}

function createDashboardLoginRedirect(request: Request) {
  const url = new URL(request.url);
  const loginUrl = new URL("/admin/login", url.origin);
  loginUrl.searchParams.set("redirect", `${url.pathname}${url.search}`);
  return Response.redirect(loginUrl.toString(), 302);
}

function createDashboardForbiddenResponse(allowedRoles: readonly Role[]) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Acceso restringido — DentalOperix</title></head><body style="font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f4ef;color:#1f2933"><main style="max-width:560px;margin:24px;padding:32px;border:1px solid #e5e7eb;border-radius:24px;background:white;text-align:center;box-shadow:0 20px 45px rgba(15,23,42,.08)"><p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:.18em;color:#64748b;font-size:12px">Acceso restringido</p><h1 style="margin:0 0 16px;font-size:28px">No tienes permiso para ver esta área</h1><p style="margin:0;color:#64748b;line-height:1.6">Esta sección está disponible únicamente para los roles autorizados: ${allowedRoles.join(", ")}.</p><a href="/" style="display:inline-block;margin-top:24px;padding:10px 18px;border-radius:999px;background:#0f766e;color:white;text-decoration:none;font-weight:600">Volver al inicio</a></main></body></html>`,
    {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

function enforceProtectedDashboardAccess(request: Request) {
  const url = new URL(request.url);
  const policy = getProtectedDashboardPolicy(url.pathname);
  if (!policy) return null;

  const session = getAuthSessionFromRequest(request);
  if (!session) return createDashboardLoginRedirect(request);

  if (!isRoleAllowed(session.role, policy.allowedRoles)) {
    return createDashboardForbiddenResponse(policy.allowedRoles);
  }

  return null;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const config = getServerConfig();
      const isProd = config.nodeEnv === "production";

      const dashboardAccessResponse = enforceProtectedDashboardAccess(request);
      if (dashboardAccessResponse) return dashboardAccessResponse;

      if (isProd && !config.googleRefreshToken) {
        if (url.pathname === "/dashboard") {
          return new Response(
            "Dashboard is unavailable in production without a configured Google refresh token.",
            {
              status: 403,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            },
          );
        }

        if (url.pathname === "/api/leads/list" || url.pathname === "/api/crm/metrics") {
          return new Response(
            JSON.stringify({ success: false, error: "Leads access is restricted in production." }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      if (url.pathname === "/api/admin/login" && request.method === "POST") {
        return await adminLoginHandler.POST(request);
      }

      if (url.pathname === "/api/admin/logout" && request.method === "POST") {
        return await adminLogoutHandler.POST();
      }

      if (url.pathname === "/api/admin/session" && request.method === "GET") {
        return await adminSessionHandler.GET(request);
      }

      if (url.pathname === "/api/google/login" && request.method === "GET") {
        return await googleLoginHandler.GET(request);
      }

      if (url.pathname === "/api/google/callback" && request.method === "GET") {
        return await googleCallbackHandler.GET(request);
      }

      if (url.pathname === "/api/leads/create" && request.method === "POST") {
        return await leadsCreateHandler.POST(request);
      }

      if (url.pathname === "/api/leads/list" && request.method === "GET") {
        return await leadsListHandler.GET(request);
      }

      if (url.pathname === "/api/crm/metrics" && request.method === "GET") {
        return await crmMetricsHandler.GET(request);
      }

      if (url.pathname === "/api/analytics/revenue" && request.method === "GET") {
        return await revenueAnalyticsHandler.GET(request);
      }

      if (url.pathname === "/api/analytics/revenue-forecast" && request.method === "GET") {
        return await revenueForecastHandler.GET(request);
      }

      if (url.pathname === "/api/goals/get" && request.method === "GET") {
        return await goalsGetHandler.GET(request);
      }

      if (url.pathname === "/api/goals/save" && request.method === "POST") {
        return await goalsSaveHandler.POST(request);
      }

      if (url.pathname === "/api/calendar/create-event" && request.method === "POST") {
        return await calendarCreateEventHandler.POST(request);
      }

      if (url.pathname === "/api/gmail/send-confirmation" && request.method === "POST") {
        return await gmailSendConfirmationHandler.POST(request);
      }

      if (url.pathname === "/api/followups/run" && request.method === "POST") {
        return await followupRunHandler.POST(request);
      }

      if (url.pathname === "/api/followups/history" && request.method === "GET") {
        return await followupHistoryHandler.GET(request);
      }

      if (url.pathname === "/api/patients/list" && request.method === "GET") {
        return await patientsListHandler.GET(request);
      }

      const patientAdminProfileMatch = url.pathname.match(
        /^\/api\/patients\/([^/]+)\/admin-profile$/,
      );
      if (patientAdminProfileMatch && request.method === "PATCH") {
        const nextUrl = new URL(request.url);
        nextUrl.searchParams.set("id", decodeURIComponent(patientAdminProfileMatch[1]));

        return await patientAdminProfileHandler.PATCH(
          new Request(nextUrl.toString(), request),
        );
      }

      const patientVerifyProfileMatch = url.pathname.match(
        /^\/api\/patients\/([^/]+)\/verify-profile$/,
      );
      if (patientVerifyProfileMatch && request.method === "POST") {
        const nextUrl = new URL(request.url);
        nextUrl.searchParams.set("id", decodeURIComponent(patientVerifyProfileMatch[1]));

        return await patientVerifyProfileHandler.POST(
          new Request(nextUrl.toString(), request),
        );
      }

      const patientDetailMatch = url.pathname.match(/^\/api\/patients\/([^/]+)$/);
      if (patientDetailMatch && request.method === "GET") {
        const nextUrl = new URL(request.url);
        nextUrl.searchParams.set("id", decodeURIComponent(patientDetailMatch[1]));

        return await patientDetailHandler.GET(
          new Request(nextUrl.toString(), request),
        );
      }

      if (url.pathname === "/api/leads/operations" && request.method === "GET") {
        return await leadOperationsListHandler.GET(request);
      }

      const leadOperationsMatch = url.pathname.match(/^\/api\/leads\/([^/]+)\/operations$/);
      if (leadOperationsMatch) {
        const nextUrl = new URL(request.url);
        nextUrl.searchParams.set("id", decodeURIComponent(leadOperationsMatch[1]));

        const nextRequest = new Request(nextUrl.toString(), request);

        if (request.method === "GET") {
          return await leadOperationsDetailHandler.GET(nextRequest);
        }

        if (request.method === "PATCH") {
          return await leadOperationsDetailHandler.PATCH(nextRequest);
        }
      }

      if (url.pathname === "/api/reports/operational" && request.method === "GET") {
        return await operationalReportHandler.GET(request);
      }

      if (url.pathname === "/api/audit/operational" && request.method === "GET") {
        return await operationalAuditHandler.GET(request);
      }

      if (url.pathname === "/api/notifications/operational" && request.method === "GET") {
        return await operationalNotificationsHandler.GET(request);
      }

      if (url.pathname === "/api/kpis/operational" && request.method === "GET") {
        return await operationalKpisHandler.GET(request);
      }

      if (url.pathname === "/api/data-quality/operational" && request.method === "GET") {
        return await operationalDataQualityHandler.GET(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

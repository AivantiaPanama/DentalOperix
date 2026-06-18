import type { MockLead } from "@/lib/mock/leads";
import { mockLeads } from "@/lib/mock/leads";
import { readLeadsFromSheet } from "@/server/google/sheets";
import { getServerConfig } from "@/lib/config.server";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";

export async function GET(request: Request) {
  try {
    requirePermissionOrInternalApiKey(request, "leads:read");
    const config = getServerConfig();
    if (config.nodeEnv === "production" && !config.googleRefreshToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Leads access is restricted in production." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const leads = await readLeadsFromSheet();
    if (!leads.length) {
      throw new Error("No hay leads en la hoja de cálculo.");
    }

    return new Response(JSON.stringify({ leads }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }
    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }

    console.warn("Falling back to mock leads:", error);

    return new Response(
      JSON.stringify({
        leads: mockLeads,
        fallback: true,
        message: "No se pudo leer Google Sheets, usando demo.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

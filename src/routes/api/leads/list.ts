import type { MockLead } from "@/lib/mock/leads";
import { mockLeads } from "@/lib/mock/leads";
import { leadPersistenceProvider, LeadPersistenceNotConfiguredError } from "@/server/leads/persistence";
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
    const adapter = leadPersistenceProvider.getActiveLeadPersistenceAdapter();
    if (config.nodeEnv === "production" && !adapter.getHealth().active) {
      return new Response(
        JSON.stringify({ success: false, error: "Leads persistence is not active in production." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const leads = await adapter.listLeads();
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

    if (error instanceof LeadPersistenceNotConfiguredError && getServerConfig().nodeEnv === "production") {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.warn("Falling back to mock leads:", error);

    return new Response(
      JSON.stringify({
        leads: mockLeads,
        fallback: true,
        message: "No se pudo leer la persistencia certificada de Leads, usando demo.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

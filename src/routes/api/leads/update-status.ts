import { z } from "zod";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import { leadPersistenceProvider } from "@/server/leads/persistence/lead-persistence-provider";
import { CRM_STATUS_VALUES } from "@/server/google/types";

const updateLeadStatusPayloadSchema = z
  .object({
    leadId: z.string().trim().min(1, "leadId es requerido."),
    status: z.enum(CRM_STATUS_VALUES),
  })
  .strict();

export async function POST(request: Request) {
  try {
    requirePermissionOrInternalApiKey(request, "leads:update");

    const payload = updateLeadStatusPayloadSchema.parse(await request.json().catch(() => ({})));
    const adapter = leadPersistenceProvider.getActiveLeadPersistenceAdapter();

    await adapter.updateLead(payload.leadId, { status: payload.status });

    return jsonResponse({ success: true, leadId: payload.leadId, status: payload.status });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();

    if (error instanceof z.ZodError) {
      return jsonResponse(
        { success: false, error: error.issues.map((issue) => issue.message).join(" ") },
        400,
      );
    }

    console.error("Failed to update lead status:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

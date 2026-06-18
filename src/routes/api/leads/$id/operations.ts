import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";

import {
  InvalidLeadOperationsPayloadError,
  jsonResponse,
  parseLeadOperationsUpdate,
} from "@/server/leads/api-validation";

import {
  getLeadOperationsProfile,
  LeadNotFoundError,
  updateLeadOperationsProfile,
} from "@/server/leads/operations-repository";
import { recordOperationalAuditEventSafely } from "@/server/audit/operational-audit";

function getLeadIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    throw new LeadNotFoundError("Lead id is required.");
  }

  return id;
}

export async function GET(request: Request) {
  try {
    requirePermission(request, "leads:read");
    const id = getLeadIdFromRequest(request);
    const leadOperations = await getLeadOperationsProfile(id);

    return jsonResponse({ success: true, leadOperations });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof LeadNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to read lead operations:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = requirePermission(request, "leads:update");
    const id = getLeadIdFromRequest(request);
    const payload = await request.json();
    const update = parseLeadOperationsUpdate(payload);
    const leadOperations = await updateLeadOperationsProfile(id, update, session);

    recordOperationalAuditEventSafely(
      {
        action: "lead.operations.updated",
        resourceType: "lead",
        resourceId: id,
        metadata: { updatedFields: Object.keys(update).join(",") },
      },
      session,
    );

    return jsonResponse({ success: true, leadOperations });
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    if (error instanceof InvalidLeadOperationsPayloadError) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }
    if (error instanceof LeadNotFoundError) {
      return jsonResponse({ success: false, error: error.message }, 404);
    }

    console.error("Failed to update lead operations:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

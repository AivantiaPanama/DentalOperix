import { z } from "zod";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { jsonResponse } from "@/server/leads/api-validation";
import {
  AppointmentProviderConflictError,
} from "@/server/appointments/appointment-service";
import { AppointmentValidationError } from "@/server/appointments/appointment-domain";
import type { AppointmentAuditActor } from "@/server/appointments/appointment-domain";
import type { Permission } from "@/lib/rbac/permissions";

export function assistantActorFromRequest(request: Request, permission: Permission): AppointmentAuditActor {
  const session = requirePermissionOrInternalApiKey(request, permission);
  return {
    userId: session?.userId,
    role: session?.role ?? "system",
    via: "assistant_workspace",
  };
}

export function appointmentJsonResponse(payload: unknown, status = 200) {
  return jsonResponse(payload, status);
}

export function appointmentErrorResponse(error: unknown): Response {
  if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
  if (error instanceof ForbiddenError) return createForbiddenResponse();

  if (error instanceof z.ZodError) {
    return appointmentJsonResponse(
      { success: false, error: error.issues.map((issue) => issue.message).join(" ") },
      400,
    );
  }

  if (error instanceof AppointmentValidationError) {
    return appointmentJsonResponse({ success: false, error: error.issues.join(" ") }, 400);
  }

  if (error instanceof AppointmentProviderConflictError) {
    return appointmentJsonResponse({ success: false, error: error.message, code: "provider_unavailable" }, 409);
  }

  console.error("Appointment API failed:", error);
  return appointmentJsonResponse(
    { success: false, error: error instanceof Error ? error.message : "Unknown error" },
    500,
  );
}

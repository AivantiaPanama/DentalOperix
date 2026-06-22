import {
  getAdminSessionFromRequest,
  requireAdminSession,
  UnauthorizedAdminError,
} from "@/lib/admin-auth.server";
import { requireInternalApiKey, UnauthorizedApiKeyError } from "@/lib/internal-api-key.server";
import type { Permission } from "./permissions";
import { canAssignUserRole, getPermissionsForRole, hasPermission } from "./permissions";
import { isAdministrator, isRoleAllowed, type Role } from "./roles";

export type AuthSession = {
  role: Role;
  permissions: readonly Permission[];
  userId?: string;
  email?: string;
  name?: string;
  patientId?: string;
  doctorId?: string;
  iat?: number;
  exp?: number;
};

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

function toAuthSession(session: { role: Role; iat: number; exp: number }): AuthSession {
  return {
    role: session.role,
    permissions: getPermissionsForRole(session.role),
    iat: session.iat,
    exp: session.exp,
  };
}

export function getAuthSessionFromRequest(request: Request): AuthSession | null {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) return null;
  return toAuthSession(adminSession);
}

export function requireAuth(request?: Request): AuthSession {
  try {
    const session = requireAdminSession(request);
    return toAuthSession(session);
  } catch (error) {
    if (error instanceof UnauthorizedAdminError) {
      throw new UnauthorizedError();
    }
    throw error;
  }
}

export function requireRole(request: Request, allowedRoles: readonly Role[]): AuthSession {
  const session = requireAuth(request);
  if (!isRoleAllowed(session.role, allowedRoles)) {
    throw new ForbiddenError();
  }
  return session;
}

export function requirePermission(request: Request, permission: Permission): AuthSession {
  const session = requireAuth(request);
  if (!hasPermission(session.role, permission)) {
    throw new ForbiddenError();
  }
  return session;
}

export function requireAdministrator(request: Request): AuthSession {
  const session = requireAuth(request);
  if (!isAdministrator(session.role)) {
    throw new ForbiddenError();
  }
  return session;
}

export function requireRoleAssignmentAuthority(request: Request): AuthSession {
  const session = requireAuth(request);
  if (!canAssignUserRole(session.role)) {
    throw new ForbiddenError("Only Administrator may assign user roles.");
  }
  return session;
}

export function requirePermissionOrInternalApiKey(
  request: Request,
  permission: Permission,
): AuthSession | null {
  const session = getAuthSessionFromRequest(request);
  if (session) {
    if (!hasPermission(session.role, permission)) {
      throw new ForbiddenError();
    }
    return session;
  }

  try {
    requireInternalApiKey(request);
    return null;
  } catch (error) {
    if (error instanceof UnauthorizedApiKeyError) {
      throw new UnauthorizedError();
    }
    throw error;
  }
}

export function requireOwnership(
  session: AuthSession,
  resourceOwnerId: string | undefined | null,
  ownerKey: "patientId" | "doctorId" | "userId" = "patientId",
): AuthSession {
  if (isAdministrator(session.role)) return session;
  if (!resourceOwnerId || session[ownerKey] !== resourceOwnerId) {
    throw new ForbiddenError();
  }
  return session;
}

export function createUnauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export function createForbiddenResponse() {
  return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

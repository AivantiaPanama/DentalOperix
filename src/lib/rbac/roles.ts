import { USER_ROLES, type UserRole } from "@/server/users/user-domain";

/**
 * 61.1-RBAC-001 Role Model.
 *
 * Governance boundary:
 * - Users remain identity records only.
 * - RBAC is authorization only.
 * - Roles must not create lead ownership or workflow ownership semantics.
 */
export const ROLES = USER_ROLES;

export type Role = UserRole;

export const ADMINISTRATOR_ROLE: Role = "administrator";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function assertRole(value: unknown): Role {
  if (!isRole(value)) {
    throw new Error("Invalid RBAC role.");
  }

  return value;
}

export function isAdministrator(role: Role): boolean {
  return role === ADMINISTRATOR_ROLE;
}

export function isRoleAllowed(role: Role, allowedRoles: readonly Role[]): boolean {
  return isAdministrator(role) || allowedRoles.includes(role);
}

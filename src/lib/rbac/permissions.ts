import type { Role } from "./roles";

/**
 * 61.1-RBAC-002 Authorization permissions.
 *
 * Governance boundary:
 * - RBAC grants access only; it does not define source-of-truth ownership.
 * - Leads remain the source of truth for lead data.
 * - Users remain identity only.
 */
export const PERMISSIONS = [
  "crm:read",
  "crm:write",
  "leads:read",
  "leads:update",
  "appointments:read",
  "appointments:create",
  "appointments:update",
  "appointments:confirm",
  "appointments:checkin",
  "appointments:checkout",
  "calendar:create",
  "gmail:send",
  "finance:read",
  "reports:read",
  "goals:read",
  "goals:write",
  "automation:read",
  "automation:run",
  "audit:read",
  "notifications:read",
  "kpis:read",
  "operations:read",
  "executive-observability:read",
  "dataQuality:read",
  "users:read",
  "users:write",
  "user.role.assign",
  "patients:read",
  "patients:selfRead",
  "patients:update",
  "patients:adminUpdate",
  "patients:verifyProfile",
  "clinical:read",
  "clinical:write",
  "settings:read",
  "settings:write",
  "documents:selfRead",
  "requests:create",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  administrator: PERMISSIONS,
  doctor: [
    "appointments:read",
    "appointments:update",
    "patients:read",
    "patients:update",
    "clinical:read",
    "clinical:write",
  ],
  assistant: [
    "leads:read",
    "leads:update",
    "reports:read",
    "appointments:read",
    "appointments:create",
    "appointments:update",
    "appointments:confirm",
    "appointments:checkin",
    "appointments:checkout",
    "patients:read",
    "patients:update",
    "patients:adminUpdate",
    "patients:verifyProfile",
    "notifications:read",
    "kpis:read",
    "operations:read",
    "dataQuality:read",
  ],
  patient: [
    "appointments:read",
    "patients:selfRead",
    "documents:selfRead",
    "requests:create",
  ],
} as const;

export function getPermissionsForRole(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function canAssignUserRole(role: Role): boolean {
  return hasPermission(role, "user.role.assign");
}

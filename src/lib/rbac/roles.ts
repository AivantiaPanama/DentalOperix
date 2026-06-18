export const ROLES = ["admin", "doctor", "assistant", "patient"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function isRoleAllowed(role: Role, allowedRoles: readonly Role[]): boolean {
  return role === "admin" || allowedRoles.includes(role);
}

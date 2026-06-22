import { isRole, type Role } from "@/lib/rbac/roles";

/**
 * 61.1-ROUTING-001 Dashboard Resolver.
 *
 * Governance boundary:
 * - Dashboard Routing is role-based navigation only.
 * - RBAC remains authorization only and is enforced by route guards.
 * - This resolver must not introduce patient management, lead ownership,
 *   doctor assignment, analytics write-back, or persistence semantics.
 */
export const DASHBOARD_ROUTES = {
  patient: "/patient",
  assistant: "/assistant",
  doctor: "/doctor",
  administrator: "/admin",
} as const satisfies Record<Role, string>;

export type DashboardRoute = (typeof DASHBOARD_ROUTES)[Role];

export type DashboardRoutingDecision =
  | {
      status: "allowed";
      role: Role;
      route: DashboardRoute;
    }
  | {
      status: "blocked";
      reason: "UNDEFINED_ROLE" | "INVALID_ROLE";
    };

export function resolveDashboardRouteForRole(role: Role): DashboardRoute {
  return DASHBOARD_ROUTES[role];
}

export function getDashboardRoutingDecision(role: unknown): DashboardRoutingDecision {
  if (role === undefined || role === null || role === "") {
    return { status: "blocked", reason: "UNDEFINED_ROLE" };
  }

  if (!isRole(role)) {
    return { status: "blocked", reason: "INVALID_ROLE" };
  }

  return {
    status: "allowed",
    role,
    route: resolveDashboardRouteForRole(role),
  };
}

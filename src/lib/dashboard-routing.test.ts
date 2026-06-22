import { describe, expect, it } from "vitest";
import { getDashboardRoutingDecision, resolveDashboardRouteForRole } from "./dashboard-routing";

// PR-4 Dashboard Routing validation package.
describe("61.1-ROUTING-001 Dashboard Resolver", () => {
  it("ROUTE-001 routes patient login to Patient Dashboard", () => {
    expect(resolveDashboardRouteForRole("patient")).toBe("/patient");
    expect(getDashboardRoutingDecision("patient")).toEqual({
      status: "allowed",
      role: "patient",
      route: "/patient",
    });
  });

  it("ROUTE-002 routes assistant login to Assistant Dashboard", () => {
    expect(resolveDashboardRouteForRole("assistant")).toBe("/assistant");
    expect(getDashboardRoutingDecision("assistant")).toEqual({
      status: "allowed",
      role: "assistant",
      route: "/assistant",
    });
  });

  it("ROUTE-003 routes doctor login to Doctor Dashboard", () => {
    expect(resolveDashboardRouteForRole("doctor")).toBe("/doctor");
    expect(getDashboardRoutingDecision("doctor")).toEqual({
      status: "allowed",
      role: "doctor",
      route: "/doctor",
    });
  });

  it("ROUTE-004 routes administrator login to Administrator Dashboard", () => {
    expect(resolveDashboardRouteForRole("administrator")).toBe("/admin");
    expect(getDashboardRoutingDecision("administrator")).toEqual({
      status: "allowed",
      role: "administrator",
      route: "/admin",
    });
  });
});

describe("61.1-ROUTING-002 Unauthorized Dashboard Access", () => {
  it("ROUTE-005 blocks undefined roles", () => {
    expect(getDashboardRoutingDecision(undefined)).toEqual({
      status: "blocked",
      reason: "UNDEFINED_ROLE",
    });
    expect(getDashboardRoutingDecision(null)).toEqual({
      status: "blocked",
      reason: "UNDEFINED_ROLE",
    });
    expect(getDashboardRoutingDecision("")).toEqual({
      status: "blocked",
      reason: "UNDEFINED_ROLE",
    });
  });

  it("ROUTE-005 blocks invalid roles", () => {
    expect(getDashboardRoutingDecision("admin")).toEqual({
      status: "blocked",
      reason: "INVALID_ROLE",
    });
    expect(getDashboardRoutingDecision("owner")).toEqual({
      status: "blocked",
      reason: "INVALID_ROLE",
    });
  });
});

import { describe, expect, it } from "vitest";
import { canAssignUserRole, hasPermission } from "./permissions";
import { isAdministrator, isRole, isRoleAllowed } from "./roles";

describe("61.1-RBAC-001 Role Model", () => {
  it("uses administrator as the canonical administrative role", () => {
    expect(isRole("administrator")).toBe(true);
    expect(isAdministrator("administrator")).toBe(true);
    expect(isRole("admin")).toBe(false);
  });

  it("allows administrator to access all role-protected areas", () => {
    expect(isRoleAllowed("administrator", ["assistant"])).toBe(true);
    expect(isRoleAllowed("administrator", ["doctor"])).toBe(true);
    expect(isRoleAllowed("administrator", ["patient"])).toBe(true);
  });

  it("does not allow non-administrator role escalation", () => {
    expect(isRoleAllowed("assistant", ["administrator"])).toBe(false);
    expect(isRoleAllowed("doctor", ["administrator"])).toBe(false);
    expect(isRoleAllowed("patient", ["administrator"])).toBe(false);
  });
});

describe("61.1-RBAC-002 Authorization Middleware permissions", () => {
  it("allows only administrator to assign user roles", () => {
    expect(canAssignUserRole("administrator")).toBe(true);
    expect(canAssignUserRole("assistant")).toBe(false);
    expect(canAssignUserRole("doctor")).toBe(false);
    expect(canAssignUserRole("patient")).toBe(false);
  });

  it("does not expose prohibited physical delete permissions", () => {
    const permissions = [
      "lead.create",
      "leads:create",
      "lead.delete.physical",
      "user.delete.physical",
      "appointment.delete.physical",
    ];

    for (const permission of permissions) {
      expect(hasPermission("administrator", permission as never)).toBe(false);
    }
  });
});

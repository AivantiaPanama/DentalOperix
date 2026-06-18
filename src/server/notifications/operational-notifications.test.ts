import { describe, expect, it } from "vitest";
import {
  InvalidOperationalNotificationFiltersError,
  parseOperationalNotificationFilters,
} from "./operational-notifications";
import { hasPermission } from "@/lib/rbac/permissions";

describe("operational notifications", () => {
  it("parses bounded filters for internal monitoring", () => {
    const request = new Request(
      "https://dentaloperix.test/api/notifications/operational?limit=12&severity=attention",
    );

    expect(parseOperationalNotificationFilters(request)).toEqual({
      limit: 12,
      severity: "attention",
    });
  });

  it("rejects unsupported severity filters", () => {
    const request = new Request(
      "https://dentaloperix.test/api/notifications/operational?severity=clinical",
    );

    expect(() => parseOperationalNotificationFilters(request)).toThrow(
      InvalidOperationalNotificationFiltersError,
    );
  });

  it("allows only internal operational roles to read notifications", () => {
    expect(hasPermission("admin", "notifications:read")).toBe(true);
    expect(hasPermission("assistant", "notifications:read")).toBe(true);
    expect(hasPermission("doctor", "notifications:read")).toBe(false);
    expect(hasPermission("patient", "notifications:read")).toBe(false);
  });
});

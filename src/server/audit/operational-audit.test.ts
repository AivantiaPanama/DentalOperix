import { afterEach, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import {
  InvalidOperationalAuditFiltersError,
  listOperationalAuditEvents,
  parseOperationalAuditFilters,
  recordOperationalAuditEvent,
} from "./operational-audit";

const storePath = resolve(process.cwd(), ".data/operational-audit-log.json");

afterEach(async () => {
  await rm(storePath, { force: true });
});

describe("operational audit trail", () => {
  it("records administrative-operational events without clinical data", async () => {
    const event = await recordOperationalAuditEvent(
      {
        action: "patient.admin_profile.updated",
        resourceType: "patient",
        resourceId: "patient-1",
        metadata: { updatedFields: "phone,email", ignored: undefined },
      },
      { role: "administrator", email: "admin@dentaloperix.test" },
    );

    expect(event.action).toBe("patient.admin_profile.updated");
    expect(event.resourceType).toBe("patient");
    expect(event.metadata).toEqual({ updatedFields: "phone,email" });

    const events = await listOperationalAuditEvents({ limit: 10, resourceType: "patient" });
    expect(events).toHaveLength(1);
    expect(events[0].actorRole).toBe("administrator");
  });

  it("parses safe read filters with bounded limits", () => {
    const request = new Request(
      "https://dentaloperix.test/api/audit/operational?action=lead.operations.updated&resourceType=lead&limit=25",
    );

    expect(parseOperationalAuditFilters(request)).toMatchObject({
      action: "lead.operations.updated",
      resourceType: "lead",
      limit: 25,
    });
  });

  it("rejects unsupported audit actions", () => {
    const request = new Request(
      "https://dentaloperix.test/api/audit/operational?action=clinical.note.updated",
    );

    expect(() => parseOperationalAuditFilters(request)).toThrow(
      InvalidOperationalAuditFiltersError,
    );
  });
});

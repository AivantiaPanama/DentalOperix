import { describe, expect, it } from "vitest";
import { LeadPersistenceNotConfiguredError } from "./lead-persistence-port";
import { getLeadPersistenceAdapter } from "./lead-persistence-provider";

describe("lead persistence provider", () => {
  it("keeps Google Sheet as the default active Leads persistence", () => {
    const adapter = getLeadPersistenceAdapter("google-sheet");

    expect(adapter.mode).toBe("google-sheet");
    expect(adapter.getHealth()).toMatchObject({
      active: true,
      writable: true,
      sourceOfTruth: "Leads",
      physicalPersistence: "Google Sheet",
    });
  });

  it("keeps the relational adapter present but inactive", async () => {
    const adapter = getLeadPersistenceAdapter("relational-db");

    expect(adapter.mode).toBe("relational-db");
    expect(adapter.getHealth()).toMatchObject({
      active: false,
      writable: false,
      sourceOfTruth: "Leads",
      physicalPersistence: "Relational Database",
    });
    await expect(adapter.listLeads()).rejects.toBeInstanceOf(LeadPersistenceNotConfiguredError);
  });
});

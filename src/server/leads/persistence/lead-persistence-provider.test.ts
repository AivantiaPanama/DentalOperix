import { afterEach, describe, expect, it } from "vitest";
import { LeadPersistenceNotConfiguredError } from "./lead-persistence-port";
import { getLeadPersistenceAdapter } from "./lead-persistence-provider";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

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

  it("keeps the relational adapter present but inactive unless 57.8 cutover flags are enabled", async () => {
    process.env.LEADS_PERSISTENCE_MODE = "relational-db";
    process.env.RELATIONAL_CUTOVER_APPROVED = "false";
    process.env.RELATIONAL_RUNTIME_ACTIVATION_APPROVED = "false";

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

  it("reports relational persistence active only when all 57.8 runtime flags are explicit", () => {
    process.env.LEADS_PERSISTENCE_MODE = "relational-db";
    process.env.RELATIONAL_CUTOVER_APPROVED = "true";
    process.env.RELATIONAL_RUNTIME_ACTIVATION_APPROVED = "true";

    const adapter = getLeadPersistenceAdapter("relational-db");

    expect(adapter.getHealth()).toMatchObject({
      active: true,
      writable: true,
      sourceOfTruth: "Leads",
      physicalPersistence: "Relational Database",
    });
  });
});

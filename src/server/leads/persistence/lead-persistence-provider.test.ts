import { afterEach, describe, expect, it } from "vitest";
import { LeadPersistenceNotConfiguredError } from "./lead-persistence-port";
import {
  getActiveLeadPersistenceAdapter,
  getLeadPersistenceAdapter,
} from "./lead-persistence-provider";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("lead persistence provider", () => {
  it("uses relational-db as the default active Leads persistence after certified cutover", () => {
    delete process.env.LEADS_PERSISTENCE_MODE;

    const adapter = getActiveLeadPersistenceAdapter();

    expect(adapter.mode).toBe("relational-db");
    expect(adapter.getHealth()).toMatchObject({
      sourceOfTruth: "Leads",
      physicalPersistence: "Relational Database",
    });
  });

  it("keeps Google Sheet restricted unless explicit rollback is approved", async () => {
    process.env.LEADS_PERSISTENCE_MODE = "google-sheet";
    delete process.env.GOOGLE_SHEETS_ROLLBACK_APPROVED;

    const configuredAdapter = getLeadPersistenceAdapter("google-sheet");
    const activeAdapter = getActiveLeadPersistenceAdapter();

    expect(configuredAdapter.getHealth()).toMatchObject({
      active: false,
      writable: false,
      sourceOfTruth: "Leads",
      physicalPersistence: "Google Sheet",
    });
    expect(activeAdapter.mode).toBe("relational-db");
    await expect(configuredAdapter.listLeads()).rejects.toThrow(/rollback mode/);
  });

  it("allows Google Sheet only as explicitly approved rollback", () => {
    process.env.LEADS_PERSISTENCE_MODE = "google-sheet";
    process.env.GOOGLE_SHEETS_ROLLBACK_APPROVED = "true";

    const adapter = getActiveLeadPersistenceAdapter();

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

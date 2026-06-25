import { describe, expect, it } from "vitest";
import type { PatientPersistenceQueryClient } from "./relational-patient-persistence-adapter";
import {
  PatientPersistenceNotFoundError,
  RelationalPatientPersistenceAdapter,
  RELATIONAL_PATIENT_PERSISTENCE_ADAPTER_VERSION,
} from "./relational-patient-persistence-adapter";
import { RELATIONAL_PATIENT_PERSISTENCE_MAPPER_VERSION, mapRelationalPatientGraphToDomain } from "./patient-persistence-mappers";

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: "patient_rel_1",
    display_name: "Ana Rivera",
    first_name: null,
    last_name: null,
    second_last_name: null,
    normalized_name: "ana rivera",
    status: "active",
    source: "admin",
    linked_lead_id: null,
    linked_appointment_id: null,
    requires_invoice: false,
    is_retired: false,
    has_insurance: false,
    created_by_user_id: null,
    created_by_role: null,
    created_via: "admin",
    updated_by_user_id: null,
    updated_by_role: null,
    updated_via: null,
    created_at: "2026-06-24T00:00:00.000Z",
    updated_at: "2026-06-24T00:00:00.000Z",
    ...overrides,
  };
}

function createPatientGraphClient(patientRow = row()): PatientPersistenceQueryClient & { calls: Array<{ text: string; values?: unknown[] }> } {
  const calls: Array<{ text: string; values?: unknown[] }> = [];
  return {
    calls,
    async query<T>(text: string, values?: unknown[]) {
      calls.push({ text, values });
      if (text.startsWith("SELECT") && text.includes(" FROM patients ")) return { rows: [patientRow] as T[], rowCount: 1 };
      if (text.includes("FROM patient_phones")) return { rows: [{ id: "phone_1", patient_id: patientRow.id, phone: "(555) 000-1111", normalized_phone: "5550001111", label: null, is_primary: true, status: "active", created_at: patientRow.created_at, updated_at: patientRow.updated_at }] as T[], rowCount: 1 };
      if (text.includes("FROM patient_emails")) return { rows: [{ id: "email_1", patient_id: patientRow.id, email: "ana@example.com", normalized_email: "ana@example.com", label: null, is_primary: true, status: "active", created_at: patientRow.created_at, updated_at: patientRow.updated_at }] as T[], rowCount: 1 };
      if (text.includes("FROM patient_addresses")) return { rows: [] as T[], rowCount: 0 };
      if (text.includes("FROM patient_identifiers")) return { rows: [] as T[], rowCount: 0 };
      if (text.startsWith("UPDATE")) return { rows: [patientRow] as T[], rowCount: 1 };
      if (text.startsWith("SELECT DISTINCT")) return { rows: [{ id: patientRow.id }] as T[], rowCount: 1 };
      return { rows: [] as T[], rowCount: null };
    },
  };
}

describe("71.5.3 Relational Patient Persistence Adapter", () => {
  it("declares certified persistence versions", () => {
    expect(RELATIONAL_PATIENT_PERSISTENCE_ADAPTER_VERSION).toBe("71.5.3-RELATIONAL-PATIENT-PERSISTENCE-ADAPTER");
    expect(RELATIONAL_PATIENT_PERSISTENCE_MAPPER_VERSION).toBe("71.5.3-PATIENT-PERSISTENCE-MAPPERS");
  });

  it("creates patients through relational tables without touching Leads or APIs", async () => {
    const calls: Array<{ text: string; values?: unknown[] }> = [];
    const client: PatientPersistenceQueryClient = {
      async query<T>(text: string, values?: unknown[]) {
        calls.push({ text, values });
        return { rows: [] as T[], rowCount: null };
      },
    };
    const adapter = new RelationalPatientPersistenceAdapter(async () => client);

    const patient = await adapter.createPatient({
      id: "patient_rel_create",
      displayName: " Ana Rivera ",
      source: "admin",
      phones: [{ phone: "(555) 000-1111" }],
      emails: [{ email: "ANA@Example.com" }],
    });

    expect(patient.id).toBe("patient_rel_create");
    expect(calls.map((call) => call.text)).toContain("BEGIN");
    expect(calls.map((call) => call.text)).toContain("COMMIT");
    expect(calls.some((call) => call.text.includes("INSERT INTO patients"))).toBe(true);
    expect(calls.some((call) => call.text.includes("INSERT INTO patient_phones"))).toBe(true);
    expect(calls.some((call) => call.text.includes("INSERT INTO patient_emails"))).toBe(true);
    expect(calls.map((call) => call.text).join("\n")).not.toContain("leads");
    expect(calls.map((call) => call.text).join("\n")).not.toContain("appointments");
  });

  it("loads a patient graph from relational rows", async () => {
    const adapter = new RelationalPatientPersistenceAdapter(async () => createPatientGraphClient());

    const patient = await adapter.findPatientById("patient_rel_1");

    expect(patient?.displayName).toBe("Ana Rivera");
    expect(patient?.phones[0]?.normalizedPhone).toBe("5550001111");
    expect(patient?.emails[0]?.normalizedEmail).toBe("ana@example.com");
  });

  it("updates patient scalar fields and throws a persistence error when missing", async () => {
    const client = createPatientGraphClient(row({ display_name: "After", normalized_name: "after" }));
    const adapter = new RelationalPatientPersistenceAdapter(async () => client);

    const updated = await adapter.updatePatient("patient_rel_1", { displayName: "After" });

    expect(updated.displayName).toBe("After");
    expect(client.calls.some((call) => call.text.startsWith("UPDATE patients SET"))).toBe(true);

    const missingAdapter = new RelationalPatientPersistenceAdapter(async () => ({
      async query<T>() {
        return { rows: [] as T[], rowCount: 0 };
      },
    }));
    await expect(missingAdapter.updatePatient("missing", { displayName: "Nope" })).rejects.toBeInstanceOf(PatientPersistenceNotFoundError);
  });

  it("searches identity candidates without automated merge", async () => {
    const client = createPatientGraphClient();
    const adapter = new RelationalPatientPersistenceAdapter(async () => client);

    const patients = await adapter.searchPatientsByIdentity({
      normalizedName: " Ana   Rivera ",
      phone: "+1 (555) 000-1111",
      excludePatientId: "patient_excluded",
    });

    expect(patients).toHaveLength(1);
    const searchCall = client.calls.find((call) => call.text.startsWith("SELECT DISTINCT"));
    expect(searchCall?.text).toContain("p.normalized_name");
    expect(searchCall?.text).toContain("ph.normalized_phone");
    expect(searchCall?.text).toContain("p.id <>");
    expect(searchCall?.values).toEqual(["ana rivera", "15550001111", "patient_excluded"]);
  });

  it("maps relational rows to the Patient domain deterministically", () => {
    const patient = mapRelationalPatientGraphToDomain({
      patient: row({ id: "patient_mapper" }) as never,
      phones: [],
      emails: [],
      addresses: [],
      identifiers: [],
    });

    expect(patient.id).toBe("patient_mapper");
    expect(patient.createdAt).toBe("2026-06-24T00:00:00.000Z");
  });
});

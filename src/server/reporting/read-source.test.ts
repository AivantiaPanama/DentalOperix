import { describe, expect, it, vi, beforeEach } from "vitest";
import { getReportingReadSource } from "./read-source";
import { listLeadOperationsProfiles } from "@/server/leads/operations-repository";
import { listPatientAdministrativeProfiles } from "@/server/patients/admin-repository";
import { readWorksheetReadModels } from "@/server/read-models/worksheet-read-models";
import { buildPatientAdministrativeProfilesFromReadModels } from "@/server/read-models/patient-read-adapter";

vi.mock("@/server/leads/operations-repository", () => ({
  listLeadOperationsProfiles: vi.fn(),
}));

vi.mock("@/server/patients/admin-repository", () => ({
  listPatientAdministrativeProfiles: vi.fn(),
}));

vi.mock("@/server/read-models/worksheet-read-models", () => ({
  readWorksheetReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/patient-read-adapter", () => ({
  buildPatientAdministrativeProfilesFromReadModels: vi.fn(),
}));

const leadOperations = [{ leadId: "lead-1" }];
const legacyPatients = [{ id: "legacy-patient" }];
const readModelPatients = [{ id: "read-model-patient" }];
const readModels = {
  patients: [{ patientId: "PAT-001" }],
  identifiers: [],
  contacts: [],
  administrativeProfiles: [],
  treatmentInterests: [],
  crmFolios: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listLeadOperationsProfiles).mockResolvedValue(leadOperations as never);
  vi.mocked(listPatientAdministrativeProfiles).mockResolvedValue(legacyPatients as never);
  vi.mocked(buildPatientAdministrativeProfilesFromReadModels).mockReturnValue(
    readModelPatients as never,
  );
});

describe("reporting read source", () => {
  it("uses read model patients when worksheet read models are available", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(readModels as never);

    const source = await getReportingReadSource();

    expect(source.mode).toBe("read-model");
    expect(source.patients).toBe(readModelPatients);
    expect(source.leadOperations).toBe(leadOperations);
    expect(source.diagnostics.usedReadModel).toBe(true);
    expect(source.diagnostics.checkedReadModelPatients).toBe(1);
    expect(listPatientAdministrativeProfiles).not.toHaveBeenCalled();
  });

  it("falls back to legacy Leads patients when read models are unavailable", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(null);

    const source = await getReportingReadSource();

    expect(source.mode).toBe("legacy-leads");
    expect(source.patients).toBe(legacyPatients);
    expect(source.leadOperations).toBe(leadOperations);
    expect(source.diagnostics.usedReadModel).toBe(false);
    expect(source.diagnostics.fallbackReason).toBe("read-model-unavailable");
  });

  it("falls back to legacy Leads patients when read model access fails", async () => {
    vi.mocked(readWorksheetReadModels).mockRejectedValue(new Error("sheet unavailable"));

    const source = await getReportingReadSource();

    expect(source.mode).toBe("legacy-leads");
    expect(source.patients).toBe(legacyPatients);
    expect(source.diagnostics.fallbackReason).toBe("read-model-error");
  });
});

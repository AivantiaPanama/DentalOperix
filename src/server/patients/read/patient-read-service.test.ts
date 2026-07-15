import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPatientReadService, PatientReadServiceNotFoundError } from "./patient-read-service";

const { getReadModelSource } = vi.hoisted(() => ({
  getReadModelSource: vi.fn(),
}));

vi.mock("@/server/read-models/read-model-source-provider", () => ({
  getReadModelSource,
}));

const patient = {
  id: "PAT-001",
  displayName: "Ana Perez",
  firstName: "Ana",
  lastName: "Perez",
  phone: "+507 6000 0000",
  email: "ana@example.com",
  birthDate: "1990-01-01",
  address: "Panama",
  emergencyContact: "Luis · +507 6000 1111",
  preferredContactMethod: "email",
  treatmentInterest: "Ortodoncia",
  preferredDate: "",
  latestStatus: "active",
  source: "read-model",
  createdAt: "2026-06-01",
  notes: "Profile",
  sourceLeadIds: ["LEAD-001"],
  missingFields: [],
  completionPercentage: 100,
  administrativeStatus: "pending-verification" as const,
  updatedAt: "2026-06-24",
};

function mockReadSource(patients = [patient]) {
  getReadModelSource.mockResolvedValue({
    mode: "read-model",
    patients,
    leadOperations: [],
    diagnostics: { usedReadModel: true },
  });
}

describe("PatientReadService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockReadSource();
  });

  it("lists immutable patient summary DTOs from the controlled read source", async () => {
    const result = await createPatientReadService().listPatients("Test Consumer");

    expect(getReadModelSource).toHaveBeenCalledWith({ consumerName: "Test Consumer" });
    expect(result).toEqual([
      {
        id: "PAT-001",
        displayName: "Ana Perez",
        phone: "+507 6000 0000",
        email: "ana@example.com",
        latestStatus: "active",
        source: "read-model",
        completionPercentage: 100,
        administrativeStatus: "pending-verification",
        updatedAt: "2026-06-24",
      },
    ]);
    expect(Object.isFrozen(result[0])).toBe(true);
  });

  it("lists administrative profile DTOs for internal patient read consumers", async () => {
    const result =
      await createPatientReadService().listAdministrativeProfiles("Administrative Consumer");

    expect(result[0]).toMatchObject({
      id: "PAT-001",
      displayName: "Ana Perez",
      missingFields: [],
      completionPercentage: 100,
    });
    expect(JSON.stringify(result)).not.toContain("sourceLeadIds");
    expect(JSON.stringify(result)).not.toContain("diagnostics");
  });

  it("returns patient detail without read-model diagnostics", async () => {
    const result = await createPatientReadService().getPatientById("PAT-001", "Detail Consumer");

    expect(result.id).toBe("PAT-001");
    expect(JSON.stringify(result)).not.toContain("diagnostics");
    expect(JSON.stringify(result)).not.toContain("resolvedIdentity");
  });

  it("throws a controlled not-found error for missing patients", async () => {
    await expect(createPatientReadService().getPatientById("PAT-404")).rejects.toBeInstanceOf(
      PatientReadServiceNotFoundError,
    );
  });

  it("searches patients without invoking write application use cases", async () => {
    const result = await createPatientReadService().searchPatients({ email: "ana@example.com" });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("PAT-001");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClinicalReadAggregate } from "@/server/read-models/clinical-read-aggregate-service";
import type { ClinicalReadAggregateDiagnostics } from "@/server/read-models/clinical-read-aggregate-service";

const getReadModelSource = vi.fn();

vi.mock("@/server/read-models/read-model-source-provider", () => ({
  getReadModelSource,
}));

const { GET } = await import("./clinical");

function createSource() {
  const clinicalAggregates: ClinicalReadAggregate[] = [
    {
      patientId: "patient-1",
      treatmentPlans: [
        {
          treatmentPlanId: "plan-1",
          patientId: "patient-1",
          planName: "Ortodoncia",
          status: "activo",
          priority: "alta",
          source: "read-model",
          isMock: false,
        },
      ],
      treatmentStages: [
        {
          treatmentStageId: "stage-1",
          treatmentPlanId: "plan-1",
          patientId: "patient-1",
          stageName: "Diagnóstico",
          status: "completado",
          completedAt: "2026-06-10",
          source: "read-model",
          isMock: false,
        },
      ],
      clinicalOutcomes: [],
    },
  ];

  const clinicalAggregateDiagnostics: ClinicalReadAggregateDiagnostics = {
    totalPatients: 1,
    totalTreatmentPlans: 1,
    totalTreatmentStages: 1,
    totalClinicalOutcomes: 0,
    patientsWithTreatmentPlans: 1,
    patientsWithTreatmentStages: 1,
    patientsWithClinicalOutcomes: 0,
    orphanTreatmentPlans: 0,
    orphanTreatmentStages: 0,
    orphanClinicalOutcomes: 0,
    incompleteTreatmentPlans: 0,
    incompleteTreatmentStages: 0,
    incompleteClinicalOutcomes: 0,
  };

  return {
    mode: "read-model",
    clinicalAggregates,
    diagnostics: { clinicalAggregateDiagnostics },
  };
}

describe("/api/analytics/clinical endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns a read-only ClinicalIntelligenceSnapshot", async () => {
    getReadModelSource.mockResolvedValue(createSource());

    const response = await GET(new Request("http://localhost/api/analytics/clinical"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.mode).toBe("read-model");
    expect(payload.snapshot.version).toBe("60.2-v1");
    expect(payload.snapshot.totals.patients).toBe(1);
    expect(payload.snapshot.governance.readOnly).toBe(true);
    expect(payload.snapshot.governance.sourceOfTruth).toBe("Leads");
    expect(getReadModelSource).toHaveBeenCalledWith({ consumerName: "Clinical Intelligence" });
  });

  it("returns a controlled 500 when clinical read source fails", async () => {
    getReadModelSource.mockRejectedValue(new Error("Read model unavailable"));

    const response = await GET(new Request("http://localhost/api/analytics/clinical"));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.success).toBe(false);
    expect(payload.error).toContain("Read model unavailable");
  });
});

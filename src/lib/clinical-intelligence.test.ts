import { describe, expect, it } from "vitest";
import {
  CLINICAL_INTELLIGENCE_VERSION,
  createClinicalIntelligenceSnapshot,
} from "./clinical-intelligence";
import type { ClinicalReadAggregateDiagnostics } from "@/server/read-models/clinical-read-aggregate-service";
import type { ClinicalReadAggregate } from "@/server/read-models/clinical-read-aggregate-service";

const generatedAt = "2026-06-19T12:00:00.000Z";

const aggregates: ClinicalReadAggregate[] = [
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
      {
        treatmentStageId: "stage-2",
        treatmentPlanId: "plan-1",
        patientId: "patient-1",
        stageName: "Alineadores",
        status: "en curso",
        source: "read-model",
        isMock: false,
      },
    ],
    clinicalOutcomes: [
      {
        clinicalOutcomeId: "outcome-1",
        treatmentPlanId: "plan-1",
        patientId: "patient-1",
        outcomeType: "avance",
        status: "registrado",
        outcomeValue: "mejora inicial",
        source: "read-model",
        isMock: false,
      },
    ],
  },
  {
    patientId: "patient-2",
    treatmentPlans: [
      {
        treatmentPlanId: "plan-2",
        patientId: "patient-2",
        planName: "Implantes",
        status: "completado",
        priority: "media",
        source: "read-model",
        isMock: false,
      },
    ],
    treatmentStages: [],
    clinicalOutcomes: [],
  },
];

const diagnostics: ClinicalReadAggregateDiagnostics = {
  totalPatients: 2,
  totalTreatmentPlans: 2,
  totalTreatmentStages: 2,
  totalClinicalOutcomes: 1,
  patientsWithTreatmentPlans: 2,
  patientsWithTreatmentStages: 1,
  patientsWithClinicalOutcomes: 1,
  orphanTreatmentPlans: 0,
  orphanTreatmentStages: 0,
  orphanClinicalOutcomes: 0,
  incompleteTreatmentPlans: 0,
  incompleteTreatmentStages: 0,
  incompleteClinicalOutcomes: 0,
};

describe("clinical intelligence", () => {
  it("creates a read-only clinical intelligence snapshot from clinical read aggregates", () => {
    const snapshot = createClinicalIntelligenceSnapshot(aggregates, diagnostics, generatedAt);

    expect(snapshot.version).toBe(CLINICAL_INTELLIGENCE_VERSION);
    expect(snapshot.generatedAt).toBe(generatedAt);
    expect(snapshot.totals.patients).toBe(2);
    expect(snapshot.totals.treatmentPlans).toBe(2);
    expect(snapshot.treatmentPlans.active).toBe(1);
    expect(snapshot.treatmentPlans.completed).toBe(1);
    expect(snapshot.treatmentPlans.withoutStages).toBe(1);
    expect(snapshot.treatmentStages.completed).toBe(1);
    expect(snapshot.treatmentStages.completionRate).toBe(50);
    expect(snapshot.outcomes.patientsWithoutOutcomes).toBe(1);
    expect(snapshot.patientCoverage.treatmentPlanCoverageRate).toBe(100);
    expect(snapshot.quality.clinicalDataQualityScore).toBe(100);
    expect(snapshot.interpretation.clinicalReadiness).toBeDefined();
    expect(snapshot.governance.readOnly).toBe(true);
    expect(snapshot.governance.sourceOfTruth).toBe("Leads");
  });

  it("handles empty clinical read aggregates without persistence assumptions", () => {
    const snapshot = createClinicalIntelligenceSnapshot([], undefined, generatedAt, "legacy-fallback");

    expect(snapshot.totals.patients).toBe(0);
    expect(snapshot.treatmentPlans.active).toBe(0);
    expect(snapshot.outcomes.outcomeCoverageRate).toBe(0);
    expect(snapshot.quality.limitations.length).toBeGreaterThanOrEqual(1);
    expect(snapshot.governance.dataSource).toBe("legacy-fallback");
    expect(snapshot.governance.limitations[0]).toContain("no escribe datos maestros");
  });
});

import type {
  ClinicalReadAggregate,
  ClinicalReadAggregateDiagnostics,
} from "@/server/read-models/clinical-read-aggregate-service";

export const CLINICAL_INTELLIGENCE_VERSION = "60.2-v1" as const;

export type ClinicalCompletionSignal = "excellent" | "healthy" | "watch" | "critical";
export type ClinicalGovernanceDataSource = "clinical-read-models" | "legacy-fallback";

export type ClinicalIntelligenceQualityReport = {
  clinicalDataQualityScore: number;
  orphanTreatmentPlans: number;
  orphanTreatmentStages: number;
  orphanClinicalOutcomes: number;
  incompleteTreatmentPlans: number;
  incompleteTreatmentStages: number;
  incompleteClinicalOutcomes: number;
  limitations: string[];
};

export type ClinicalIntelligenceSnapshot = {
  version: typeof CLINICAL_INTELLIGENCE_VERSION;
  generatedAt: string;
  totals: {
    patients: number;
    treatmentPlans: number;
    treatmentStages: number;
    clinicalOutcomes: number;
  };
  treatmentPlans: {
    active: number;
    completed: number;
    withoutStages: number;
    completionRate: number;
  };
  treatmentStages: {
    completed: number;
    completionRate: number;
  };
  outcomes: {
    recorded: number;
    patientsWithOutcomes: number;
    patientsWithoutOutcomes: number;
    outcomeCoverageRate: number;
  };
  patientCoverage: {
    patientsWithTreatmentPlans: number;
    patientsWithTreatmentStages: number;
    treatmentPlanCoverageRate: number;
    treatmentStageCoverageRate: number;
  };
  interpretation: {
    clinicalReadiness: ClinicalCompletionSignal;
    treatmentExecutionSignal: ClinicalCompletionSignal;
    outcomeCoverageSignal: ClinicalCompletionSignal;
    narrative: string;
  };
  quality: ClinicalIntelligenceQualityReport;
  governance: {
    readOnly: true;
    sourceOfTruth: "Leads";
    dataSource: ClinicalGovernanceDataSource;
    limitations: string[];
  };
};

function clamp(value: number, min = 0, max = 100) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(1));
}

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return roundPercent((part / total) * 100);
}

function normalize(value: string | undefined | null) {
  return (value ?? "").trim().toLowerCase();
}

function isCompletedStatus(status: string | undefined | null) {
  const value = normalize(status);
  return ["completado", "completada", "completed", "finalizado", "finalizada", "terminado", "terminada", "cerrado", "cerrada"].includes(value);
}

function isCancelledStatus(status: string | undefined | null) {
  const value = normalize(status);
  return ["cancelado", "cancelada", "cancelled", "canceled", "rechazado", "rechazada", "abandonado", "abandonada"].includes(value);
}

function signalFromScore(score: number): ClinicalCompletionSignal {
  if (score >= 80) return "excellent";
  if (score >= 60) return "healthy";
  if (score >= 35) return "watch";
  return "critical";
}

function countUniquePatientIds(aggregates: ClinicalReadAggregate[]) {
  return new Set(aggregates.map((aggregate) => aggregate.patientId).filter(Boolean)).size;
}

function buildDefaultDiagnostics(aggregates: ClinicalReadAggregate[]): ClinicalReadAggregateDiagnostics {
  const treatmentPlans = aggregates.flatMap((aggregate) => aggregate.treatmentPlans);
  const treatmentStages = aggregates.flatMap((aggregate) => aggregate.treatmentStages);
  const clinicalOutcomes = aggregates.flatMap((aggregate) => aggregate.clinicalOutcomes);

  return {
    totalPatients: countUniquePatientIds(aggregates),
    totalTreatmentPlans: treatmentPlans.length,
    totalTreatmentStages: treatmentStages.length,
    totalClinicalOutcomes: clinicalOutcomes.length,
    patientsWithTreatmentPlans: aggregates.filter((aggregate) => aggregate.treatmentPlans.length > 0).length,
    patientsWithTreatmentStages: aggregates.filter((aggregate) => aggregate.treatmentStages.length > 0).length,
    patientsWithClinicalOutcomes: aggregates.filter((aggregate) => aggregate.clinicalOutcomes.length > 0).length,
    orphanTreatmentPlans: 0,
    orphanTreatmentStages: 0,
    orphanClinicalOutcomes: 0,
    incompleteTreatmentPlans: treatmentPlans.filter((plan) => !plan.treatmentPlanId || !plan.planName).length,
    incompleteTreatmentStages: treatmentStages.filter((stage) => !stage.treatmentStageId || !stage.stageName).length,
    incompleteClinicalOutcomes: clinicalOutcomes.filter((outcome) => !outcome.clinicalOutcomeId || !outcome.outcomeType).length,
  };
}

function calculateQualityScore(diagnostics: ClinicalReadAggregateDiagnostics) {
  const totalRecords = Math.max(
    1,
    diagnostics.totalPatients +
      diagnostics.totalTreatmentPlans +
      diagnostics.totalTreatmentStages +
      diagnostics.totalClinicalOutcomes,
  );
  const issueCount =
    diagnostics.orphanTreatmentPlans +
    diagnostics.orphanTreatmentStages +
    diagnostics.orphanClinicalOutcomes +
    diagnostics.incompleteTreatmentPlans +
    diagnostics.incompleteTreatmentStages +
    diagnostics.incompleteClinicalOutcomes;

  return Math.round(clamp(100 - (issueCount / totalRecords) * 100));
}

function buildQualityLimitations(diagnostics: ClinicalReadAggregateDiagnostics) {
  const limitations: string[] = [];

  if (diagnostics.totalPatients === 0) {
    limitations.push("No hay pacientes disponibles en los read-models clínicos para una lectura robusta.");
  }
  if (diagnostics.totalTreatmentPlans === 0) {
    limitations.push("No hay planes de tratamiento suficientes para calcular ejecución clínica avanzada.");
  }
  if (diagnostics.totalClinicalOutcomes === 0) {
    limitations.push("No hay outcomes clínicos registrados; la lectura de resultados es preliminar.");
  }
  if (
    diagnostics.orphanTreatmentPlans + diagnostics.orphanTreatmentStages + diagnostics.orphanClinicalOutcomes > 0
  ) {
    limitations.push("Existen registros clínicos huérfanos que requieren revisión de calidad de datos.");
  }
  if (
    diagnostics.incompleteTreatmentPlans + diagnostics.incompleteTreatmentStages + diagnostics.incompleteClinicalOutcomes > 0
  ) {
    limitations.push("Existen registros clínicos incompletos que pueden afectar indicadores de cobertura.");
  }

  return limitations;
}

function buildNarrative(options: {
  patients: number;
  planCoverage: number;
  stageCompletionRate: number;
  outcomeCoverageRate: number;
}) {
  if (options.patients === 0) {
    return "Clinical Intelligence está disponible como capa read-only, pero aún no hay pacientes suficientes para una lectura clínica ejecutiva.";
  }

  return `Clinical Intelligence cubre ${options.planCoverage}% de pacientes con plan de tratamiento, ${options.stageCompletionRate}% de etapas completadas y ${options.outcomeCoverageRate}% de cobertura de outcomes.`;
}

export function createClinicalIntelligenceSnapshot(
  clinicalAggregates: ClinicalReadAggregate[],
  diagnostics?: ClinicalReadAggregateDiagnostics,
  generatedAt = new Date().toISOString(),
  dataSource: ClinicalGovernanceDataSource = "clinical-read-models",
): ClinicalIntelligenceSnapshot {
  const effectiveDiagnostics = diagnostics ?? buildDefaultDiagnostics(clinicalAggregates);
  const treatmentPlans = clinicalAggregates.flatMap((aggregate) => aggregate.treatmentPlans);
  const treatmentStages = clinicalAggregates.flatMap((aggregate) => aggregate.treatmentStages);
  const clinicalOutcomes = clinicalAggregates.flatMap((aggregate) => aggregate.clinicalOutcomes);
  const completedPlans = treatmentPlans.filter((plan) => isCompletedStatus(plan.status)).length;
  const activePlans = treatmentPlans.filter((plan) => !isCompletedStatus(plan.status) && !isCancelledStatus(plan.status)).length;
  const completedStages = treatmentStages.filter((stage) => isCompletedStatus(stage.status) || Boolean(stage.completedAt)).length;
  const plansWithStages = new Set(
    treatmentStages.map((stage) => stage.treatmentPlanId).filter(Boolean),
  );
  const plansWithoutStages = treatmentPlans.filter(
    (plan) => plan.treatmentPlanId && !plansWithStages.has(plan.treatmentPlanId),
  ).length;

  const planCoverage = percent(effectiveDiagnostics.patientsWithTreatmentPlans, effectiveDiagnostics.totalPatients);
  const stageCoverage = percent(effectiveDiagnostics.patientsWithTreatmentStages, effectiveDiagnostics.totalPatients);
  const stageCompletionRate = percent(completedStages, effectiveDiagnostics.totalTreatmentStages);
  const planCompletionRate = percent(completedPlans, effectiveDiagnostics.totalTreatmentPlans);
  const outcomeCoverageRate = percent(effectiveDiagnostics.patientsWithClinicalOutcomes, effectiveDiagnostics.totalPatients);
  const clinicalDataQualityScore = calculateQualityScore(effectiveDiagnostics);
  const qualityLimitations = buildQualityLimitations(effectiveDiagnostics);

  return {
    version: CLINICAL_INTELLIGENCE_VERSION,
    generatedAt,
    totals: {
      patients: effectiveDiagnostics.totalPatients,
      treatmentPlans: effectiveDiagnostics.totalTreatmentPlans,
      treatmentStages: effectiveDiagnostics.totalTreatmentStages,
      clinicalOutcomes: effectiveDiagnostics.totalClinicalOutcomes,
    },
    treatmentPlans: {
      active: activePlans,
      completed: completedPlans,
      withoutStages: plansWithoutStages,
      completionRate: planCompletionRate,
    },
    treatmentStages: {
      completed: completedStages,
      completionRate: stageCompletionRate,
    },
    outcomes: {
      recorded: clinicalOutcomes.length,
      patientsWithOutcomes: effectiveDiagnostics.patientsWithClinicalOutcomes,
      patientsWithoutOutcomes: Math.max(0, effectiveDiagnostics.totalPatients - effectiveDiagnostics.patientsWithClinicalOutcomes),
      outcomeCoverageRate,
    },
    patientCoverage: {
      patientsWithTreatmentPlans: effectiveDiagnostics.patientsWithTreatmentPlans,
      patientsWithTreatmentStages: effectiveDiagnostics.patientsWithTreatmentStages,
      treatmentPlanCoverageRate: planCoverage,
      treatmentStageCoverageRate: stageCoverage,
    },
    interpretation: {
      clinicalReadiness: signalFromScore((planCoverage + clinicalDataQualityScore) / 2),
      treatmentExecutionSignal: signalFromScore(stageCompletionRate),
      outcomeCoverageSignal: signalFromScore(outcomeCoverageRate),
      narrative: buildNarrative({
        patients: effectiveDiagnostics.totalPatients,
        planCoverage,
        stageCompletionRate,
        outcomeCoverageRate,
      }),
    },
    quality: {
      clinicalDataQualityScore,
      orphanTreatmentPlans: effectiveDiagnostics.orphanTreatmentPlans,
      orphanTreatmentStages: effectiveDiagnostics.orphanTreatmentStages,
      orphanClinicalOutcomes: effectiveDiagnostics.orphanClinicalOutcomes,
      incompleteTreatmentPlans: effectiveDiagnostics.incompleteTreatmentPlans,
      incompleteTreatmentStages: effectiveDiagnostics.incompleteTreatmentStages,
      incompleteClinicalOutcomes: effectiveDiagnostics.incompleteClinicalOutcomes,
      limitations: qualityLimitations,
    },
    governance: {
      readOnly: true,
      sourceOfTruth: "Leads",
      dataSource,
      limitations: [
        "Clinical Intelligence es una capa derivada/read-only y no escribe datos maestros.",
        "No reemplaza Leads como Source of Truth ni modifica la persistencia certificada 57.x.",
        "Los indicadores clínicos v1 dependen de la completitud de los read-models clínicos disponibles.",
      ],
    },
  };
}

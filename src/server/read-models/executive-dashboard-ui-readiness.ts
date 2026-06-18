import {
  EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
  assertExecutiveDashboardApiContractsAreMetricOnly,
  createExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiRoute,
} from "./executive-dashboard-api-contracts";
import { EXECUTIVE_DASHBOARD_CONTRACT_VERSION, EXECUTIVE_DASHBOARD_METRIC_CATALOG } from "./executive-dashboard-contracts";

export const EXECUTIVE_DASHBOARD_UI_READINESS_VERSION = "executive-dashboard-ui-readiness/v1";

export type ExecutiveDashboardUiCandidate = "Executive Dashboard" | "Operational Dashboard" | "Governance Dashboard";

export type ExecutiveDashboardUiReadinessStatus = "ready-for-ui-design";

export type ExecutiveDashboardUiDesignBoundary = {
  uiImplementationIncluded: false;
  routeImplementationIncluded: false;
  publicApiIncluded: false;
  persistenceIncluded: false;
  leadWriteIncluded: false;
};

export type ExecutiveDashboardUiGovernanceGuarantees = {
  contractsAvailable: true;
  permissionRequired: "executive-observability:read";
  metricOnlyResponses: true;
  rawTelemetryExposure: false;
  aggregateAccess: false;
  adapterAccess: false;
  aggregateIsolationPreserved: true;
  domainOwnershipPreserved: true;
  leadsSourceOfTruthPreserved: true;
  readModelPlatformV2ClosedFrozenPreserved: true;
};

export type ExecutiveDashboardUiAdrValidation = {
  "ADR-015": "compliant";
  "ADR-016": "compliant";
  "ADR-017": "compliant";
  "ADR-018": "compliant";
  "ADR-024": "compliant";
};

export type ExecutiveDashboardUiCandidateDefinition = {
  candidate: ExecutiveDashboardUiCandidate;
  audience: "executive" | "operational" | "governance";
  sourceRoute: ExecutiveDashboardApiRoute;
  metricFamilies: Array<keyof typeof EXECUTIVE_DASHBOARD_METRIC_CATALOG>;
  readiness: ExecutiveDashboardUiReadinessStatus;
  allowedConsumption: "executive-dashboard-api-contracts-only";
};

export type ExecutiveDashboardUiReadinessAssessment = {
  version: typeof EXECUTIVE_DASHBOARD_UI_READINESS_VERSION;
  apiContractVersion: typeof EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION;
  dashboardContractVersion: typeof EXECUTIVE_DASHBOARD_CONTRACT_VERSION;
  generatedAt: string;
  phase: "17.3-A";
  status: ExecutiveDashboardUiReadinessStatus;
  designBoundary: ExecutiveDashboardUiDesignBoundary;
  governance: ExecutiveDashboardUiGovernanceGuarantees;
  adrValidation: ExecutiveDashboardUiAdrValidation;
  dashboardCandidates: ExecutiveDashboardUiCandidateDefinition[];
  validation: {
    availableRoutes: ExecutiveDashboardApiRoute[];
    dashboardCandidateCount: 3;
    forbiddenAccessValidated: true;
    frozenReadModelPlatformValidated: true;
  };
};

const DASHBOARD_CANDIDATES: ExecutiveDashboardUiCandidateDefinition[] = [
  {
    candidate: "Executive Dashboard",
    audience: "executive",
    sourceRoute: "/api/internal/executive-observability/executive",
    metricFamilies: ["platform", "domain"],
    readiness: "ready-for-ui-design",
    allowedConsumption: "executive-dashboard-api-contracts-only",
  },
  {
    candidate: "Operational Dashboard",
    audience: "operational",
    sourceRoute: "/api/internal/executive-observability/operational",
    metricFamilies: ["aggregate"],
    readiness: "ready-for-ui-design",
    allowedConsumption: "executive-dashboard-api-contracts-only",
  },
  {
    candidate: "Governance Dashboard",
    audience: "governance",
    sourceRoute: "/api/internal/executive-observability/governance",
    metricFamilies: ["governance"],
    readiness: "ready-for-ui-design",
    allowedConsumption: "executive-dashboard-api-contracts-only",
  },
];

export function createExecutiveDashboardUiReadinessAssessment(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardUiReadinessAssessment {
  assertExecutiveDashboardApiContractsAreMetricOnly(contracts);

  return {
    version: EXECUTIVE_DASHBOARD_UI_READINESS_VERSION,
    apiContractVersion: EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
    dashboardContractVersion: EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
    generatedAt,
    phase: "17.3-A",
    status: "ready-for-ui-design",
    designBoundary: {
      uiImplementationIncluded: false,
      routeImplementationIncluded: false,
      publicApiIncluded: false,
      persistenceIncluded: false,
      leadWriteIncluded: false,
    },
    governance: {
      contractsAvailable: true,
      permissionRequired: "executive-observability:read",
      metricOnlyResponses: true,
      rawTelemetryExposure: false,
      aggregateAccess: false,
      adapterAccess: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    },
    adrValidation: {
      "ADR-015": "compliant",
      "ADR-016": "compliant",
      "ADR-017": "compliant",
      "ADR-018": "compliant",
      "ADR-024": "compliant",
    },
    dashboardCandidates: DASHBOARD_CANDIDATES,
    validation: {
      availableRoutes: contracts.endpoints.map((endpoint) => endpoint.route),
      dashboardCandidateCount: 3,
      forbiddenAccessValidated: true,
      frozenReadModelPlatformValidated: true,
    },
  };
}

export function assertExecutiveDashboardUiReadiness(assessment: ExecutiveDashboardUiReadinessAssessment): void {
  if (assessment.phase !== "17.3-A" || assessment.status !== "ready-for-ui-design") {
    throw new Error("Executive dashboard UI readiness assessment is not ready for UI design.");
  }

  if (
    assessment.designBoundary.uiImplementationIncluded ||
    assessment.designBoundary.routeImplementationIncluded ||
    assessment.designBoundary.publicApiIncluded ||
    assessment.designBoundary.persistenceIncluded ||
    assessment.designBoundary.leadWriteIncluded
  ) {
    throw new Error("17.3-A must not include UI, routes, public APIs, persistence, or lead write behavior.");
  }

  if (
    !assessment.governance.contractsAvailable ||
    !assessment.governance.metricOnlyResponses ||
    assessment.governance.rawTelemetryExposure ||
    assessment.governance.aggregateAccess ||
    assessment.governance.adapterAccess ||
    !assessment.governance.aggregateIsolationPreserved ||
    !assessment.governance.domainOwnershipPreserved ||
    !assessment.governance.leadsSourceOfTruthPreserved ||
    !assessment.governance.readModelPlatformV2ClosedFrozenPreserved
  ) {
    throw new Error("Executive dashboard UI readiness governance guarantees are not satisfied.");
  }

  if (assessment.governance.permissionRequired !== "executive-observability:read") {
    throw new Error("Executive dashboard UI readiness requires executive-observability:read.");
  }

  const nonCompliantAdr = Object.entries(assessment.adrValidation).find(([, status]) => status !== "compliant");
  if (nonCompliantAdr) {
    throw new Error(`Executive dashboard UI readiness failed ADR validation: ${nonCompliantAdr[0]}`);
  }

  if (assessment.dashboardCandidates.length !== 3 || assessment.validation.dashboardCandidateCount !== 3) {
    throw new Error("Executive dashboard UI readiness requires exactly three governed dashboard candidates.");
  }

  const invalidCandidate = assessment.dashboardCandidates.find(
    (candidate) =>
      candidate.readiness !== "ready-for-ui-design" ||
      candidate.allowedConsumption !== "executive-dashboard-api-contracts-only",
  );
  if (invalidCandidate) {
    throw new Error(`Dashboard candidate is not UI-design ready: ${invalidCandidate.candidate}`);
  }
}

import {
  executiveObservabilityProvider,
  type AggregateHealthMetric,
  type DomainHealthMetric,
  type ExecutiveDashboardContract,
  type GovernanceDashboardContract,
  type GovernanceHealthMetric,
  type OperationalDashboardContract,
  type PlatformHealthMetric,
} from "./executive-observability-provider";

export const EXECUTIVE_DASHBOARD_CONTRACT_VERSION = "executive-dashboard-contracts/v1";

export type DashboardAudience = "executive" | "operational" | "governance";

export type DashboardContractEnvelope<TDashboard> = {
  version: typeof EXECUTIVE_DASHBOARD_CONTRACT_VERSION;
  audience: DashboardAudience;
  generatedAt: string;
  dashboard: TDashboard;
};

export type ExecutiveDashboardContractEnvelope = DashboardContractEnvelope<ExecutiveDashboardContract>;
export type OperationalDashboardContractEnvelope = DashboardContractEnvelope<OperationalDashboardContract>;
export type GovernanceDashboardContractEnvelope = DashboardContractEnvelope<GovernanceDashboardContract>;

export type ExecutiveDashboardContracts = {
  executive: ExecutiveDashboardContractEnvelope;
  operational: OperationalDashboardContractEnvelope;
  governance: GovernanceDashboardContractEnvelope;
};

export type ExecutiveDashboardContractProvider = {
  getExecutiveDashboard(): ExecutiveDashboardContract;
  getOperationalDashboard(): OperationalDashboardContract;
  getGovernanceDashboard(): GovernanceDashboardContract;
};

export type ExecutiveDashboardMetricCatalog = {
  platform: Array<keyof PlatformHealthMetric>;
  domain: Array<keyof DomainHealthMetric>;
  aggregate: Array<keyof AggregateHealthMetric>;
  governance: Array<keyof GovernanceHealthMetric>;
};

export const EXECUTIVE_DASHBOARD_METRIC_CATALOG: ExecutiveDashboardMetricCatalog = {
  platform: [
    "readSuccessRate",
    "fallbackRate",
    "errorRate",
    "domainCoverage",
    "totalReads",
    "totalFallbacks",
    "totalErrors",
  ],
  domain: ["domain", "readVolume", "fallbackVolume", "errorVolume", "adoptionScore"],
  aggregate: ["aggregate", "requestVolume", "latency", "fallbackRate", "reliability"],
  governance: ["observabilityCoverage", "fallbackCompliance", "adrCompliance", "registryCompliance"],
};

export const FORBIDDEN_EXECUTIVE_DASHBOARD_PAYLOAD_KEYS = [
  "telemetry",
  "diagnostics",
  "resolvedIdentity",
  "patients",
  "supportTickets",
  "invoices",
  "clinicalNotes",
  "readModels",
  "adapters",
] as const;

function envelope<TDashboard>(audience: DashboardAudience, dashboard: TDashboard, generatedAt: string) {
  return {
    version: EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
    audience,
    generatedAt,
    dashboard,
  };
}

export function createExecutiveDashboardContracts(
  provider: ExecutiveDashboardContractProvider = executiveObservabilityProvider,
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardContracts {
  return {
    executive: envelope("executive", provider.getExecutiveDashboard(), generatedAt),
    operational: envelope("operational", provider.getOperationalDashboard(), generatedAt),
    governance: envelope("governance", provider.getGovernanceDashboard(), generatedAt),
  };
}

export function serializeExecutiveDashboardContracts(contracts: ExecutiveDashboardContracts): string {
  return JSON.stringify(contracts);
}

export function assertExecutiveDashboardContractsAreMetricOnly(contracts: ExecutiveDashboardContracts): void {
  const serialized = serializeExecutiveDashboardContracts(contracts);
  const forbiddenKey = FORBIDDEN_EXECUTIVE_DASHBOARD_PAYLOAD_KEYS.find((key) => serialized.includes(key));

  if (forbiddenKey) {
    throw new Error(`Executive dashboard contract contains forbidden payload key: ${forbiddenKey}`);
  }
}

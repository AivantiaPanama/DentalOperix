import {
  EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
  EXECUTIVE_DASHBOARD_API_ENDPOINTS,
  assertExecutiveDashboardApiContractsAreMetricOnly,
  createExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiEndpointContract,
  type ExecutiveDashboardApiRoute,
} from "./executive-dashboard-api-contracts";

export const EXECUTIVE_DASHBOARD_API_READINESS_VERSION = "executive-dashboard-api-readiness/v1";

export type ExecutiveDashboardApiSecurityPolicy = {
  authenticationRequired: true;
  authorizationRequired: true;
  requiredCapability: "executive-observability:read";
  internalOnly: true;
  exposesRawTelemetry: false;
  exposesFunctionalPayloads: false;
};

export type ExecutiveDashboardApiReadinessEndpoint = ExecutiveDashboardApiEndpointContract & {
  implementationStatus: "planned";
  readiness: "ready-for-implementation";
  security: ExecutiveDashboardApiSecurityPolicy;
};

export type ExecutiveDashboardApiReadinessReport = {
  version: typeof EXECUTIVE_DASHBOARD_API_READINESS_VERSION;
  apiContractVersion: typeof EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION;
  generatedAt: string;
  status: "ready-for-implementation";
  endpoints: ExecutiveDashboardApiReadinessEndpoint[];
  guarantees: {
    metricOnlyPayloads: true;
    rawTelemetryExposure: false;
    functionalPayloadExposure: false;
    aggregateAccess: false;
    adapterAccess: false;
    routeImplementationIncluded: false;
    uiImplementationIncluded: false;
  };
  validation: {
    apiContractsMetricOnly: true;
    endpointCount: number;
    allowedRoutes: ExecutiveDashboardApiRoute[];
  };
};

const DEFAULT_INTERNAL_SECURITY_POLICY: ExecutiveDashboardApiSecurityPolicy = {
  authenticationRequired: true,
  authorizationRequired: true,
  requiredCapability: "executive-observability:read",
  internalOnly: true,
  exposesRawTelemetry: false,
  exposesFunctionalPayloads: false,
};

function readinessEndpoint(endpoint: ExecutiveDashboardApiEndpointContract): ExecutiveDashboardApiReadinessEndpoint {
  return {
    ...endpoint,
    implementationStatus: "planned",
    readiness: "ready-for-implementation",
    security: DEFAULT_INTERNAL_SECURITY_POLICY,
  };
}

export function createExecutiveDashboardApiReadinessReport(
  contracts: ExecutiveDashboardApiContracts = createExecutiveDashboardApiContracts(),
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardApiReadinessReport {
  assertExecutiveDashboardApiContractsAreMetricOnly(contracts);

  return {
    version: EXECUTIVE_DASHBOARD_API_READINESS_VERSION,
    apiContractVersion: EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
    generatedAt,
    status: "ready-for-implementation",
    endpoints: EXECUTIVE_DASHBOARD_API_ENDPOINTS.map(readinessEndpoint),
    guarantees: {
      metricOnlyPayloads: true,
      rawTelemetryExposure: false,
      functionalPayloadExposure: false,
      aggregateAccess: false,
      adapterAccess: false,
      routeImplementationIncluded: false,
      uiImplementationIncluded: false,
    },
    validation: {
      apiContractsMetricOnly: true,
      endpointCount: EXECUTIVE_DASHBOARD_API_ENDPOINTS.length,
      allowedRoutes: EXECUTIVE_DASHBOARD_API_ENDPOINTS.map((endpoint) => endpoint.route),
    },
  };
}

export function assertExecutiveDashboardApiReadiness(report: ExecutiveDashboardApiReadinessReport): void {
  if (report.status !== "ready-for-implementation") {
    throw new Error("Executive dashboard API is not ready for implementation.");
  }

  if (!report.guarantees.metricOnlyPayloads || report.guarantees.rawTelemetryExposure) {
    throw new Error("Executive dashboard API readiness requires metric-only payloads and no raw telemetry exposure.");
  }

  if (report.guarantees.aggregateAccess || report.guarantees.adapterAccess) {
    throw new Error("Executive dashboard API readiness forbids aggregate or adapter access.");
  }

  if (report.guarantees.routeImplementationIncluded || report.guarantees.uiImplementationIncluded) {
    throw new Error("Executive dashboard API readiness must not include route or UI implementation.");
  }

  const insecureEndpoint = report.endpoints.find(
    (endpoint) =>
      !endpoint.security.authenticationRequired ||
      !endpoint.security.authorizationRequired ||
      !endpoint.security.internalOnly ||
      endpoint.security.exposesRawTelemetry ||
      endpoint.security.exposesFunctionalPayloads,
  );

  if (insecureEndpoint) {
    throw new Error(`Executive dashboard API endpoint is not internally secured: ${insecureEndpoint.route}`);
  }
}

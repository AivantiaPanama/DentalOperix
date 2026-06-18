import {
  EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
  FORBIDDEN_EXECUTIVE_DASHBOARD_PAYLOAD_KEYS,
  assertExecutiveDashboardContractsAreMetricOnly,
  createExecutiveDashboardContracts,
  type DashboardAudience,
  type ExecutiveDashboardContractProvider,
  type ExecutiveDashboardContracts,
} from "./executive-dashboard-contracts";

export const EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION = "executive-dashboard-api-contracts/v1";

export type ExecutiveDashboardApiRoute =
  | "/api/internal/executive-observability/executive"
  | "/api/internal/executive-observability/operational"
  | "/api/internal/executive-observability/governance"
  | "/api/internal/executive-observability/snapshot";

export type ExecutiveDashboardApiMethod = "GET";

export type ExecutiveDashboardApiEndpointContract = {
  method: ExecutiveDashboardApiMethod;
  route: ExecutiveDashboardApiRoute;
  audience: DashboardAudience | "snapshot";
  description: string;
  exposesRawTelemetry: false;
  exposesFunctionalPayloads: false;
};

export type ExecutiveDashboardApiResponse<TPayload> = {
  version: typeof EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION;
  dashboardContractVersion: typeof EXECUTIVE_DASHBOARD_CONTRACT_VERSION;
  generatedAt: string;
  payload: TPayload;
};

export type ExecutiveDashboardApiContracts = {
  endpoints: ExecutiveDashboardApiEndpointContract[];
  responses: {
    executive: ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["executive"]>;
    operational: ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["operational"]>;
    governance: ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["governance"]>;
    snapshot: ExecutiveDashboardApiResponse<ExecutiveDashboardContracts>;
  };
};

export const EXECUTIVE_DASHBOARD_API_ENDPOINTS: ExecutiveDashboardApiEndpointContract[] = [
  {
    method: "GET",
    route: "/api/internal/executive-observability/executive",
    audience: "executive",
    description: "Metric-only executive platform and domain health contract.",
    exposesRawTelemetry: false,
    exposesFunctionalPayloads: false,
  },
  {
    method: "GET",
    route: "/api/internal/executive-observability/operational",
    audience: "operational",
    description: "Metric-only aggregate and performance health contract.",
    exposesRawTelemetry: false,
    exposesFunctionalPayloads: false,
  },
  {
    method: "GET",
    route: "/api/internal/executive-observability/governance",
    audience: "governance",
    description: "Metric-only governance health contract.",
    exposesRawTelemetry: false,
    exposesFunctionalPayloads: false,
  },
  {
    method: "GET",
    route: "/api/internal/executive-observability/snapshot",
    audience: "snapshot",
    description: "Metric-only combined executive, operational, and governance dashboard contract.",
    exposesRawTelemetry: false,
    exposesFunctionalPayloads: false,
  },
];

const FORBIDDEN_EXECUTIVE_DASHBOARD_API_PAYLOAD_KEYS = [
  ...FORBIDDEN_EXECUTIVE_DASHBOARD_PAYLOAD_KEYS,
  "rawTelemetry",
  "events",
  "eventBuffer",
  "patientRecords",
  "invoiceRecords",
  "ticketRecords",
] as const;

function apiResponse<TPayload>(payload: TPayload, generatedAt: string): ExecutiveDashboardApiResponse<TPayload> {
  return {
    version: EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
    dashboardContractVersion: EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
    generatedAt,
    payload,
  };
}

export function createExecutiveDashboardApiContracts(
  provider?: ExecutiveDashboardContractProvider,
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardApiContracts {
  const dashboardContracts = createExecutiveDashboardContracts(provider, generatedAt);
  assertExecutiveDashboardContractsAreMetricOnly(dashboardContracts);

  return {
    endpoints: EXECUTIVE_DASHBOARD_API_ENDPOINTS,
    responses: {
      executive: apiResponse(dashboardContracts.executive, generatedAt),
      operational: apiResponse(dashboardContracts.operational, generatedAt),
      governance: apiResponse(dashboardContracts.governance, generatedAt),
      snapshot: apiResponse(dashboardContracts, generatedAt),
    },
  };
}

export function serializeExecutiveDashboardApiContracts(contracts: ExecutiveDashboardApiContracts): string {
  return JSON.stringify(contracts);
}

export function assertExecutiveDashboardApiContractsAreMetricOnly(contracts: ExecutiveDashboardApiContracts): void {
  const serialized = serializeExecutiveDashboardApiContracts(contracts);
  const forbiddenKey = FORBIDDEN_EXECUTIVE_DASHBOARD_API_PAYLOAD_KEYS.find((key) => serialized.includes(key));

  if (forbiddenKey) {
    throw new Error(`Executive dashboard API contract contains forbidden payload key: ${forbiddenKey}`);
  }
}

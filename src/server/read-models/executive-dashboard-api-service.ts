import {
  assertExecutiveDashboardApiContractsAreMetricOnly,
  createExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiContracts,
  type ExecutiveDashboardApiResponse,
} from "./executive-dashboard-api-contracts";
import type { ExecutiveDashboardContracts } from "./executive-dashboard-contracts";

export type ExecutiveDashboardApiAudience = "executive" | "operational" | "governance" | "snapshot";

export type ExecutiveDashboardApiPayload =
  | ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["executive"]>
  | ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["operational"]>
  | ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["governance"]>
  | ExecutiveDashboardApiResponse<ExecutiveDashboardContracts>;

export function createExecutiveDashboardApiPayload(
  audience: "executive",
  generatedAt?: string,
): ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["executive"]>;
export function createExecutiveDashboardApiPayload(
  audience: "operational",
  generatedAt?: string,
): ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["operational"]>;
export function createExecutiveDashboardApiPayload(
  audience: "governance",
  generatedAt?: string,
): ExecutiveDashboardApiResponse<ExecutiveDashboardContracts["governance"]>;
export function createExecutiveDashboardApiPayload(
  audience: "snapshot",
  generatedAt?: string,
): ExecutiveDashboardApiResponse<ExecutiveDashboardContracts>;
export function createExecutiveDashboardApiPayload(
  audience: ExecutiveDashboardApiAudience,
  generatedAt?: string,
): ExecutiveDashboardApiPayload;
export function createExecutiveDashboardApiPayload(
  audience: ExecutiveDashboardApiAudience,
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardApiPayload {
  const contracts = createExecutiveDashboardApiContracts(undefined, generatedAt);
  assertExecutiveDashboardApiContractsAreMetricOnly(contracts);

  switch (audience) {
    case "executive":
      return contracts.responses.executive;
    case "operational":
      return contracts.responses.operational;
    case "governance":
      return contracts.responses.governance;
    case "snapshot":
      return contracts.responses.snapshot;
    default: {
      const exhaustive: never = audience;
      throw new Error(`Unsupported executive dashboard API audience: ${exhaustive}`);
    }
  }
}

export function createExecutiveDashboardApiSnapshot(
  generatedAt = new Date().toISOString(),
): ExecutiveDashboardApiContracts {
  const contracts = createExecutiveDashboardApiContracts(undefined, generatedAt);
  assertExecutiveDashboardApiContractsAreMetricOnly(contracts);
  return contracts;
}

export function serializeExecutiveDashboardApiPayload(
  payload: ExecutiveDashboardApiPayload,
): string {
  return JSON.stringify(payload);
}

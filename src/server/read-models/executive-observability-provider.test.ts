import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import {
  EXECUTIVE_OBSERVABILITY_DOMAINS,
  createExecutiveObservabilityProvider,
  executiveObservabilityProvider,
  type ExecutiveDashboardContract,
  type GovernanceDashboardContract,
  type OperationalDashboardContract,
} from "./executive-observability-provider";

describe("executive observability provider", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("builds platform, domain, aggregate, and governance metrics from telemetry only", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Patient Management",
      domain: "Patient",
      aggregate: "PatientAggregateReadService",
      source: "ReadModel",
      recordCount: 4,
      durationMs: 20,
    });
    readObservabilityProvider.trackRead({
      consumerName: "CRM Reporting",
      domain: "CRM",
      aggregate: "CRMReadAggregateService",
      source: "LeadProjection",
      recordCount: 2,
      durationMs: 40,
    });
    readObservabilityProvider.trackFallback({
      consumerName: "CRM Reporting",
      domain: "CRM",
      aggregate: "CRMReadAggregateService",
      reason: "read-model-unavailable",
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "Patient Management",
      domain: "Patient",
      aggregate: "PatientAggregateReadService",
      success: true,
      recordCount: 4,
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "CRM Reporting",
      domain: "CRM",
      aggregate: "CRMReadAggregateService",
      success: false,
      recordCount: 2,
    });
    readObservabilityProvider.trackDomain({
      consumerName: "Patient Management",
      domain: "Patient",
      healthy: true,
      source: "ReadModel",
    });
    readObservabilityProvider.trackDomain({
      consumerName: "CRM Reporting",
      domain: "CRM",
      healthy: true,
      source: "LeadProjection",
    });

    const snapshot = executiveObservabilityProvider.getSnapshot();

    expect(snapshot.executive.platform).toMatchObject({
      readSuccessRate: 1,
      fallbackRate: 0.5,
      totalReads: 2,
      totalFallbacks: 1,
    });
    expect(snapshot.executive.platform.domainCoverage).toBe(0.25);

    const crm = snapshot.executive.domains.find((metric) => metric.domain === "CRM");
    expect(crm).toMatchObject({ readVolume: 1, fallbackVolume: 1, errorVolume: 0, adoptionScore: 0.5 });

    const crmAggregate = snapshot.operational.aggregates.find(
      (metric) => metric.aggregate === "CRMReadAggregateService",
    );
    expect(crmAggregate).toMatchObject({
      requestVolume: 2,
      latency: 40,
      fallbackRate: 1,
      reliability: 0,
    });

    expect(snapshot.governance.governance).toMatchObject({
      observabilityCoverage: 0.25,
      adrCompliance: 1,
      registryCompliance: 1,
    });
  });

  it("returns all registered domains even when a domain has no telemetry", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Inventory Reporting",
      domain: "Inventory",
      aggregate: "InventoryAggregateReadService",
      source: "ReadModel",
      recordCount: 3,
    });

    const domains = executiveObservabilityProvider.getDomainHealth();

    expect(domains.map((metric) => metric.domain)).toEqual(EXECUTIVE_OBSERVABILITY_DOMAINS);
    expect(domains.find((metric) => metric.domain === "Support")).toMatchObject({
      readVolume: 0,
      fallbackVolume: 0,
      errorVolume: 0,
      adoptionScore: 0,
    });
  });

  it("exposes dashboard contracts without telemetry, diagnostics, or functional domain data", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Support Reporting",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      source: "ReadModel",
      recordCount: 8,
    });

    const executiveDashboard: ExecutiveDashboardContract = executiveObservabilityProvider.getExecutiveDashboard();
    const operationalDashboard: OperationalDashboardContract = executiveObservabilityProvider.getOperationalDashboard();
    const governanceDashboard: GovernanceDashboardContract = executiveObservabilityProvider.getGovernanceDashboard();
    const serialized = JSON.stringify({ executiveDashboard, operationalDashboard, governanceDashboard });

    expect(executiveDashboard.platform.totalReads).toBe(1);
    expect(operationalDashboard.aggregates[0]).toMatchObject({ aggregate: "SupportAggregateReadService" });
    expect(governanceDashboard.governance.registryCompliance).toBe(1);
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("telemetry");
    expect(serialized).not.toContain("supportTickets");
    expect(serialized).not.toContain("patients");
  });

  it("does not require aggregates, adapters, read models, or new telemetry sinks", () => {
    const providerSource = {
      getBufferedEvents: () => [
        {
          type: "read" as const,
          consumerName: "Finance Reporting",
          domain: "Finance" as const,
          aggregate: "FinanceAggregateReadService",
          source: "ReadModel" as const,
          recordCount: 5,
          timestamp: "2026-01-01T00:00:00.000Z",
        },
      ],
    };

    const provider = createExecutiveObservabilityProvider(providerSource);

    expect(provider.getPlatformHealth()).toMatchObject({ totalReads: 1, totalFallbacks: 0 });
  });
});

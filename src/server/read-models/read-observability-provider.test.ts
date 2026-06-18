import { beforeEach, describe, expect, it, vi } from "vitest";
import { readObservabilityProvider, type ReadObservabilityEvent } from "./read-observability-provider";

describe("read observability provider", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("buffers read, fallback, aggregate, and domain telemetry events", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Patient Management",
      domain: "Patient",
      aggregate: "PatientAggregateReadService",
      source: "ReadModel",
      recordCount: 2,
    });
    readObservabilityProvider.trackFallback({
      consumerName: "Patient Management",
      domain: "Patient",
      aggregate: "ReadModelSourceProvider",
      reason: "read-model-unavailable",
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "Patient Management",
      domain: "Patient",
      aggregate: "PatientAggregateReadService",
      success: true,
      recordCount: 2,
      diagnostics: { totalPatients: 2 },
    });
    readObservabilityProvider.trackDomain({
      consumerName: "Patient Management",
      domain: "Patient",
      healthy: true,
      source: "ReadModel",
    });

    const events = readObservabilityProvider.getBufferedEvents();

    expect(events.map((event) => event.type)).toEqual(["read", "fallback", "aggregate", "domain"]);
    expect(events.every((event) => Boolean(event.timestamp))).toBe(true);
    expect(events[0]).toMatchObject({ domain: "Patient", source: "ReadModel", recordCount: 2 });
  });

  it("uses a best-effort sink that cannot fail read flows", () => {
    const sink = vi.fn((event: ReadObservabilityEvent) => {
      if (event.type === "read") {
        throw new Error("telemetry backend unavailable");
      }
    });
    readObservabilityProvider.setSink(sink);

    expect(() =>
      readObservabilityProvider.trackRead({
        consumerName: "Reporting",
        domain: "CRM",
        aggregate: "CRMReadAggregateService",
        source: "ReadModel",
        recordCount: 1,
      }),
    ).not.toThrow();

    expect(sink).toHaveBeenCalledTimes(1);
    expect(readObservabilityProvider.getBufferedEvents()).toHaveLength(1);
  });
});

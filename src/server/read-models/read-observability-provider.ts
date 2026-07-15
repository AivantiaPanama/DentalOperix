export type ReadDomainName =
  | "Patient"
  | "CRM"
  | "Billing"
  | "Clinical"
  | "Operations"
  | "Finance"
  | "Inventory"
  | "Support";

export type ReadSourceName = "ReadModel" | "LeadProjection" | "Error";

export type ReadTelemetryEvent = {
  type: "read";
  consumerName: string;
  domain: ReadDomainName;
  aggregate: string;
  source: ReadSourceName;
  recordCount: number;
  durationMs?: number;
  timestamp: string;
};

export type FallbackTelemetryEvent = {
  type: "fallback";
  consumerName: string;
  domain: ReadDomainName;
  aggregate: string;
  reason: "read-model-unavailable" | "read-model-error";
  timestamp: string;
};

export type AggregateTelemetryEvent = {
  type: "aggregate";
  consumerName: string;
  domain: ReadDomainName;
  aggregate: string;
  success: boolean;
  recordCount: number;
  diagnostics?: Record<string, unknown>;
  timestamp: string;
};

export type DomainTelemetryEvent = {
  type: "domain";
  consumerName: string;
  domain: ReadDomainName;
  healthy: boolean;
  source: ReadSourceName;
  timestamp: string;
};

export type ReadObservabilityEvent =
  | ReadTelemetryEvent
  | FallbackTelemetryEvent
  | AggregateTelemetryEvent
  | DomainTelemetryEvent;

export type ReadObservabilitySink = (event: ReadObservabilityEvent) => void | Promise<void>;

let sink: ReadObservabilitySink | undefined;
const memoryEvents: ReadObservabilityEvent[] = [];

function now() {
  return new Date().toISOString();
}

function emit(event: ReadObservabilityEvent) {
  memoryEvents.push(event);

  if (!sink) {
    return;
  }

  try {
    void Promise.resolve(sink(event)).catch(() => undefined);
  } catch {
    // Observability is best effort and must never fail a read request.
  }
}

export const readObservabilityProvider = {
  trackRead(event: Omit<ReadTelemetryEvent, "type" | "timestamp">) {
    emit({ ...event, type: "read", timestamp: now() });
  },

  trackFallback(event: Omit<FallbackTelemetryEvent, "type" | "timestamp">) {
    emit({ ...event, type: "fallback", timestamp: now() });
  },

  trackAggregate(event: Omit<AggregateTelemetryEvent, "type" | "timestamp">) {
    emit({ ...event, type: "aggregate", timestamp: now() });
  },

  trackDomain(event: Omit<DomainTelemetryEvent, "type" | "timestamp">) {
    emit({ ...event, type: "domain", timestamp: now() });
  },

  setSink(nextSink?: ReadObservabilitySink) {
    sink = nextSink;
  },

  getBufferedEvents() {
    return [...memoryEvents];
  },

  clearBufferedEvents() {
    memoryEvents.length = 0;
  },
};

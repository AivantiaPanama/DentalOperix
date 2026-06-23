import {
  readObservabilityProvider,
  type AggregateTelemetryEvent,
  type DomainTelemetryEvent,
  type FallbackTelemetryEvent,
  type ReadDomainName,
  type ReadObservabilityEvent,
  type ReadTelemetryEvent,
} from "./read-observability-provider";

export type ExecutiveDomainName = ReadDomainName;

export const EXECUTIVE_OBSERVABILITY_DOMAINS: ExecutiveDomainName[] = [
  "Patient",
  "CRM",
  "Billing",
  "Clinical",
  "Operations",
  "Finance",
  "Inventory",
  "Support",
];

export type PlatformHealthMetric = {
  readSuccessRate: number;
  fallbackRate: number;
  errorRate: number;
  domainCoverage: number;
  totalReads: number;
  totalFallbacks: number;
  totalErrors: number;
};

export type DomainHealthMetric = {
  domain: ExecutiveDomainName;
  readVolume: number;
  fallbackVolume: number;
  errorVolume: number;
  adoptionScore: number;
};

export type AggregateHealthMetric = {
  aggregate: string;
  requestVolume: number;
  latency: number;
  fallbackRate: number;
  reliability: number;
};

export type GovernanceHealthMetric = {
  observabilityCoverage: number;
  fallbackCompliance: number;
  adrCompliance: number;
  registryCompliance: number;
};

export type ExecutiveDashboardContract = {
  platform: PlatformHealthMetric;
  domains: DomainHealthMetric[];
};

export type OperationalDashboardContract = {
  aggregates: AggregateHealthMetric[];
};

export type GovernanceDashboardContract = {
  governance: GovernanceHealthMetric;
};

export type ExecutiveObservabilitySnapshot = {
  executive: ExecutiveDashboardContract;
  operational: OperationalDashboardContract;
  governance: GovernanceDashboardContract;
};

type EventSource = {
  getBufferedEvents(): ReadObservabilityEvent[];
};

function roundMetric(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(4));
}

function percent(part: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return roundMetric(part / total);
}

function isReadEvent(event: ReadObservabilityEvent): event is ReadTelemetryEvent {
  return event.type === "read";
}

function isFallbackEvent(event: ReadObservabilityEvent): event is FallbackTelemetryEvent {
  return event.type === "fallback";
}

function isAggregateEvent(event: ReadObservabilityEvent): event is AggregateTelemetryEvent {
  return event.type === "aggregate";
}

function isDomainEvent(event: ReadObservabilityEvent): event is DomainTelemetryEvent {
  return event.type === "domain";
}

function getReadEvents(events: ReadObservabilityEvent[]) {
  return events.filter(isReadEvent);
}

function getFallbackEvents(events: ReadObservabilityEvent[]) {
  return events.filter(isFallbackEvent);
}

function getAggregateEvents(events: ReadObservabilityEvent[]) {
  return events.filter(isAggregateEvent);
}

function hasAggregate(event: ReadObservabilityEvent): event is ReadTelemetryEvent | FallbackTelemetryEvent | AggregateTelemetryEvent {
  return "aggregate" in event && typeof event.aggregate === "string" && event.aggregate.length > 0;
}

function getDomainEvents(events: ReadObservabilityEvent[]) {
  return events.filter(isDomainEvent);
}

function buildPlatformHealth(events: ReadObservabilityEvent[]): PlatformHealthMetric {
  const reads = getReadEvents(events);
  const fallbacks = getFallbackEvents(events);
  const domainEvents = getDomainEvents(events);
  const totalReads = reads.length;
  const totalFallbacks = fallbacks.length;
  const readErrors = reads.filter((event) => event.source === "Error").length;
  const unhealthyDomains = domainEvents.filter((event) => !event.healthy || event.source === "Error").length;
  const totalErrors = readErrors + unhealthyDomains;
  const observedDomains = new Set(events.map((event) => event.domain));

  return {
    readSuccessRate: totalReads > 0 ? percent(totalReads - readErrors, totalReads) : 1,
    fallbackRate: percent(totalFallbacks, totalReads),
    errorRate: percent(totalErrors, totalReads + domainEvents.length),
    domainCoverage: percent(observedDomains.size, EXECUTIVE_OBSERVABILITY_DOMAINS.length),
    totalReads,
    totalFallbacks,
    totalErrors,
  };
}

function buildDomainHealth(events: ReadObservabilityEvent[]): DomainHealthMetric[] {
  const totalReadVolume = getReadEvents(events).length;

  return EXECUTIVE_OBSERVABILITY_DOMAINS.map((domain) => {
    const domainEvents = events.filter((event) => event.domain === domain);
    const readVolume = domainEvents.filter(isReadEvent).length;
    const fallbackVolume = domainEvents.filter(isFallbackEvent).length;
    const errorVolume = domainEvents.filter(
      (event) =>
        (isReadEvent(event) && event.source === "Error") ||
        (isDomainEvent(event) && (!event.healthy || event.source === "Error")),
    ).length;

    return {
      domain,
      readVolume,
      fallbackVolume,
      errorVolume,
      adoptionScore: percent(readVolume, totalReadVolume),
    };
  });
}

function buildAggregateHealth(events: ReadObservabilityEvent[]): AggregateHealthMetric[] {
  const eventsWithAggregate = events.filter(hasAggregate);
  const aggregateNames = Array.from(new Set(eventsWithAggregate.map((event) => event.aggregate))).sort();

  return aggregateNames.map((aggregate) => {
    const aggregateEvents = eventsWithAggregate.filter((event) => event.aggregate === aggregate);
    const readEvents = aggregateEvents.filter(isReadEvent);
    const fallbackEvents = aggregateEvents.filter(isFallbackEvent);
    const aggregateTelemetryEvents = aggregateEvents.filter(isAggregateEvent);
    const latencyEvents = readEvents.filter((event) => typeof event.durationMs === "number");
    const latencyTotal = latencyEvents.reduce((total, event) => total + (event.durationMs ?? 0), 0);
    const successCount = aggregateTelemetryEvents.filter((event) => event.success).length;

    return {
      aggregate,
      requestVolume: readEvents.length + aggregateTelemetryEvents.length,
      latency: latencyEvents.length > 0 ? roundMetric(latencyTotal / latencyEvents.length) : 0,
      fallbackRate: percent(fallbackEvents.length, readEvents.length),
      reliability: aggregateTelemetryEvents.length > 0 ? percent(successCount, aggregateTelemetryEvents.length) : 1,
    };
  });
}

function buildGovernanceHealth(events: ReadObservabilityEvent[]): GovernanceHealthMetric {
  const observedDomains = new Set(events.map((event) => event.domain));
  const domainsWithFallback = new Set(getFallbackEvents(events).map((event) => event.domain));

  return {
    observabilityCoverage: percent(observedDomains.size, EXECUTIVE_OBSERVABILITY_DOMAINS.length),
    fallbackCompliance: percent(
      EXECUTIVE_OBSERVABILITY_DOMAINS.filter((domain) => observedDomains.has(domain) || domainsWithFallback.has(domain)).length,
      EXECUTIVE_OBSERVABILITY_DOMAINS.length,
    ),
    adrCompliance: 1,
    registryCompliance: 1,
  };
}

export function createExecutiveObservabilityProvider(eventSource: EventSource = readObservabilityProvider) {
  function getEvents() {
    return eventSource.getBufferedEvents();
  }

  return {
    getPlatformHealth(): PlatformHealthMetric {
      return buildPlatformHealth(getEvents());
    },

    getDomainHealth(): DomainHealthMetric[] {
      return buildDomainHealth(getEvents());
    },

    getAggregateHealth(): AggregateHealthMetric[] {
      return buildAggregateHealth(getEvents());
    },

    getGovernanceHealth(): GovernanceHealthMetric {
      return buildGovernanceHealth(getEvents());
    },

    getExecutiveDashboard(): ExecutiveDashboardContract {
      const events = getEvents();
      return {
        platform: buildPlatformHealth(events),
        domains: buildDomainHealth(events),
      };
    },

    getOperationalDashboard(): OperationalDashboardContract {
      return {
        aggregates: buildAggregateHealth(getEvents()),
      };
    },

    getGovernanceDashboard(): GovernanceDashboardContract {
      return {
        governance: buildGovernanceHealth(getEvents()),
      };
    },

    getSnapshot(): ExecutiveObservabilitySnapshot {
      const events = getEvents();
      return {
        executive: {
          platform: buildPlatformHealth(events),
          domains: buildDomainHealth(events),
        },
        operational: {
          aggregates: buildAggregateHealth(events),
        },
        governance: {
          governance: buildGovernanceHealth(events),
        },
      };
    },
  };
}

export const executiveObservabilityProvider = createExecutiveObservabilityProvider();

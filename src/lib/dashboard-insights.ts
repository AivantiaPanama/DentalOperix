import type { ServiceConversionItem, ServiceTrendPoint, SourceConversionItem } from "./crm-metrics";

export const currencyFormatter = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
});

const MIN_SAMPLE_SIZE = 5;
const MIN_BASELINE = 3;

export type BestServiceInsight = {
  service: string;
  conversionRate: number;
  leads: number;
  estimatedPipelineValue?: number;
};

export type BestSourceInsight = {
  source: string;
  conversionRate: number;
  leads: number;
};

export type FastestGrowingServiceInsight = {
  service: string;
  growthPercent: number;
};

export function getBestConvertingService(
  items?: ServiceConversionItem[] | null,
): BestServiceInsight | null {
  if (!Array.isArray(items) || items.length === 0) return null;

  const samples = items.filter((item) => item.leads >= MIN_SAMPLE_SIZE);
  if (samples.length === 0) return null;

  const best = samples.reduce<ServiceConversionItem | null>((current, next) => {
    if (!current) return next;
    if (next.conversionRate > current.conversionRate) return next;
    if (next.conversionRate === current.conversionRate && next.leads > current.leads) return next;
    return current;
  }, null);

  if (!best) return null;

  return {
    service: best.service,
    conversionRate: best.conversionRate,
    leads: best.leads,
    estimatedPipelineValue: best.estimatedPipelineValue,
  };
}

export function getBestConvertingSource(
  items?: SourceConversionItem[] | null,
): BestSourceInsight | null {
  if (!Array.isArray(items) || items.length === 0) return null;

  const samples = items.filter((item) => item.leads >= MIN_SAMPLE_SIZE);
  if (samples.length === 0) return null;

  const best = samples.reduce<SourceConversionItem | null>((current, next) => {
    if (!current) return next;
    if (next.conversionRate > current.conversionRate) return next;
    if (next.conversionRate === current.conversionRate && next.leads > current.leads) return next;
    return current;
  }, null);

  if (!best) return null;

  return {
    source: best.source,
    conversionRate: best.conversionRate,
    leads: best.leads,
  };
}

export function getHighestValueService(
  items?: ServiceConversionItem[] | null,
): BestServiceInsight | null {
  if (!Array.isArray(items) || items.length === 0) return null;

  const best = items.reduce<ServiceConversionItem | null>((current, next) => {
    if (!current) return next;
    if ((next.estimatedPipelineValue ?? 0) > (current.estimatedPipelineValue ?? 0)) return next;
    if (
      (next.estimatedPipelineValue ?? 0) === (current.estimatedPipelineValue ?? 0) &&
      next.conversionRate > current.conversionRate
    )
      return next;
    return current;
  }, null);

  if (!best) return null;

  return {
    service: best.service,
    conversionRate: best.conversionRate,
    leads: best.leads,
    estimatedPipelineValue: best.estimatedPipelineValue,
  };
}

export function getFastestGrowingService(
  data?: ServiceTrendPoint[] | null,
): FastestGrowingServiceInsight | null {
  if (!Array.isArray(data) || data.length === 0) return null;

  const pointsWithPeriod = data.filter(
    (item): item is ServiceTrendPoint & { period: string } =>
      typeof (item as unknown as { period?: unknown }).period === "string",
  );

  if (pointsWithPeriod.length >= 2) {
    const periods = Array.from(new Set(pointsWithPeriod.map((item) => item.period))).sort();
    if (periods.length >= 2) {
      const previousPeriod = periods[periods.length - 2];
      const currentPeriod = periods[periods.length - 1];
      const previousMap = new Map<string, number>();
      const currentMap = new Map<string, number>();

      pointsWithPeriod.forEach((item) => {
        if (item.period === previousPeriod) {
          previousMap.set(item.service, item.leads);
        }
        if (item.period === currentPeriod) {
          currentMap.set(item.service, item.leads);
        }
      });

      let best: FastestGrowingServiceInsight | null = null;
      const services = new Set([...previousMap.keys(), ...currentMap.keys()]);

      services.forEach((service) => {
        const previous = previousMap.get(service) ?? 0;
        const current = currentMap.get(service) ?? 0;
        if (previous < MIN_BASELINE) return;

        const growthPercent = ((current - previous) / previous) * 100;

        if (!best || growthPercent > best.growthPercent) {
          best = { service, growthPercent };
        }
      });

      return best;
    }
  }

  const grouped = new Map<string, ServiceTrendPoint[]>();
  data.forEach((item) => {
    const entries = grouped.get(item.service) ?? [];
    entries.push(item);
    grouped.set(item.service, entries);
  });

  let bestGrowth: FastestGrowingServiceInsight | null = null;

  grouped.forEach((entries, service) => {
    if (entries.length < 2) return;
    const ordered = [...entries];
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    if (first.leads < MIN_BASELINE) return;

    const growthPercent = ((last.leads - first.leads) / first.leads) * 100;

    if (!bestGrowth || growthPercent > bestGrowth.growthPercent) {
      bestGrowth = { service, growthPercent };
    }
  });

  return bestGrowth;
}

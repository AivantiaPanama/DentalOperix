import {
  commercialDemoContextAllowedSources,
  commercialDemoContextCatalog,
} from "./commercialDemoContext.catalog";
import type {
  CommercialDemoContext,
  CommercialFocusArea,
  CommercialDemoSource,
  DemoJourneyStep,
} from "./commercialDemoContext.types";
import { defaultCommercialDemoContext } from "./defaultCommercialDemoContext";

function getListParam(values: string | null) {
  if (!values) {
    return [];
  }

  return values
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function filterAllowedValues<T extends string>(values: string[], allowed: readonly T[]): T[] {
  const allowedSet = new Set(allowed);
  return values.filter((value): value is T => allowedSet.has(value as T));
}

export function parseCommercialDemoContext(params: URLSearchParams): CommercialDemoContext {
  const version = params.get("v");
  if (version !== "1.0") {
    return defaultCommercialDemoContext;
  }

  const readinessLevelParam = params.get("level");
  const readinessLevel =
    readinessLevelParam &&
    commercialDemoContextCatalog.readinessLevels.includes(
      readinessLevelParam as (typeof commercialDemoContextCatalog.readinessLevels)[number],
    )
      ? (readinessLevelParam as (typeof commercialDemoContextCatalog.readinessLevels)[number])
      : defaultCommercialDemoContext.readinessLevel;

  const focusAreas = filterAllowedValues<CommercialFocusArea>(
    getListParam(params.get("focus")),
    commercialDemoContextCatalog.focusAreas,
  );
  const recommendedJourney = filterAllowedValues<DemoJourneyStep>(
    getListParam(params.get("journey")),
    commercialDemoContextCatalog.journeys,
  );

  const sourceParam = params.get("source");
  const source =
    sourceParam && commercialDemoContextAllowedSources.includes(sourceParam as CommercialDemoSource)
      ? (sourceParam as CommercialDemoSource)
      : defaultCommercialDemoContext.source;

  return {
    version: "1.0",
    readinessLevel,
    focusAreas: focusAreas.length > 0 ? focusAreas : defaultCommercialDemoContext.focusAreas,
    recommendedJourney:
      recommendedJourney.length > 0
        ? recommendedJourney
        : defaultCommercialDemoContext.recommendedJourney,
    source,
  };
}

import type { DecisionSignal, Evidence } from "../types";

export function buildPatientContinuityEvidence(signal: DecisionSignal): Evidence[] {
  const metadata = signal.context.metadata ?? {};
  const patientName = metadata.patientName ? String(metadata.patientName) : signal.context.entityId;
  const lastRelevantActivityDate = metadata.lastRelevantActivityDate
    ? String(metadata.lastRelevantActivityDate)
    : "unknown";
  const nextAppointmentDate = metadata.nextAppointmentDate
    ? String(metadata.nextAppointmentDate)
    : "none";
  const windowDays = metadata.windowDays ? Number(metadata.windowDays) : 30;
  const daysElapsed = metadata.daysElapsed ? Number(metadata.daysElapsed) : undefined;
  const summary = daysElapsed !== undefined ? `${daysElapsed} days ago` : `beyond the configured window of ${windowDays} days`;

  return [
    {
      source: "appointments",
      field: "lastAppointmentDate",
      value: lastRelevantActivityDate,
      description: `The latest recorded operational activity for ${patientName} occurred on ${lastRelevantActivityDate} (${summary}).`,
    },
    {
      source: "appointments",
      field: "nextAppointmentDate",
      value: nextAppointmentDate,
      description: `No future appointment was found in the available continuity context for ${patientName}.`,
    },
    {
      source: "context",
      field: "contextState",
      value: signal.context.state,
      description: `The continuity context state is ${signal.context.state}.`,
    },
    {
      source: "appointments",
      field: "daysElapsed",
      value: daysElapsed ?? windowDays,
      description: `The gap since the last recorded activity exceeds the configured window of ${windowDays} days.`,
    },
  ];
}

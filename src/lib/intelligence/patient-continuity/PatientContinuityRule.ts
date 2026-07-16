import type { SignalRegistry } from "../registry";
import { buildPatientContinuityEvidence } from "./buildPatientContinuityEvidence";
import type { DecisionSignal, SignalDefinition } from "../types";
import type { PatientContinuityContext } from "../context/patient-continuity/buildPatientContinuityContext";

export const DEFAULT_PATIENT_CONTINUITY_WINDOW_DAYS = 30;

export class PatientContinuityRule {
  constructor(private readonly windowDays: number = DEFAULT_PATIENT_CONTINUITY_WINDOW_DAYS) {}

  evaluate(context: PatientContinuityContext, now = new Date()): DecisionSignal | null {
    const patientId = context.entityId;
    const isPatientContext = context.entityType === "patient";
    const activityDate = context.metadata?.lastRelevantActivityDate;
    const nextAppointmentDate = context.metadata?.nextAppointmentDate;
    const state = context.state;

    if (!patientId || !isPatientContext || state === "incomplete") {
      return null;
    }

    if (!activityDate) {
      return null;
    }

    const parsedActivityDate = new Date(activityDate);
    const diffDays = (now.getTime() - parsedActivityDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysElapsed = Math.max(0, Math.floor(diffDays));

    if (diffDays <= this.windowDays) {
      return null;
    }

    if (nextAppointmentDate) {
      const parsedNextAppointmentDate = new Date(nextAppointmentDate);
      const nextAppointmentDiffDays =
        (parsedNextAppointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (nextAppointmentDiffDays >= 0) {
        return null;
      }
    }

    const signal: DecisionSignal = {
      id: `patient-continuity-attention:${patientId}`,
      type: "patient_continuity_attention",
      priority: "medium",
      context: {
        entityType: "patient",
        entityId: patientId,
        state: context.state,
        metadata: {
          patientName: context.patientName,
          lastRelevantActivityDate: activityDate,
          nextAppointmentDate,
          windowDays: this.windowDays,
        },
      },
      evidence: buildPatientContinuityEvidence({
        id: `patient-continuity-attention:${patientId}`,
        type: "patient_continuity_attention",
        priority: "medium",
        context: {
          entityType: "patient",
          entityId: patientId,
          state: context.state,
          metadata: {
            patientName: context.patientName,
            lastRelevantActivityDate: activityDate,
            nextAppointmentDate,
            windowDays: this.windowDays,
            daysElapsed,
          },
        },
        evidence: [],
        explanation: "Patient continuity may require operational review because the latest recorded activity predates the configured attention window.",
      }),
      explanation:
        "Patient continuity may require operational review because no recent or upcoming activity is recorded in the available operational context.",
    };

    return signal;
  }

  registerWithRegistry(registry: SignalRegistry): SignalDefinition {
    const definition: SignalDefinition = {
      id: "patient-continuity-attention",
      name: "Patient Continuity Attention Signal",
      description:
        "A deterministic signal that surfaces patient continuity situations requiring human review when activity is stale and no future appointment is recorded.",
    };

    registry.register(definition);
    return definition;
  }
}

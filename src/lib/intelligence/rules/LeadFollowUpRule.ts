import type { SignalRegistry } from "../registry";
import { buildPatientFollowUpEvidence } from "../evidence/buildPatientFollowUpEvidence";
import type { DecisionSignal, SignalDefinition } from "../types";
import type { LeadIntelligenceContext } from "../context/patient-follow-up/LeadIntelligenceContext";

const FOLLOW_UP_WINDOW_DAYS = 14;

export class LeadFollowUpRule {
  evaluate(context: LeadIntelligenceContext, now = new Date()): DecisionSignal | null {
    const entityId = context.leadId ?? context.entityId;
    const eventDate = context.lastRelevantEvent ?? context.createdAt;
    if (!entityId || !eventDate) {
      return null;
    }

    const parsedDate = new Date(eventDate);
    const diffDays = (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (context.lastActivityDate) {
      const activityDate = new Date(context.lastActivityDate);
      const activityDiffDays = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
      if (activityDiffDays <= FOLLOW_UP_WINDOW_DAYS) {
        return null;
      }
    }

    if (diffDays <= FOLLOW_UP_WINDOW_DAYS) {
      return null;
    }

    const signal: DecisionSignal = {
      id: "lead-follow-up-required",
      type: "lead_follow_up",
      priority: "medium",
      context: {
        entityType: "lead",
        entityId,
        state: context.currentState ?? "pending-follow-up",
        metadata: {
          createdAt: context.createdAt,
          lastRelevantEvent: context.lastRelevantEvent,
          lastActivityDate: context.lastActivityDate,
          status: context.status,
        },
      },
      evidence: buildPatientFollowUpEvidence({
        id: "lead-follow-up-required",
        type: "lead_follow_up",
        priority: "medium",
        context: {
          entityType: "lead",
          entityId,
          state: context.currentState ?? "pending-follow-up",
          metadata: {
            createdAt: context.createdAt,
            lastRelevantEvent: context.lastRelevantEvent,
            lastActivityDate: context.lastActivityDate,
            status: context.status,
          },
        },
        evidence: [],
        explanation: "Lead requires follow-up after the relevant event window was exceeded.",
      }),
      explanation: "Lead requires follow-up because no recent activity exists.",
    };

    return signal;
  }

  registerWithRegistry(registry: SignalRegistry): SignalDefinition {
    const definition: SignalDefinition = {
      id: "lead-follow-up-required",
      name: "Lead Follow-up Signal",
      description: "A deterministic signal that surfaces leads requiring human follow-up after the follow-up window is exceeded.",
    };

    registry.register(definition);
    return definition;
  }
}

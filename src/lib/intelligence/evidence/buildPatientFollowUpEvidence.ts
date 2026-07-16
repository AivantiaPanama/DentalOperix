import type { DecisionSignal, Evidence } from "../types";

export function buildPatientFollowUpEvidence(signal: DecisionSignal): Evidence[] {
  return [
    {
      source: "lead",
      field: "leadId",
      value: signal.context.entityId,
      description: "A lead exists with a stale follow-up window and no recent activity.",
    },
    {
      source: "lead",
      field: "lastRelevantEvent",
      value: signal.context.metadata?.lastRelevantEvent ?? signal.context.metadata?.createdAt ?? signal.context.state,
      description: "The lead's leading event predates the current follow-up window.",
    },
    {
      source: "lead",
      field: "currentState",
      value: signal.context.state,
      description: "The lead remains in a follow-up state that requires human review.",
    },
  ];
}

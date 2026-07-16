import { LeadFollowUpRule } from "../rules";
import type { DecisionSignal } from "../types";

type OperationalLeadContext = {
  id?: string;
  createdAt?: string;
  lastRelevantEvent?: string;
  lastActivityDate?: string;
  currentState?: string;
  status?: string;
};

type OperationalIntelligenceSignalsInput = {
  leads?: OperationalLeadContext[];
  now?: Date;
};

export function buildOperationalIntelligenceSignals(
  input: OperationalIntelligenceSignalsInput = {},
): DecisionSignal[] {
  const rule = new LeadFollowUpRule();
  const now = input.now ?? new Date();

  return (input.leads ?? []).flatMap((lead) => {
    const eventDate = lead.lastRelevantEvent ?? lead.createdAt;
    if (!lead.id || !eventDate) {
      return [];
    }

    const signal = rule.evaluate(
      {
        leadId: lead.id,
        createdAt: lead.createdAt,
        lastRelevantEvent: eventDate,
        lastActivityDate: lead.lastActivityDate,
        currentState: lead.currentState ?? (lead.status ? "pending-follow-up" : undefined),
        status: lead.status,
      },
      now,
    );

    return signal ? [signal] : [];
  });
}

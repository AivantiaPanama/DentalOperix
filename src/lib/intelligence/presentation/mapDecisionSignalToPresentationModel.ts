import type { DecisionSignal } from "../types";
import type { IntelligencePresentationModel } from "./intelligencePresentation.types";

export function mapDecisionSignalToPresentationModel(signal: DecisionSignal): IntelligencePresentationModel {
  return {
    title: signal.type === "lead_follow_up" ? "Lead requiere seguimiento" : signal.type,
    priority: signal.priority === "medium" ? "Media" : signal.priority,
    explanation: signal.explanation,
    evidence: signal.evidence,
  };
}

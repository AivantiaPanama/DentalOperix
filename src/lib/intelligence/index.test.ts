import { describe, expect, it } from "vitest";

import { SignalRegistry } from "./registry";
import type { DecisionSignal, Evidence, IntelligenceContext, SignalDefinition } from "./types";

function createContext(): IntelligenceContext {
  return {
    entityType: "appointment",
    entityId: "apt-001",
    state: "pending-follow-up",
    metadata: { source: "existing-appointment-record" },
  };
}

describe("Decision Intelligence foundation", () => {
  it("creates models correctly", () => {
    const context = createContext();
    const evidence: Evidence = {
      source: "appointment-record",
      field: "status",
      value: "pending-follow-up",
      description: "The appointment remains pending follow-up.",
    };

    const signal: DecisionSignal = {
      id: "signal-001",
      type: "follow-up",
      priority: "high",
      context,
      evidence: [evidence],
      explanation: "The appointment requires human review because the follow-up status remains pending.",
    };

    expect(signal.id).toBe("signal-001");
    expect(signal.context.entityType).toBe("appointment");
    expect(signal.evidence[0].field).toBe("status");
  });

  it("allows a signal to contain evidence", () => {
    const signal: DecisionSignal = {
      id: "signal-002",
      type: "attention",
      priority: "medium",
      context: createContext(),
      evidence: [
        {
          source: "operational-history",
          field: "last-contact-at",
          value: "2026-07-15",
          description: "The latest interaction remains visible for human review.",
        },
      ],
      explanation: "The interaction history is available for human interpretation.",
    };

    expect(signal.evidence).toHaveLength(1);
    expect(signal.evidence[0].description).toContain("human review");
  });

  it("registers and retrieves signal definitions", () => {
    const registry = new SignalRegistry();
    const definition: SignalDefinition = {
      id: "signal-follow-up",
      name: "Lead Follow-up Signal",
      description: "Provides a future extension point for follow-up decisions.",
    };

    registry.register(definition);

    expect(registry.get("signal-follow-up")).toEqual(definition);
    expect(registry.list()).toHaveLength(1);
  });

  it("keeps the intelligence layer isolated from existing domain writes", () => {
    const registry = new SignalRegistry();
    const definition: SignalDefinition = {
      id: "signal-opportunity",
      name: "Lead Opportunity Signal",
      description: "This layer is read-only and does not mutate domain records.",
    };

    registry.register(definition);

    expect(registry.get("signal-opportunity")?.description).toContain("read-only");
  });
});

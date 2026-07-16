import { describe, expect, it } from "vitest";

import { SignalRegistry } from "./registry";
import { LeadFollowUpRule } from "./rules/LeadFollowUpRule";

function createOlderContext() {
  return {
    leadId: "lead-001",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    lastActivityDate: undefined,
    status: "nuevo",
  };
}

function createRecentContext() {
  return {
    leadId: "lead-002",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivityDate: undefined,
    status: "contactado",
  };
}

describe("LeadFollowUpRule", () => {
  it("generates a signal when the follow-up window is exceeded", () => {
    const rule = new LeadFollowUpRule();
    const signal = rule.evaluate(createOlderContext());

    expect(signal).not.toBeNull();
    expect(signal?.type).toBe("lead_follow_up");
    expect(signal?.priority).toBe("medium");
  });

  it("does not generate a signal when the follow-up window is still open", () => {
    const rule = new LeadFollowUpRule();
    const signal = rule.evaluate(createRecentContext());

    expect(signal).toBeNull();
  });

  it("includes evidence in the generated signal", () => {
    const rule = new LeadFollowUpRule();
    const signal = rule.evaluate(createOlderContext());

    expect(signal?.evidence.length).toBeGreaterThan(0);
    expect(signal?.evidence[0].description).toContain("lead");
  });

  it("registers the signal through the registry", () => {
    const rule = new LeadFollowUpRule();
    const registry = new SignalRegistry();
    const definition = rule.registerWithRegistry(registry);

    expect(registry.get(definition.id)).toEqual(definition);
  });
});

import { describe, expect, it } from "vitest";
import { buildOperationalIntelligenceSignals } from "./buildOperationalIntelligenceSignals";

describe("buildOperationalIntelligenceSignals", () => {
  it("creates a signal from stale operational lead context", () => {
    const now = new Date("2026-07-15T12:00:00.000Z");
    const staleCreatedAt = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();

    const signals = buildOperationalIntelligenceSignals({
      leads: [{ id: "lead-001", createdAt: staleCreatedAt, status: "nuevo" }],
      now,
    });

    expect(signals).toHaveLength(1);
    expect(signals[0]?.type).toBe("lead_follow_up");
    expect(signals[0]?.context.entityId).toBe("lead-001");
    expect(signals[0]?.context.state).toBe("pending-follow-up");
  });

  it("does not create a signal for fresh operational lead context", () => {
    const now = new Date("2026-07-15T12:00:00.000Z");
    const freshCreatedAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const signals = buildOperationalIntelligenceSignals({
      leads: [{ id: "lead-002", createdAt: freshCreatedAt, status: "nuevo" }],
      now,
    });

    expect(signals).toHaveLength(0);
  });
});

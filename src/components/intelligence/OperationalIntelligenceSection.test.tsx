// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OperationalIntelligenceSection } from "./OperationalIntelligenceSection";
import type { DecisionSignal } from "@/lib/intelligence/types";

const signal: DecisionSignal = {
  id: "lead-follow-up-required",
  type: "lead_follow_up",
  priority: "medium",
  context: {
    entityType: "lead",
    entityId: "lead-001",
    state: "pending-follow-up",
    metadata: {
      lastRelevantEvent: "2026-07-01",
      lastActivityDate: undefined,
    },
  },
  evidence: [
    {
      source: "lead",
      field: "leadId",
      value: "lead-001",
      description: "Identificador del lead",
    },
    {
      source: "lead",
      field: "currentState",
      value: "pending-follow-up",
      description: "Estado actual",
    },
  ],
  explanation: "Lead requiere seguimiento posterior.",
};

describe("OperationalIntelligenceSection", () => {
  it("renders a mapped signal for presentation", () => {
    render(<OperationalIntelligenceSection signals={[signal]} />);

    expect(screen.getByText("Operational Intelligence")).toBeDefined();
    expect(screen.getByText("Lead requiere seguimiento")).toBeDefined();
    expect(screen.getByText("Identificador del lead")).toBeDefined();
  });

  it("renders an empty state when no signals are provided", () => {
    render(<OperationalIntelligenceSection signals={[]} />);

    expect(screen.getByText("No existen situaciones que requieran atención.")).toBeDefined();
  });
});

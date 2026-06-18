import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GoalRiskPanel } from "./GoalRiskPanel";
import { calculateGoalRisk } from "@/lib/goal-engine";
import { DEFAULT_GOAL_CONFIGURATION } from "@/lib/goal-config";

describe("GoalRiskPanel integration", () => {
  it("renders risk items from calculated goal risk", () => {
    const projection = {
      projectedLeads: 35,
      projectedAppointments: 30,
      projectedPipelineValue: 22000,
    };
    const risk = calculateGoalRisk(projection, DEFAULT_GOAL_CONFIGURATION, 38, 82);
    const html = renderToStaticMarkup(<GoalRiskPanel risk={risk} />);

    expect(html).toContain("Leads");
    expect(html).toContain("Valor potencial");
    expect(html).toContain("🔴");
  });

  it("renders zero-risk state when projection meets goals", () => {
    const projection = {
      projectedLeads: 60,
      projectedAppointments: 50,
      projectedPipelineValue: 30000,
    };
    const risk = calculateGoalRisk(projection, DEFAULT_GOAL_CONFIGURATION, 45, 90);
    const html = renderToStaticMarkup(<GoalRiskPanel risk={risk} />);

    expect(html).toContain("0 riesgos");
    expect(html).toContain("Todos los objetivos están en buen camino");
  });
});

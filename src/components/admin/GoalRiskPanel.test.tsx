import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GoalRiskPanel } from "./GoalRiskPanel";

describe("GoalRiskPanel", () => {
  it("renders a no-risk banner when all goals are healthy", () => {
    const html = renderToStaticMarkup(
      <GoalRiskPanel
        risk={{ leads: false, conversion: false, attendance: false, pipelineValue: false }}
      />,
    );

    expect(html).toContain("0 riesgos");
    expect(html).toContain("Todos los objetivos están en buen camino");
    expect(html).not.toContain("🔴");
  });

  it("renders explicit risk items when goals are at risk", () => {
    const html = renderToStaticMarkup(
      <GoalRiskPanel
        risk={{ leads: true, conversion: false, attendance: true, pipelineValue: false }}
      />,
    );

    expect(html).toContain("2 riesgos");
    expect(html).toContain("Leads");
    expect(html).toContain("Asistencia");
    expect(html).toContain("La proyección de leads no alcanza la meta mensual");
    expect(html).toContain("La asistencia está por debajo del objetivo");
  });
});

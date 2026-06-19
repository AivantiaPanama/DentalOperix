import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardPage, shouldShowDashboardEmptyCRM } from "./dashboard";

vi.mock("@/components/site/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Admin dashboard", () => {
  it("renders the admin dashboard page shell with initial loading state", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Admin CRM");
    expect(html).toContain("Dashboard de métricas");
    expect(html).toContain("Cargando métricas de Revenue Intelligence...");
  });

  it("renders the goal settings action button", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Configurar Metas");
  });

  it("does not show the empty CRM state when metrics contain leads", () => {
    const metrics = {
      emptyCRM: true,
      totals: { leads: 18, agendadas: 14, completadas: 0, canceladas: 0, noAsistio: 0 },
    } as any;

    expect(shouldShowDashboardEmptyCRM(metrics, false)).toBe(false);
  });

  it("shows the empty CRM state only after loading and with no leads", () => {
    const metrics = {
      emptyCRM: true,
      totals: { leads: 0, agendadas: 0, completadas: 0, canceladas: 0, noAsistio: 0 },
    } as any;

    expect(shouldShowDashboardEmptyCRM(metrics, true)).toBe(false);
    expect(shouldShowDashboardEmptyCRM(metrics, false)).toBe(true);
  });

});

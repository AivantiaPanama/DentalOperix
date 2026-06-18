import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardPage } from "./dashboard";

vi.mock("@/components/site/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Admin dashboard", () => {
  it("renders the admin dashboard page shell with initial loading state", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Admin CRM");
    expect(html).toContain("Dashboard de métricas");
    expect(html).toContain("Cargando métricas del CRM...");
  });

  it("renders the goal settings action button", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Configurar Metas");
  });
});

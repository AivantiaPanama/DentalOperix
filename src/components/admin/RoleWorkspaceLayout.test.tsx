import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

import { RoleWorkspaceLayout } from "./RoleWorkspaceLayout";

describe("61.2 PR-01 role workspace navigation", () => {
  it("does not expose Patient Management navigation in the assistant shell", () => {
    const html = renderToStaticMarkup(
      <RoleWorkspaceLayout role="assistant" title="Asistente">
        <div>Front Desk Workspace</div>
      </RoleWorkspaceLayout>,
    );

    expect(html).toContain("Agenda diaria");
    expect(html).toContain("Confirmaciones");
    expect(html).toContain("Check-in / Check-out");
    expect(html).not.toContain("Pacientes");
  });
});

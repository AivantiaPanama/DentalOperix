import { describe, expect, it } from "vitest";
import { getPortalAccessAction } from "../routes/portal/$profile";

describe("portal assistant access", () => {
  it("routes assistants to the contextual admin login flow", () => {
    const action = getPortalAccessAction({
      id: "assistant",
      publicSlug: "assistant",
      title: "Asistente",
      audience: "Equipo clínico",
      description: "Acceso al workspace operativo",
      visibleNotes: [],
    } as any);

    expect(action.actionHref).toBe("/admin/login?role=assistant");
    expect(action.actionLabel).toBe("Ingresar al Workspace");
  });
});

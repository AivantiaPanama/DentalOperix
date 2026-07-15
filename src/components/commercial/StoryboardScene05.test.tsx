// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene05 } from "./StoryboardScene05";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

const presentation: CommercialPresentationModel = {
  header: {
    eyebrow: "Demo comercial",
    title: "Operación en evolución",
    description: "Escena de transformación",
    badges: ["Narrativa", "Storyboard"],
  },
  steps: [],
  journey: {
    title: "Recorrido",
    description: "Descripción",
    rationale: "Rationale",
  },
  evidence: {
    title: "Evidencia",
    description: "Descripción",
    beforeMessage: "Antes",
    items: [],
  },
  closingMessage: "Cierre",
};

describe("StoryboardScene05", () => {
  it("renders the knowledge-oriented transformation narrative", () => {
    render(<StoryboardScene05 presentation={presentation} />);

    expect(
      screen.getByText("S05 · La clínica comienza a ver conocimiento, no solo procesos"),
    ).toBeTruthy();
    expect(screen.getByText(/Ahora entiendo mejor lo que está ocurriendo/i)).toBeTruthy();
    expect(screen.getByText(/Qué ocurrió/i)).toBeTruthy();
  });
});

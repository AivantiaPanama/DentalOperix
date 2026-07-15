// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene09 } from "./StoryboardScene09";
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

describe("StoryboardScene09", () => {
  it("renders the organizational evolution narrative", () => {
    render(<StoryboardScene09 presentation={presentation} />);

    expect(
      screen.getByText("S09 · La clínica se convierte en una organización que evoluciona"),
    ).toBeTruthy();
    expect(
      screen.getByText(/Ahora nuestra capacidad para mejorar forma parte de la organización/i),
    ).toBeTruthy();
    expect(screen.getAllByText(/Mejora continua/i).length).toBeGreaterThan(0);
  });
});

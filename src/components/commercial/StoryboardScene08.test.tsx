// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene08 } from "./StoryboardScene08";
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

describe("StoryboardScene08", () => {
  it("renders the institutional memory narrative", () => {
    render(<StoryboardScene08 presentation={presentation} />);

    expect(screen.getByText("S08 · La clínica construye memoria institucional")).toBeTruthy();
    expect(screen.getByText(/Lo que aprendemos ya no depende de una persona/i)).toBeTruthy();
    expect(screen.getAllByText(/Memoria institucional/i).length).toBeGreaterThan(0);
  });
});

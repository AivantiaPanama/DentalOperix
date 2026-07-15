// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene07 } from "./StoryboardScene07";
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

describe("StoryboardScene07", () => {
  it("renders the evidence-backed decision narrative", () => {
    render(<StoryboardScene07 presentation={presentation} />);

    expect(screen.getByText("S07 · La clínica comienza a decidir con evidencia")).toBeTruthy();
    expect(screen.getByText(/Ahora sabemos por qué debemos actuar/i)).toBeTruthy();
    expect(screen.getByText(/Decisión prioritaria/i)).toBeTruthy();
  });
});

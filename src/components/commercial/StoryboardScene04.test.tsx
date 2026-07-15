// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene04 } from "./StoryboardScene04";
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

describe("StoryboardScene04", () => {
  it("renders the full observable transformation narrative", () => {
    render(<StoryboardScene04 presentation={presentation} />);

    expect(
      screen.getByText("S04 · La primera transformación ocurre frente a la clínica"),
    ).toBeTruthy();
    expect(screen.getByText(/Acabo de ver cómo una actividad/i)).toBeTruthy();
    expect(screen.getByText(/La asistente observa continuidad/i)).toBeTruthy();
  });
});

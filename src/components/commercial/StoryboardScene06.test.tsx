// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene06 } from "./StoryboardScene06";
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

describe("StoryboardScene06", () => {
  it("renders the organizational evolution narrative", () => {
    render(<StoryboardScene06 presentation={presentation} />);

    expect(screen.getByText("S06 · La clínica comienza a evolucionar")).toBeTruthy();
    expect(screen.getByText(/Nuestra forma de trabajar ya no es la misma/i)).toBeTruthy();
    expect(screen.getByText(/Recepción/i)).toBeTruthy();
  });
});

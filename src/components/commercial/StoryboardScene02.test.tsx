// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene02 } from "./StoryboardScene02";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

const presentation: CommercialPresentationModel = {
  header: {
    eyebrow: "Demo comercial",
    title: "Operación en evolución",
    description: "Escena de transición",
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

describe("StoryboardScene02", () => {
  it("renders the shared-context transformation message", () => {
    render(<StoryboardScene02 presentation={presentation} />);

    expect(screen.getByText("S02 · La operación comienza a conectarse")).toBeTruthy();
    expect(screen.getByText(/comparten un mismo contexto/i)).toBeTruthy();
    expect(screen.getByText(/Ahora entiendo cómo comienza el cambio/i)).toBeTruthy();
  });
});

// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryboardScene03 } from "./StoryboardScene03";
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

describe("StoryboardScene03", () => {
  it("renders the operational transformation narrative", () => {
    render(<StoryboardScene03 presentation={presentation} />);

    expect(
      screen.getByText("S03 · La clínica descubre que puede trabajar de otra manera"),
    ).toBeTruthy();
    expect(screen.getAllByText(/ahora puede trabajar de otra manera/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/La información se organiza/i).length).toBeGreaterThan(0);
  });
});

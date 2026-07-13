// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommercialDemoJourneyCard } from "./CommercialDemoJourneyCard";

describe("CommercialDemoJourneyCard", () => {
  it("renders the legacy fallback content when no custom journey is supplied", () => {
    render(<CommercialDemoJourneyCard />);

    expect(screen.getByText("Commercial Demo Journey")).toBeTruthy();
    expect(screen.getByText(/new-patient-acquisition/i)).toBeTruthy();
    expect(screen.getByText(/Paciente nuevo interesado/i)).toBeTruthy();
    expect(screen.getAllByText(/Vista read-only/i).length).toBeGreaterThan(0);
  });

  it("renders the custom presentation content when a journey is provided", () => {
    render(
      <CommercialDemoJourneyCard
        journey={{
          title: "Recorrido recomendado",
          description: "Descripción personalizada.",
          rationale: "Propósito personalizado.",
        }}
      />,
    );

    expect(screen.getByText("Recorrido recomendado")).toBeTruthy();
    expect(screen.getByText("Descripción personalizada.")).toBeTruthy();
    expect(screen.getByText("Propósito personalizado.")).toBeTruthy();
  });
});

// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommercialDemoJourneyCard } from "./CommercialDemoJourneyCard";

describe("CommercialDemoJourneyCard", () => {
  it("renders the commercial demo journey from the existing foundation data in read-only mode", () => {
    render(<CommercialDemoJourneyCard />);

    expect(screen.getByText("Commercial Demo Journey")).toBeTruthy();
    expect(screen.getByText(/new-patient-acquisition/i)).toBeTruthy();
    expect(screen.getByText(/Paciente nuevo interesado/i)).toBeTruthy();
    expect(screen.getAllByText(/Vista read-only/i).length).toBeGreaterThan(0);
  });
});

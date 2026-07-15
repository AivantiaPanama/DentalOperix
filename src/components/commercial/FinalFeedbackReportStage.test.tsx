// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { FinalFeedbackReportStage } from "./FinalFeedbackReportStage";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  };
});

describe("FinalFeedbackReportStage", () => {
  it("renders the final synthesis and evidence summary", () => {
    render(<FinalFeedbackReportStage />);

    expect(screen.getByText(/informe final/i)).toBeTruthy();
    expect(screen.getAllByText(/evidencia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/siguiente evaluación/i).length).toBeGreaterThan(0);
  });
});

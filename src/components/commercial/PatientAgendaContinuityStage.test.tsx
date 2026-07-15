// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { PatientAgendaContinuityStage } from "./PatientAgendaContinuityStage";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  };
});

describe("PatientAgendaContinuityStage", () => {
  it("renders the patient context and agenda continuity narrative", () => {
    render(<PatientAgendaContinuityStage />);

    expect(screen.getAllByText(/contexto del paciente/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/agenda diaria/i)).toBeTruthy();
    expect(screen.getAllByText(/la clínica ya entiende/i).length).toBeGreaterThan(0);
  });
});

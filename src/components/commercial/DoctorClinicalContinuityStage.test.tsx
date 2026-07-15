// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { DoctorClinicalContinuityStage } from "./DoctorClinicalContinuityStage";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  };
});

describe("DoctorClinicalContinuityStage", () => {
  it("renders the doctor continuity narrative and clinical context cue", () => {
    render(<DoctorClinicalContinuityStage />);

    expect(screen.getByText(/continuidad clínica/i)).toBeTruthy();
    expect(screen.getAllByText(/doctor/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/notas clínicas/i)).toBeTruthy();
  });
});

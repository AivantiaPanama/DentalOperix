// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { FollowUpAdministrativeContinuityStage } from "./FollowUpAdministrativeContinuityStage";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  };
});

describe("FollowUpAdministrativeContinuityStage", () => {
  it("renders the follow-up and administrative continuity narrative", () => {
    render(<FollowUpAdministrativeContinuityStage />);

    expect(screen.getByText(/continuidad administrativa/i)).toBeTruthy();
    expect(screen.getAllByText(/seguimiento/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/administración/i).length).toBeGreaterThan(0);
  });
});

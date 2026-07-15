// @vitest-environment jsdom

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AssistantReceptionStage } from "./AssistantReceptionStage";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");

  return {
    ...actual,
    Link: ({ children }: { children: ReactNode; to: string }) => (
      <button type="button">{children}</button>
    ),
  };
});

describe("AssistantReceptionStage", () => {
  it("renders the transition guidance and the existing assistant schedule widget", () => {
    render(<AssistantReceptionStage />);

    expect(screen.getByText(/continuación al espacio del asistente/i)).toBeTruthy();
    expect(screen.getByText(/abrir workspace del asistente/i)).toBeTruthy();
    expect(screen.getByText(/agenda diaria/i)).toBeTruthy();
  });
});

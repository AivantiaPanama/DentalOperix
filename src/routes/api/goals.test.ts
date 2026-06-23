import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_GOAL_CONFIGURATION, type GoalSettings } from "@/lib/goal-config";

vi.mock("@/server/google/goals", () => ({
  readGoalSettingsFromSheet: vi.fn(),
  writeGoalSettingsToSheet: vi.fn(),
}));

import { GET as getGoals } from "./goals/get";
import { POST as saveGoals } from "./goals/save";

const goalsModule = await import("@/server/google/goals");
const readGoalSettingsFromSheet = goalsModule.readGoalSettingsFromSheet as ReturnType<typeof vi.fn>;
const writeGoalSettingsToSheet = goalsModule.writeGoalSettingsToSheet as ReturnType<typeof vi.fn>;

const goalsReadRequest = new Request("http://localhost/api/goals");

const validGoals: GoalSettings = {
  monthlyLeadsGoal: 80,
  conversionGoal: 45,
  attendanceGoal: 90,
  pipelineValueGoal: 32000,
};

describe("/api/goals", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns goals from sheet", async () => {
    readGoalSettingsFromSheet.mockResolvedValue(validGoals);

    const response = await getGoals(goalsReadRequest);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ success: true, goals: validGoals });
  });

  it("returns safe default goals when sheet load fails", async () => {
    readGoalSettingsFromSheet.mockRejectedValue(new Error("sheet unavailable"));

    const response = await getGoals(goalsReadRequest);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.goals).toEqual(DEFAULT_GOAL_CONFIGURATION);
    expect(body.fallback).toBe("default-goal-configuration");
    expect(body.warning).toContain("safe defaults");
  });

  it("saves goals to sheet", async () => {
    writeGoalSettingsToSheet.mockResolvedValue(undefined);

    const request = new Request("http://localhost/api/goals/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validGoals),
    });

    const response = await saveGoals(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ success: true, goals: validGoals });
  });

  it("returns 400 for invalid goal payload", async () => {
    const request = new Request("http://localhost/api/goals/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthlyLeadsGoal: 0,
        conversionGoal: 0,
        attendanceGoal: 0,
        pipelineValueGoal: 0,
      }),
    });

    const response = await saveGoals(request);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid goal settings");
  });

  it("returns 500 when sheet save fails", async () => {
    writeGoalSettingsToSheet.mockRejectedValue(new Error("sheet unavailable"));

    const request = new Request("http://localhost/api/goals/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validGoals),
    });

    const response = await saveGoals(request);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("sheet unavailable");
  });
});

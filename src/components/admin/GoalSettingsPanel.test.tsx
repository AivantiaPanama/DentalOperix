import { describe, expect, it } from "vitest";
import { toFormState, toGoalSettings } from "./GoalSettingsPanel";
import type { GoalSettings } from "@/lib/goal-config";

describe("GoalSettingsPanel helpers", () => {
  const settings: GoalSettings = {
    monthlyLeadsGoal: 50,
    conversionGoal: 40,
    attendanceGoal: 85,
    pipelineValueGoal: 25000,
  };

  it("converts goal settings to form state and back", () => {
    const formState = toFormState(settings);

    expect(formState).toEqual({
      monthlyLeadsGoal: "50",
      conversionGoal: "40",
      attendanceGoal: "85",
      pipelineValueGoal: "25000",
    });

    expect(toGoalSettings(formState)).toEqual(settings);
  });
});

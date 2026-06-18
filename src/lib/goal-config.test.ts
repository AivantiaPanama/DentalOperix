/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  DEFAULT_GOAL_CONFIGURATION,
  getDefaultGoals,
  loadGoalSettings,
  saveGoalSettings,
  validateGoalSettings,
  type GoalSettings,
} from "./goal-config";

declare global {
  var localStorage: Storage;
  var window: { localStorage: Storage };
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

const createLocalStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
  } as Storage;
};

const createResponse = (body: unknown, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
};

describe("goal config", () => {
  beforeEach(() => {
    const storage = createLocalStorageMock();
    globalThis.localStorage = storage;
    globalThis.window = { localStorage: storage } as any;
    globalThis.fetch = vi.fn() as any;
  });

  it("exports the default goal configuration", () => {
    expect(DEFAULT_GOAL_CONFIGURATION).toEqual({
      monthlyLeadsGoal: 50,
      conversionGoal: 40,
      attendanceGoal: 85,
      pipelineValueGoal: 25000,
    });
  });

  it("returns a copied default configuration object", () => {
    const config = getDefaultGoals();
    expect(config).toEqual(DEFAULT_GOAL_CONFIGURATION);
    expect(config).not.toBe(DEFAULT_GOAL_CONFIGURATION);
  });

  it("loads default settings when localStorage is empty", async () => {
    expect(await loadGoalSettings()).toEqual(DEFAULT_GOAL_CONFIGURATION);
  });

  it("saves and loads custom goal settings from localStorage", async () => {
    const custom: GoalSettings = {
      monthlyLeadsGoal: 80,
      conversionGoal: 45,
      attendanceGoal: 90,
      pipelineValueGoal: 32000,
    };

    await saveGoalSettings(custom);
    expect(await loadGoalSettings()).toEqual(custom);
  });

  it("falls back to defaults when stored data is invalid JSON", async () => {
    window.localStorage.setItem("dentaloperix-goals", "not-json");
    expect(await loadGoalSettings()).toEqual(DEFAULT_GOAL_CONFIGURATION);
  });

  it("validates goal settings and rejects zero, negative, or NaN values", () => {
    const invalid: GoalSettings = {
      monthlyLeadsGoal: 0,
      conversionGoal: -5,
      attendanceGoal: NaN,
      pipelineValueGoal: -100,
    };

    const errors = validateGoalSettings(invalid);
    expect(errors.monthlyLeadsGoal).toBeDefined();
    expect(errors.conversionGoal).toBeDefined();
    expect(errors.attendanceGoal).toBeDefined();
    expect(errors.pipelineValueGoal).toBeDefined();
  });

  it("loads goal settings from sheet and caches them to localStorage", async () => {
    const sheetGoals: GoalSettings = {
      monthlyLeadsGoal: 80,
      conversionGoal: 45,
      attendanceGoal: 90,
      pipelineValueGoal: 32000,
    };

    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createResponse({ success: true, goals: sheetGoals }),
    );

    const settings = await loadGoalSettings();
    expect(settings).toEqual(sheetGoals);
    expect(globalThis.localStorage.getItem("dentaloperix-goals")).toContain("32000");
  });

  it("falls back to localStorage when sheet load fails", async () => {
    const localGoals: GoalSettings = {
      monthlyLeadsGoal: 70,
      conversionGoal: 42,
      attendanceGoal: 88,
      pipelineValueGoal: 28000,
    };

    globalThis.localStorage.setItem("dentaloperix-goals", JSON.stringify(localGoals));
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("sheet unavailable"),
    );

    const settings = await loadGoalSettings();
    expect(settings).toEqual(localGoals);
  });

  it("falls back to default settings when sheet and localStorage both fail", async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("sheet unavailable"),
    );
    const settings = await loadGoalSettings();

    expect(settings).toEqual(DEFAULT_GOAL_CONFIGURATION);
  });

  it("saves goal settings to sheet and localStorage", async () => {
    const settings: GoalSettings = {
      monthlyLeadsGoal: 60,
      conversionGoal: 38,
      attendanceGoal: 82,
      pipelineValueGoal: 26000,
    };

    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createResponse({ success: true, goals: settings }),
    );

    await saveGoalSettings(settings);

    expect(globalThis.localStorage.getItem("dentaloperix-goals")).toContain("26000");
    expect((globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
      "/api/goals/save",
    );
  });

  it("persists to localStorage when sheet save fails", async () => {
    const settings: GoalSettings = {
      monthlyLeadsGoal: 60,
      conversionGoal: 38,
      attendanceGoal: 82,
      pipelineValueGoal: 26000,
    };

    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("sheet unavailable"),
    );

    await saveGoalSettings(settings);

    expect(globalThis.localStorage.getItem("dentaloperix-goals")).toContain("26000");
  });
});

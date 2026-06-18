import type { BusinessGoals } from "./goal-engine";

export type GoalSettings = BusinessGoals;

export type GoalConfiguration = GoalSettings;

export const DEFAULT_GOAL_CONFIGURATION: GoalConfiguration = {
  monthlyLeadsGoal: 50,
  conversionGoal: 40,
  attendanceGoal: 85,
  pipelineValueGoal: 25000,
};

const STORAGE_KEY = "dentaloperix-goals";
const GOALS_GET_ENDPOINT = "/api/goals/get";
const GOALS_SAVE_ENDPOINT = "/api/goals/save";

export function getDefaultGoals(): GoalConfiguration {
  return { ...DEFAULT_GOAL_CONFIGURATION };
}

function loadGoalSettingsFromLocalStorage(): GoalSettings {
  if (typeof window === "undefined") {
    return getDefaultGoals();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return getDefaultGoals();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GoalSettings>;
    const parsedSettings: GoalSettings = {
      monthlyLeadsGoal: Number(
        parsed.monthlyLeadsGoal ?? DEFAULT_GOAL_CONFIGURATION.monthlyLeadsGoal,
      ),
      conversionGoal: Number(parsed.conversionGoal ?? DEFAULT_GOAL_CONFIGURATION.conversionGoal),
      attendanceGoal: Number(parsed.attendanceGoal ?? DEFAULT_GOAL_CONFIGURATION.attendanceGoal),
      pipelineValueGoal: Number(
        parsed.pipelineValueGoal ?? DEFAULT_GOAL_CONFIGURATION.pipelineValueGoal,
      ),
    };

    const validationErrors = validateGoalSettings(parsedSettings);
    return Object.keys(validationErrors).length === 0 ? parsedSettings : getDefaultGoals();
  } catch {
    return getDefaultGoals();
  }
}

function saveGoalSettingsToLocalStorage(settings: GoalSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function loadGoalSettingsFromSheet(): Promise<GoalSettings> {
  if (typeof window === "undefined") {
    return getDefaultGoals();
  }

  const response = await fetch(GOALS_GET_ENDPOINT, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Goals API responded with ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.success || !payload?.goals) {
    throw new Error(payload?.error ?? "Invalid goals response from sheet.");
  }

  return payload.goals as GoalSettings;
}

export async function saveGoalSettingsToSheet(settings: GoalSettings): Promise<void> {
  if (typeof window === "undefined") return;

  const response = await fetch(GOALS_SAVE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Goals API responded with ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.success) {
    throw new Error(payload?.error ?? "Invalid save response from sheet.");
  }
}

export async function loadGoalSettings(): Promise<GoalSettings> {
  if (typeof window === "undefined") {
    return getDefaultGoals();
  }

  try {
    const settings = await loadGoalSettingsFromSheet();
    saveGoalSettingsToLocalStorage(settings);
    return settings;
  } catch (error) {
    console.warn("Falling back to localStorage for goal settings:", error);
    return loadGoalSettingsFromLocalStorage();
  }
}

export async function saveGoalSettings(settings: GoalSettings): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await saveGoalSettingsToSheet(settings);
  } catch (error) {
    console.warn("Failed to save goals to sheet, persisting locally instead:", error);
  }

  saveGoalSettingsToLocalStorage(settings);
}

export function validateGoalSettings(
  settings: GoalSettings,
): Partial<Record<keyof GoalSettings, string>> {
  const errors: Partial<Record<keyof GoalSettings, string>> = {};

  if (!Number.isFinite(settings.monthlyLeadsGoal) || settings.monthlyLeadsGoal <= 0) {
    errors.monthlyLeadsGoal = "Ingresa una meta de leads válida mayor a 0.";
  }

  if (!Number.isFinite(settings.conversionGoal) || settings.conversionGoal <= 0) {
    errors.conversionGoal = "Ingresa un porcentaje de conversión válido mayor a 0.";
  }

  if (!Number.isFinite(settings.attendanceGoal) || settings.attendanceGoal <= 0) {
    errors.attendanceGoal = "Ingresa un porcentaje de asistencia válido mayor a 0.";
  }

  if (!Number.isFinite(settings.pipelineValueGoal) || settings.pipelineValueGoal <= 0) {
    errors.pipelineValueGoal = "Ingresa un valor de pipeline válido mayor a 0.";
  }

  return errors;
}

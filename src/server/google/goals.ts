import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";
import { DEFAULT_GOAL_CONFIGURATION, type GoalSettings } from "@/lib/goal-config";

const GOALS_SHEET_NAME = "Goals";
const GOALS_RANGE = `${GOALS_SHEET_NAME}!A:B`;

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function parseGoalSettingsRows(rows: unknown[][]): GoalSettings {
  const parsed: Partial<GoalSettings> = {};

  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 2) {
      continue;
    }

    const key = row[0]?.toString().trim();
    const value = Number(row[1]);

    if (!key || Number.isNaN(value)) {
      continue;
    }

    if (key in DEFAULT_GOAL_CONFIGURATION) {
      parsed[key as keyof GoalSettings] = value;
    }
  }

  return {
    ...DEFAULT_GOAL_CONFIGURATION,
    ...parsed,
  };
}

export async function readGoalSettingsFromSheet(): Promise<GoalSettings> {
  const config = getServerConfig();
  const sheets = getSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: GOALS_RANGE,
  });

  const rows = response.data.values ?? [];
  return parseGoalSettingsRows(rows as unknown[][]);
}

export async function writeGoalSettingsToSheet(settings: GoalSettings) {
  const config = getServerConfig();
  const sheets = getSheets();

  const values = [
    ["monthlyLeadsGoal", settings.monthlyLeadsGoal.toString()],
    ["conversionGoal", settings.conversionGoal.toString()],
    ["attendanceGoal", settings.attendanceGoal.toString()],
    ["pipelineValueGoal", settings.pipelineValueGoal.toString()],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.googleSheetId,
    range: GOALS_RANGE,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

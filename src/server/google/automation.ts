import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";

const AUTOMATION_COLUMNS = [
  "ID",
  "Timestamp",
  "Flow",
  "Dry Run",
  "Generated",
  "Sent",
  "Skipped",
  "Failed",
  "Action Count",
  "Errors",
  "Status",
  "DurationMs",
  "ExecutedBy",
] as const;

type AutomationSheetRow = Array<unknown>;

export type AutomationRunRecord = {
  id: string;
  timestamp: string;
  flow: string;
  dryRun: boolean;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
  actionCount: number;
  errors: string;
  status: "success" | "partial" | "failure";
  durationMs?: number;
  executedBy?: string;
};

export type AutomationMetrics = {
  totalRuns: number;
  dryRuns: number;
  realRuns: number;
  successfulRuns: number;
  partialRuns: number;
  failedRuns: number;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
};

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function isHeaderRow(row: AutomationSheetRow): row is string[] {
  return (
    row.length >= AUTOMATION_COLUMNS.length &&
    AUTOMATION_COLUMNS.every((column, index) => row[index]?.toString() === column)
  );
}

async function ensureAutomationSheetExists(
  sheets: ReturnType<typeof getSheets>,
  spreadsheetId: string,
  sheetName: string,
) {
  const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets.properties" });
  const existingSheet = metadata.data.sheets?.find(
    (sheet) => sheet.properties?.title === sheetName,
  );
  if (existingSheet) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1:M1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [AUTOMATION_COLUMNS as unknown as string[]],
    },
  });
}

export async function appendAutomationRunRecord(record: AutomationRunRecord) {
  const config = getServerConfig();
  const sheets = getSheets();
  await ensureAutomationSheetExists(sheets, config.googleSheetId, config.googleAutomationSheetName);
  await sheets.spreadsheets.values.append({
    spreadsheetId: config.googleSheetId,
    range: `${config.googleAutomationSheetName}!A:M`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          record.id,
          record.timestamp,
          record.flow,
          record.dryRun ? "true" : "false",
          record.generated,
          record.sent,
          record.skipped,
          record.failed,
          record.actionCount,
          record.errors,
          record.status,
          record.durationMs ?? 0,
          record.executedBy ?? "system",
        ],
      ],
    },
  });
}

export async function readAutomationRunRecords(): Promise<AutomationRunRecord[]> {
  const config = getServerConfig();
  const sheets = getSheets();
  await ensureAutomationSheetExists(sheets, config.googleSheetId, config.googleAutomationSheetName);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: `${config.googleAutomationSheetName}!A:M`,
  });

  const rows = response.data.values ?? [];
  return rows
    .filter((row) => !isHeaderRow(row))
    .map((row) => ({
      id: row[0]?.toString() ?? "",
      timestamp: row[1]?.toString() ?? "",
      flow: row[2]?.toString() ?? "",
      dryRun: row[3]?.toString() === "true",
      generated: Number(row[4] ?? 0),
      sent: Number(row[5] ?? 0),
      skipped: Number(row[6] ?? 0),
      failed: Number(row[7] ?? 0),
      actionCount: Number(row[8] ?? 0),
      errors: row[9]?.toString() ?? "",
      status: (row[10]?.toString() as AutomationRunRecord["status"]) ?? "failure",
      durationMs: Number(row[11] ?? 0),
      executedBy: row[12]?.toString() ?? "system",
    }))
    .filter((record) => record.id && record.timestamp && record.flow);
}

export function calculateAutomationMetrics(records: AutomationRunRecord[]): AutomationMetrics {
  return records.reduce(
    (metrics, record) => {
      metrics.totalRuns += 1;
      if (record.dryRun) metrics.dryRuns += 1;
      else metrics.realRuns += 1;
      if (record.status === "success") metrics.successfulRuns += 1;
      else if (record.status === "partial") metrics.partialRuns += 1;
      else metrics.failedRuns += 1;
      metrics.generated += record.generated;
      metrics.sent += record.sent;
      metrics.skipped += record.skipped;
      metrics.failed += record.failed;
      return metrics;
    },
    {
      totalRuns: 0,
      dryRuns: 0,
      realRuns: 0,
      successfulRuns: 0,
      partialRuns: 0,
      failedRuns: 0,
      generated: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
    },
  );
}

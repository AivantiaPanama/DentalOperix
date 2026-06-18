import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";

const FOLLOWUP_COLUMNS = [
  "ID",
  "Fecha",
  "Lead ID",
  "Nombre",
  "Email",
  "Teléfono",
  "Tipo",
  "Estado",
  "Mensaje",
  "Fuente",
  "Ejecutado En",
  "Error",
] as const;

type FollowupSheetRow = Array<unknown>;

export type FollowupStatus = "pending" | "sent" | "failed" | "omitted";
export type FollowupType =
  | "appointment_reminder"
  | "attendance_confirmation"
  | "cancellation_recovery"
  | "inactive_reactivation"
  | "no_show_recovery"
  | "post_appointment_followup";

export type FollowupRecord = {
  id: string;
  date: string;
  leadId: string;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  type: FollowupType;
  status: FollowupStatus;
  message: string;
  executedAt?: string;
  error?: string;
};

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function isHeaderRow(row: FollowupSheetRow): row is string[] {
  return (
    row.length >= FOLLOWUP_COLUMNS.length &&
    FOLLOWUP_COLUMNS.every((column, index) => row[index]?.toString() === column)
  );
}

async function ensureFollowupsSheetExists(
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
    range: `${sheetName}!A1:L1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [FOLLOWUP_COLUMNS as unknown as string[]],
    },
  });
}

export async function readFollowupRecords(): Promise<FollowupRecord[]> {
  const config = getServerConfig();
  const sheets = getSheets();
  const range = `${config.googleFollowupsSheetName}!A:L`;

  try {
    await ensureFollowupsSheetExists(sheets, config.googleSheetId, config.googleFollowupsSheetName);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.googleSheetId,
      range,
    });

    const rows = response.data.values ?? [];
    return rows
      .filter((row) => !isHeaderRow(row))
      .map((row) => ({
        id: row[0]?.toString() ?? "",
        date: row[1]?.toString() ?? "",
        leadId: row[2]?.toString() ?? "",
        name: row[3]?.toString() ?? "",
        email: row[4]?.toString() ?? "",
        phone: row[5]?.toString() || undefined,
        type: (row[6]?.toString() ?? "appointment_reminder") as FollowupType,
        status: (row[7]?.toString() ?? "pending") as FollowupStatus,
        message: row[8]?.toString() ?? "",
        source: row[9]?.toString() || undefined,
        executedAt: row[10]?.toString() || undefined,
        error: row[11]?.toString() || undefined,
      }))
      .filter((record) => record.leadId && record.type && record.email);
  } catch (error) {
    console.error("Unable to read PatientFollowUps sheet:", error);
    return [];
  }
}

export async function appendFollowupRecord(record: FollowupRecord) {
  const config = getServerConfig();
  const sheets = getSheets();
  try {
    await ensureFollowupsSheetExists(sheets, config.googleSheetId, config.googleFollowupsSheetName);
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheetId,
      range: `${config.googleFollowupsSheetName}!A:L`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            record.id,
            record.date,
            record.leadId,
            record.name,
            record.email,
            record.phone ?? "",
            record.type,
            record.status,
            record.message,
            record.source ?? "",
            record.executedAt ?? "",
            record.error ?? "",
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Unable to append followup record to PatientFollowUps sheet:", error);
    throw error;
  }
}

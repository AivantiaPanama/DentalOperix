import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";
import {
  CRM_STATUS_VALUES,
  googleCRMLeadSchema,
  type CRMStatus,
  type GoogleCRMLeadPayload,
} from "./types";
import { z } from "zod";
import { normalizeDisplayText } from "@/lib/text-normalization";

const CRM_COLUMNS = [
  "ID",
  "Fecha",
  "Nombre",
  "Teléfono",
  "Email",
  "Tratamiento",
  "Mensaje",
  "Urgencia",
  "Fecha Preferida",
  "Estado",
  "Fuente",
  "Resumen IA",
  "Evento Calendar ID",
  "Email Enviado",
] as const;

function leadToCRMRow(lead: {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string;
  urgency: string;
  preferredDate: string;
  status: CRMStatus;
  source: string;
  aiSummary: string;
  calendarEventId: string;
  emailSent: boolean;
}) {
  return [
    lead.id,
    lead.createdAt,
    lead.name,
    lead.phone,
    lead.email,
    lead.treatment,
    lead.message,
    lead.urgency,
    lead.preferredDate,
    lead.status,
    lead.source,
    lead.aiSummary,
    lead.calendarEventId,
    lead.emailSent ? "TRUE" : "FALSE",
  ];
}

function isCRMHeaderRow(row: unknown[]): row is string[] {
  return (
    row.length === CRM_COLUMNS.length && CRM_COLUMNS.every((column, index) => row[index] === column)
  );
}

const LEGACY_CRM_STATUS_MAP: Record<string, CRMStatus> = {
  nuevo: "nuevo",
  new: "nuevo",
  agendada: "agendada",
  scheduled: "agendada",
  completada: "completada",
  closed: "completada",
  contacted: "nuevo",
  cancelada: "cancelada",
  cancelled: "cancelada",
  "no asistió": "no asistió",
  "no asistio": "no asistió",
  "no-show": "no asistió",
  "no show": "no asistió",
  no_show: "no asistió",
};

function normalizeCRMStatus(raw?: string): CRMStatus {
  const normalized = raw?.toString().trim().toLowerCase() ?? "";
  return LEGACY_CRM_STATUS_MAP[normalized] ?? "nuevo";
}

const googleCRMLeadWriteInputSchema = googleCRMLeadSchema
  .omit({
    id: true,
    createdAt: true,
    status: true,
    aiSummary: true,
    calendarEventId: true,
    emailSent: true,
    urgency: true,
  })
  .extend({
    id: z.string().min(1).optional(),
    createdAt: z.string().datetime().optional(),
    treatment: z.string().min(1).optional(),
    status: z.enum(CRM_STATUS_VALUES).optional(),
    source: z.string().optional(),
    aiSummary: z.string().optional(),
    calendarEventId: z.string().optional(),
    emailSent: z.boolean().optional(),
    urgency: z.enum(["low", "media", "high"]).optional(),
    service: z.string().min(1).optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
      .optional(),
    time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Hora inválida")
      .optional(),
    notes: z.string().optional(),
    message: z.string().optional(),
    preferredDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.treatment && !data.service) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Se requiere un tratamiento o servicio.",
      });
    }
  });

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

export async function appendLeadToSheet(input: unknown) {
  const config = getServerConfig();
  const sheets = getSheets();
  const payload = googleCRMLeadWriteInputSchema.parse(input);
  const treatment = payload.treatment ?? payload.service ?? "";

  const row = {
    id: payload.id ?? `dental_${Date.now()}`,
    createdAt: payload.createdAt ?? new Date().toISOString(),
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    treatment,
    message: payload.message ?? payload.notes ?? "",
    urgency: payload.urgency ?? "media",
    preferredDate: payload.preferredDate ?? `${payload.date ?? ""} ${payload.time ?? ""}`.trim(),
    status: payload.status ? normalizeCRMStatus(payload.status) : "nuevo",
    source: payload.source ?? "web-form",
    aiSummary: payload.aiSummary ?? "",
    calendarEventId: payload.calendarEventId ?? "",
    emailSent: payload.emailSent ?? false,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("LEAD PAYLOAD:", payload);
    console.log("LEAD RECORD:", row);
  }

  const range = `${config.googleSheetName}!A:N`;
  const values = [leadToCRMRow(row)];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.googleSheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });

  return row as GoogleCRMLeadPayload;
}

export async function updateLeadInSheet(
  id: string,
  update: {
    status?: CRMStatus;
    calendarEventId?: string;
    emailSent?: boolean;
  },
) {
  const config = getServerConfig();
  const sheets = getSheets();
  const idRange = `${config.googleSheetName}!A:A`;
  const idResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: idRange,
  });

  const rows = idResponse.data.values ?? [];
  const rowIndex = rows.findIndex((row) => row[0] === id);

  if (rowIndex < 0) {
    throw new Error(`Lead con ID ${id} no encontrado para actualización.`);
  }

  const rowNumber = rowIndex + 1;
  const existingRange = `${config.googleSheetName}!A${rowNumber}:N${rowNumber}`;
  const existingResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: existingRange,
  });

  const existingRow = existingResponse.data.values?.[0] ?? [];
  const currentStatus = normalizeCRMStatus(existingRow[9]?.toString());
  const currentSource = existingRow[10]?.toString() || "web";
  const currentAiSummary = existingRow[11]?.toString() || "";
  const currentCalendarEventId = existingRow[12]?.toString() || "";
  const currentEmailSent = existingRow[13]?.toString() === "TRUE";

  const updatedStatus = update.status ? normalizeCRMStatus(update.status) : currentStatus;
  const updatedCalendarEventId = update.calendarEventId ?? currentCalendarEventId;
  const updatedEmailSent = update.emailSent !== undefined ? update.emailSent : currentEmailSent;

  // Actualiza únicamente las columnas J/M/N para evitar sobrescribir
  // Fuente (columna K) o Resumen IA (columna L) en la misma fila.
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: config.googleSheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        {
          range: `${config.googleSheetName}!J${rowNumber}`,
          values: [[updatedStatus]],
        },
        {
          range: `${config.googleSheetName}!M${rowNumber}`,
          values: [[updatedCalendarEventId]],
        },
        {
          range: `${config.googleSheetName}!N${rowNumber}`,
          values: [[updatedEmailSent ? "TRUE" : "FALSE"]],
        },
      ],
    },
  });
}

export async function readLeadsFromSheet() {
  const config = getServerConfig();
  const sheets = getSheets();
  const range = `${config.googleSheetName}!A:N`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range,
  });

  const rows = response.data.values ?? [];
  return rows
    .filter((row) => row.length >= 2 && !isCRMHeaderRow(row))
    .map((row, index) => {
      const [
        id,
        createdAt,
        name,
        phone,
        email,
        treatment,
        message,
        urgency,
        preferredDate,
        status,
        source,
        aiSummary,
        calendarEventId,
        emailSent,
      ] = row;

      return {
        id: normalizeDisplayText(id) || `sheet-${index + 1}`,
        createdAt: normalizeDisplayText(createdAt) || new Date().toISOString(),
        name: normalizeDisplayText(name),
        email: normalizeDisplayText(email),
        phone: normalizeDisplayText(phone),
        treatment: normalizeDisplayText(treatment),
        status: normalizeCRMStatus(normalizeDisplayText(status)),
        source: normalizeDisplayText(source) || "sheet",
        preferredDate: normalizeDisplayText(preferredDate),
        message: normalizeDisplayText(message),
        urgency: normalizeDisplayText(urgency),
        aiSummary: normalizeDisplayText(aiSummary),
        calendarEventId: normalizeDisplayText(calendarEventId),
        emailSent: normalizeDisplayText(emailSent) === "TRUE",
      };
    });
}

export type { GoogleCRMLeadPayload };

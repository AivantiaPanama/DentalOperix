import { google } from "googleapis";
import { getServerConfig } from "../config.server";
import { CRM_STATUS } from "@/server/google/types";
import {
  appendLeadToSheet as appendLeadToCRM,
  updateLeadInSheet as updateLeadInCRM,
} from "@/server/google/crm";
import { formatDateMX } from "@/lib/utils/date-format";

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}

function getGoogleAuth() {
  const config = getServerConfig();

  const auth = new google.auth.OAuth2({
    clientId: config.googleClientId,
    clientSecret: config.googleClientSecret,
    redirectUri: config.googleRedirectUri,
  });

  if (!config.googleRefreshToken) {
    throw new Error(
      "Missing GOOGLE_REFRESH_TOKEN. This endpoint requires a refresh token to authenticate with Google.",
    );
  }

  auth.setCredentials({ refresh_token: config.googleRefreshToken });
  return auth;
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function getCalendar() {
  return google.calendar({ version: "v3", auth: getGoogleAuth() });
}

function getGmail() {
  return google.gmail({ version: "v1", auth: getGoogleAuth() });
}

export type DentalAppointmentPayload = {
  appointmentId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  source?: string;
  preferredDate?: string;
};

function formatDateTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function addMinutesToTime(date: string, time: string, minutes: number) {
  const [hoursPart, minutesPart] = time.split(":").map(Number);
  if (!Number.isFinite(hoursPart) || !Number.isFinite(minutesPart)) {
    throw new Error("Invalid time format");
  }

  const totalMinutes = hoursPart * 60 + minutesPart + minutes;
  const daysToAdd = Math.floor(totalMinutes / (24 * 60));
  const adjustedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const endHours = Math.floor(adjustedMinutes / 60);
  const endMinutes = adjustedMinutes % 60;

  const [year, month, day] = date.split("-").map(Number);
  const baseDate = new Date(year, month - 1, day);
  if (Number.isNaN(baseDate.getTime())) {
    throw new Error("Invalid date format");
  }
  baseDate.setDate(baseDate.getDate() + daysToAdd);

  const paddedMonth = String(baseDate.getMonth() + 1).padStart(2, "0");
  const paddedDay = String(baseDate.getDate()).padStart(2, "0");
  const paddedHours = String(endHours).padStart(2, "0");
  const paddedMinutes = String(endMinutes).padStart(2, "0");

  return `${baseDate.getFullYear()}-${paddedMonth}-${paddedDay}T${paddedHours}:${paddedMinutes}:00`;
}

export async function appendLeadToSheet(payload: DentalAppointmentPayload) {
  await appendLeadToCRM({
    id: payload.appointmentId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    treatment: payload.service,
    message: payload.notes,
    urgency: "media",
    preferredDate: payload.preferredDate ?? `${payload.date} ${payload.time}`,
    source: payload.source ?? "web-form",
    status: CRM_STATUS.NUEVO,
    aiSummary: "",
    calendarEventId: "",
    emailSent: false,
  });
}

export const updateLeadInSheet = updateLeadInCRM;

export async function createGoogleCalendarEvent(payload: DentalAppointmentPayload) {
  const config = getServerConfig();
  const startDateTime = formatDateTime(payload.date, payload.time);
  const endDateTime = addMinutesToTime(payload.date, payload.time, 60);

  const calendarId = config.googleCalendarId || "primary";
  const event = await getCalendar().events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: `Cita DentalOperix: ${payload.service}`,
      description: `Reserva realizada por ${payload.name} (${payload.email})\nTeléfono: ${payload.phone}\nNotas: ${payload.notes ?? "N/A"}`,
      start: {
        dateTime: startDateTime,
        timeZone: config.googleCalendarTimeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: config.googleCalendarTimeZone,
      },
      attendees: [{ email: payload.email }],
      reminders: {
        useDefault: true,
      },
    },
  });

  if (!event.data || !event.data.id || !event.data.htmlLink) {
    throw new Error("No se pudo crear el evento de Google Calendar.");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("CALENDAR EVENT:", {
      id: event.data.id,
      htmlLink: event.data.htmlLink,
      calendarId,
      start: event.data.start,
      end: event.data.end,
    });
  }

  return event.data;
}

export async function sendConfirmationEmail(payload: DentalAppointmentPayload, eventLink: string) {
  const config = getServerConfig();
  const safeName = escapeHtml(payload.name);
  const safeService = escapeHtml(payload.service);
  const safeDate = escapeHtml(payload.date);
  const safeTime = escapeHtml(payload.time);
  const safeNotes = payload.notes ? escapeHtml(payload.notes) : "";
  const safeEventLink = escapeHtml(eventLink);
  const subject = `Confirmación de cita DentalOperix (${safeService})`;
  const formattedDate = formatDateMX(payload.date);
  const html = `
    <p>Hola ${safeName},</p>
    <p>Tu cita ha sido confirmada para el <strong>${formattedDate}</strong> a las <strong>${safeTime}</strong>.</p>
    <p>Servicio: <strong>${safeService}</strong></p>
    ${safeNotes ? `<p>Notas: ${safeNotes}</p>` : ""}
    <p><a href="${safeEventLink}">Ver evento en Google Calendar</a></p>
    <p>Si necesitas cambiar tu cita, responde este correo o contáctanos.</p>
    <p>Saludos,<br />Equipo DentalOperix</p>
  `;

  function encodeMimeWord(text: string) {
    const encoded = Buffer.from(text, "utf-8").toString("base64");
    return `=?UTF-8?B?${encoded}?=`;
  }

  const encodedSubject = encodeMimeWord(subject);
  const encodedHtml = Buffer.from(html, "utf-8").toString("base64");
  const messageParts = [
    `From: ${config.gmailSender}`,
    `To: ${payload.email}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encodedHtml,
  ];

  const raw = Buffer.from(messageParts.join("\r\n"), "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await getGmail().users.messages.send({
    userId: "me",
    requestBody: {
      raw,
    },
  });
}

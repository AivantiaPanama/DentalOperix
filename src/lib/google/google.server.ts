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
export type NotificationDeliveryResult = {
  patientEmailSent: boolean;
  clinicEmailSent: boolean;
  patientEmailError?: string;
  clinicEmailError?: string;
};

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

function uniqueEmails(...emails: Array<string | undefined | null>) {
  const seen = new Set<string>();
  return emails
    .map((email) => email?.trim())
    .filter((email): email is string => Boolean(email))
    .filter((email) => {
      const normalized = normalizeEmail(email);
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
}

function getClinicNotificationEmail(config: ReturnType<typeof getServerConfig>) {
  return config.clinicNotificationEmail || config.gmailSender;
}

function isSameEmail(left?: string | null, right?: string | null) {
  return normalizeEmail(left) === normalizeEmail(right);
}

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

function toIcsDateTime(localDateTime: string) {
  return localDateTime.replace(/[-:]/g, "").replace("T", "T");
}

function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
function createInviteIcs(payload: DentalAppointmentPayload, eventLink: string) {
  const config = getServerConfig();
  const startDateTime = formatDateTime(payload.date, payload.time);
  const endDateTime = addMinutesToTime(payload.date, payload.time, 60);
  const uid = `${payload.appointmentId}@dentaloperix`;
  const description = [
    `Cita DentalOperix para ${payload.service}`,
    `Paciente: ${payload.name}`,
    `Telefono: ${payload.phone}`,
    payload.notes ? `Notas: ${payload.notes}` : "",
    eventLink ? `Evento: ${eventLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DentalOperix//Booking Confirmation//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART;TZID=${config.googleCalendarTimeZone}:${toIcsDateTime(startDateTime)}`,
    `DTEND;TZID=${config.googleCalendarTimeZone}:${toIcsDateTime(endDateTime)}`,
    `SUMMARY:${escapeIcsText(`Cita DentalOperix: ${payload.service}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    eventLink ? `URL:${eventLink}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function encodeMimeWord(text: string) {
  const encoded = Buffer.from(text, "utf-8").toString("base64");
  return `=?UTF-8?B?${encoded}?=`;
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
    // Patient notifications are delivered through the unified Gmail confirmation email
    // with invite.ics attached. Avoid Calendar API duplicate emails.
    sendUpdates: "none",
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
      attendees: uniqueEmails(payload.email, getClinicNotificationEmail(config)).map((email) => ({
        email,
      })),
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

export async function sendConfirmationEmail(
  payload: DentalAppointmentPayload,
  eventLink: string,
): Promise<NotificationDeliveryResult> {
  const config = getServerConfig();
  const clinicEmail = getClinicNotificationEmail(config);
  const result: NotificationDeliveryResult = {
    patientEmailSent: false,
    clinicEmailSent: false,
  };

  async function sendMessage(recipient: string, audience: "patient" | "clinic") {
    const safeName = escapeHtml(payload.name);
    const safeService = escapeHtml(payload.service);
    const safeTime = escapeHtml(payload.time);
    const safeNotes = payload.notes ? escapeHtml(payload.notes) : "";
    const safeEventLink = eventLink ? escapeHtml(eventLink) : "";
    const subject =
      audience === "patient"
        ? `Confirmación de cita DentalOperix (${safeService})`
        : `Nueva cita agendada - DentalOperix (${safeService})`;
    const formattedDate = escapeHtml(formatDateMX(payload.date));
    const html =
      audience === "patient"
        ? `
          <p>Hola ${safeName},</p>
          <p>Tu cita ha sido registrada para el <strong>${formattedDate}</strong> a las <strong>${safeTime}</strong>.</p>
          <p>Servicio: <strong>${safeService}</strong></p>
          ${safeNotes ? `<p>Notas: ${safeNotes}</p>` : ""}
          ${safeEventLink ? `<p><a href="${safeEventLink}">Ver evento en Google Calendar</a></p>` : ""}
          <p>Si necesitas cambiar tu cita, responde este correo o contáctanos.</p>
          <p>Saludos,<br />Equipo DentalOperix</p>
        `
        : `
          <p>Nueva cita agendada desde DentalOperix.</p>
          <p><strong>Paciente:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(payload.phone)}</p>
          <p><strong>Servicio:</strong> ${safeService}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Hora:</strong> ${safeTime}</p>
          ${safeNotes ? `<p><strong>Notas:</strong> ${safeNotes}</p>` : ""}
          ${safeEventLink ? `<p><a href="${safeEventLink}">Ver evento en Google Calendar</a></p>` : ""}
        `;

    const encodedSubject = encodeMimeWord(subject);
    const encodedHtml = Buffer.from(html, "utf-8").toString("base64");
    const messageParts = [
      `From: ${config.gmailSender}`,
      `To: ${recipient}`,
      `Reply-To: ${config.gmailSender}`,
      `Subject: ${encodedSubject}`,
      `X-DentalOperix-Notification-Audience: ${audience}`,
      "MIME-Version: 1.0",
    ];

    if (audience === "patient") {
      const boundary = `dentaloperix-${payload.appointmentId}`;
      const inviteIcs = createInviteIcs(payload, eventLink);
      const encodedIcs = Buffer.from(inviteIcs, "utf-8").toString("base64");
      messageParts.push(
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        encodedHtml,
        `--${boundary}`,
        "Content-Type: text/calendar; charset=UTF-8; method=PUBLISH; name=invite.ics",
        "Content-Transfer-Encoding: base64",
        "Content-Disposition: attachment; filename=invite.ics",
        "",
        encodedIcs,
        `--${boundary}--`,
      );
    } else {
      messageParts.push(
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        encodedHtml,
      );
    }

    const raw = Buffer.from(messageParts.join("\r\n"), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const gmail = getGmail();
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    if (audience === "clinic" && isSameEmail(recipient, config.gmailSender) && response.data.id) {
      try {
        await gmail.users.messages.modify({
          userId: "me",
          id: response.data.id,
          requestBody: {
            addLabelIds: ["INBOX", "UNREAD"],
          },
        });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Clinic self-notification was sent but could not be marked as inbox/unread:",
            error,
          );
        }
      }
    }
  }

  try {
    await sendMessage(payload.email, "patient");
    result.patientEmailSent = true;
  } catch (error) {
    result.patientEmailError =
      error instanceof Error ? error.message : "Unknown patient email error";
  }

  if (isSameEmail(payload.email, clinicEmail)) {
    result.clinicEmailSent = result.patientEmailSent;
    result.clinicEmailError = result.patientEmailError;
    if (!result.patientEmailSent) {
      throw Object.assign(new Error("Booking notification email failed."), {
        delivery: result,
      });
    }
    return result;
  }

  try {
    await sendMessage(clinicEmail, "clinic");
    result.clinicEmailSent = true;
  } catch (error) {
    result.clinicEmailError = error instanceof Error ? error.message : "Unknown clinic email error";
  }

  if (!result.patientEmailSent || !result.clinicEmailSent) {
    throw Object.assign(new Error("One or more booking notification emails failed."), {
      delivery: result,
    });
  }

  return result;
}

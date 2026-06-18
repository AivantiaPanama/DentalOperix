import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";
import { formatDateMX } from "@/lib/utils/date-format";
import { googleCalendarAppointmentSchema, type GoogleCalendarAppointmentInput } from "./types";

function getGoogleCalendar() {
  return google.calendar({ version: "v3", auth: getGoogleAuth() });
}

export async function createDentalAppointment(input: unknown) {
  const config = getServerConfig();
  const calendar = getGoogleCalendar();
  const payload = googleCalendarAppointmentSchema.parse(input);

  const startDateTime = `${payload.date}T${payload.time}:00`;
  const endDate = new Date(startDateTime);
  endDate.setMinutes(endDate.getMinutes() + 45);
  const calendarId = config.googleCalendarId || "primary";

  const event = await calendar.events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: `Valoración dental - ${payload.service} - ${payload.name}`,
      description: `Teléfono: ${payload.phone}\nEmail: ${payload.email ?? "N/A"}\nTratamiento: ${payload.service}\nFecha: ${formatDateMX(payload.date)}\nHora: ${payload.time}\nNotas: ${payload.notes ?? "N/A"}`,
      start: {
        dateTime: startDateTime,
        timeZone: config.googleCalendarTimeZone,
      },
      end: {
        dateTime: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}T${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`,
        timeZone: config.googleCalendarTimeZone,
      },
      attendees: payload.email ? [{ email: payload.email }] : [],
      reminders: {
        useDefault: true,
      },
    },
  });

  if (!event.data || !event.data.id) {
    throw new Error("No se pudo crear el evento en Google Calendar.");
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

export const createGoogleEvent = createDentalAppointment;

export type { GoogleCalendarAppointmentInput };

import { CRM_STATUS } from "@/server/google/types";
import type { GoogleLeadPayload } from "@/lib/google/schemas";
import { appendLeadToSheet as appendCRMLeadToSheet, updateLeadInSheet } from "@/server/google/crm";
import { createGoogleCalendarEvent, sendConfirmationEmail } from "../google/google.server";

export type DentalLeadPayload = GoogleLeadPayload & {
  appointmentId?: string;
  source?: string;
};

export async function processDentalLead(payload: DentalLeadPayload) {
  const appointmentId = payload.appointmentId ?? `dental_${Date.now()}`;
  const service = payload.service?.trim() ?? "";
  const completePayload = {
    ...payload,
    appointmentId,
    source: payload.source ?? "web-form",
    service,
  };

  const treatment = (payload.treatment?.trim() || service).trim();
  const leadRecord = {
    id: appointmentId,
    name: completePayload.name,
    email: completePayload.email,
    phone: completePayload.phone,
    treatment,
    message: completePayload.notes,
    urgency: "media",
    preferredDate:
      completePayload.preferredDate ?? `${completePayload.date} ${completePayload.time}`,
    status: CRM_STATUS.NUEVO as const,
    source: completePayload.source as const,
    aiSummary: "",
    calendarEventId: "",
    emailSent: false,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("LEAD PAYLOAD:", {
      appointmentId: completePayload.appointmentId,
      name: completePayload.name,
      email: completePayload.email,
      phone: completePayload.phone,
      service: completePayload.service,
      treatment: completePayload.treatment,
      date: completePayload.date,
      time: completePayload.time,
      preferredDate: completePayload.preferredDate,
      notes: completePayload.notes,
      source: completePayload.source,
    });
    console.log("LEAD RECORD:", leadRecord);
  }

  await appendCRMLeadToSheet(leadRecord);

  const isDev = process.env.NODE_ENV !== "production";
  let event;
  let calendarEventId = "";
  let updatedStatus: CRM_STATUS.NUEVO | CRM_STATUS.AGENDADA = CRM_STATUS.NUEVO;
  let emailSent = false;
  let calendarError: string | undefined;
  let emailError: string | undefined;

  try {
    event = await createGoogleCalendarEvent(completePayload);
    calendarEventId = event.id ?? "";
    updatedStatus = CRM_STATUS.AGENDADA;
    await updateLeadInSheet(leadRecord.id, {
      status: updatedStatus,
      calendarEventId,
    });
  } catch (error) {
    console.error("Error creando evento de Google Calendar:", error);
    calendarError =
      error instanceof Error
        ? error.message
        : "Error desconocido al crear el evento de Google Calendar.";
  }

  try {
    await sendConfirmationEmail(completePayload, event?.htmlLink ?? "");
    emailSent = true;
    await updateLeadInSheet(leadRecord.id, {
      emailSent: true,
    });
  } catch (error) {
    console.error("Error enviando correo Gmail:", error);
    emailError =
      error instanceof Error
        ? error.message
        : "Error desconocido al enviar el correo de confirmación.";
  }

  const message = calendarEventId
    ? emailSent
      ? "Tu cita fue registrada y enviamos la confirmación a tu correo."
      : "Tu cita fue registrada. No pudimos enviar el correo de confirmación, pero nos pondremos en contacto contigo."
    : "Recibimos tu solicitud. Nuestro equipo confirmará la disponibilidad contigo.";

  const responseBody: {
    appointmentId: string;
    status: string;
    eventLink: string | null;
    calendarCreated: boolean;
    emailSent: boolean;
    crmSaved: true;
    message: string;
    calendarError?: string;
    emailError?: string;
  } = {
    appointmentId: leadRecord.id,
    status: updatedStatus === CRM_STATUS.AGENDADA ? "confirmed" : "pending",
    eventLink: event?.htmlLink ?? null,
    calendarCreated: Boolean(calendarEventId),
    emailSent,
    crmSaved: true,
    message,
  };

  if (isDev) {
    responseBody.calendarError = calendarError;
    responseBody.emailError = emailError;
  }

  return responseBody;
}

import { google } from "googleapis";
import { getGoogleAuth } from "./auth";
import { getServerConfig } from "@/lib/config.server";
import { formatDateMX } from "@/lib/utils/date-format";
import { googleDentalConfirmationSchema, type GoogleDentalConfirmationInput } from "./types";

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

function encodeMimeWord(text: string) {
  const encoded = Buffer.from(text, "utf-8").toString("base64");
  return `=?UTF-8?B?${encoded}?=`;
}

function buildMessage(
  payload: GoogleDentalConfirmationInput,
  config: ReturnType<typeof getServerConfig>,
  recipient: string,
  audience: "patient" | "clinic",
) {
  const name = escapeHtml(payload.name);
  const service = escapeHtml(payload.service);
  const date = escapeHtml(formatDateMX(payload.date));
  const time = escapeHtml(payload.time);
  const eventLink = escapeHtml(payload.eventLink);
  const notes = payload.notes ? escapeHtml(payload.notes) : "";
  const subject = encodeMimeWord(
    audience === "patient"
      ? "Confirmación de solicitud - DentalOperix"
      : "Nueva cita agendada - DentalOperix",
  );

  const html =
    audience === "patient"
      ? `
        <p>Hola ${name},</p>
        <p>Gracias por solicitar una valoración dental con DentalOperix.</p>
        <p><strong>Tratamiento solicitado:</strong> ${service}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
        <p><strong>Ver detalles:</strong> <a href="${eventLink}">evento en Google Calendar</a></p>
        ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ""}
        <p>Pronto nos pondremos en contacto para confirmar disponibilidad del horario y los detalles de la cita.</p>
        <p>Si tienes alguna pregunta, puedes responder a este correo o llamarnos.</p>
        <p>Saludos,<br/>Equipo DentalOperix</p>
      `
      : `
        <p>Nueva cita agendada desde DentalOperix.</p>
        <p><strong>Paciente:</strong> ${name}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Tratamiento solicitado:</strong> ${service}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
        <p><strong>Ver detalles:</strong> <a href="${eventLink}">evento en Google Calendar</a></p>
        ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ""}
      `;

  const encodedHtml = Buffer.from(html, "utf-8").toString("base64");
  const messageParts = [
    `From: ${config.gmailSender}`,
    `To: ${recipient}`,
    `Reply-To: ${config.gmailSender}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encodedHtml,
  ];

  return Buffer.from(messageParts.join("\r\n"), "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

function buildRawEmailMessage(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const encodedSubject = encodeMimeWord(payload.subject);
  const encodedHtml = Buffer.from(payload.html, "utf-8").toString("base64");
  const messageParts = [
    `From: ${payload.from}`,
    `To: ${payload.to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encodedHtml,
  ];

  return Buffer.from(messageParts.join("\r\n"), "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendDentalConfirmationEmail(input: unknown) {
  const config = getServerConfig();
  const gmail = google.gmail({ version: "v1", auth: getGoogleAuth() });
  const payload = googleDentalConfirmationSchema.parse(input);
  const clinicEmail = config.clinicNotificationEmail || config.gmailSender;
  const recipients =
    normalizeEmail(payload.email) === normalizeEmail(clinicEmail)
      ? [{ email: payload.email, audience: "patient" as const }]
      : [
          { email: payload.email, audience: "patient" as const },
          { email: clinicEmail, audience: "clinic" as const },
        ];

  for (const recipient of recipients) {
    const raw = buildMessage(payload, config, recipient.email, recipient.audience);
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
  }
}

export async function sendFollowupEmail(input: {
  recipient: string;
  subject: string;
  body: string;
}) {
  const config = getServerConfig();
  const gmail = google.gmail({ version: "v1", auth: getGoogleAuth() });
  const raw = buildRawEmailMessage({
    from: config.gmailSender,
    to: input.recipient,
    subject: input.subject,
    html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${input.body}</pre>`,
  });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}

export const sendConfirmationEmail = sendDentalConfirmationEmail;

export type { GoogleDentalConfirmationInput };

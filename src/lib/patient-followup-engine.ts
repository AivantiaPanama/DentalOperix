import { z } from "zod";
import { readLeadsFromSheet } from "@/server/google/sheets";
import {
  appendFollowupRecord,
  readFollowupRecords,
  type FollowupRecord,
  type FollowupType,
} from "@/server/google/followups";
import { sendFollowupEmail } from "@/server/google/gmail";
import { calculateLeadScore } from "@/lib/lead-scoring";

export type FollowupLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  treatment?: string;
  status?: string;
  source?: string;
  createdAt?: string;
  preferredDate?: string;
  urgency?: string;
  message?: string;
};

export type FollowupAction = {
  leadId: string;
  type: FollowupType;
  channel: "email";
  recipient: string;
  name: string;
  subject: string;
  message: string;
  scheduledAt: string;
  leadScore: number;
  leadCategory: "hot" | "warm" | "cold";
};

export type FollowupRunResult = {
  dryRun: boolean;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
  errors: string[];
  actions: FollowupAction[];
};

const followupRunSchema = z.object({
  dryRun: z.boolean().optional().default(true),
});

function parseDateTime(value?: string): Date | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  const normalized = raw.replace(/\//g, "-").replace(/\s+/g, " ").trim();
  const dateTimeMatch = normalized.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/);
  if (!dateTimeMatch) return undefined;

  const [, date, time] = dateTimeMatch;
  const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  const parsed = new Date(dateTime);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toIso(value: Date) {
  return value.toISOString();
}

function differenceInDays(from: Date, to: Date) {
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.floor((to.getTime() - from.getTime()) / dayMs);
}

const FOLLOWUP_DEDUPE_WINDOW_DAYS = 1;

function isDuplicateAction(
  existing: FollowupRecord[],
  leadId: string,
  type: FollowupType,
  scheduledAt: string,
) {
  return existing.some((record) => {
    return (
      record.leadId === leadId &&
      record.type === type &&
      record.status === "sent" &&
      record.date === scheduledAt
    );
  });
}

function buildFollowupMessage(lead: FollowupLead, type: FollowupType, appointmentDate?: Date) {
  const name = lead.name || "Paciente";
  const treatment = lead.treatment ? ` sobre ${lead.treatment}` : "";
  const friendlyDate = appointmentDate
    ? appointmentDate.toLocaleDateString("es-ES")
    : "próximamente";
  const friendlyTime = appointmentDate
    ? appointmentDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    : "";

  switch (type) {
    case "appointment_reminder":
      return `Hola ${name},\n\nTe recordamos que tienes una cita${treatment} programada para el ${friendlyDate}${friendlyTime ? ` a las ${friendlyTime}` : ""}. Si necesitas reprogramar, responde a este correo.`;
    case "attendance_confirmation":
      return `Hola ${name},\n\n¿Confirmas tu asistencia a la cita${treatment}${friendlyDate ? ` el ${friendlyDate}` : ""}${friendlyTime ? ` a las ${friendlyTime}` : ""}? Responde este correo para confirmar.`;
    case "cancellation_recovery":
      return `Hola ${name},\n\nHemos visto que tu cita fue cancelada. Si deseas reagendar o tienes dudas, estamos aquí para ayudarte. Responde este correo y coordinamos tu nueva cita.`;
    case "inactive_reactivation":
      return `Hola ${name},\n\nTe extrañamos en DentalOperix. Si quieres retomar tu cuidado dental o agendar una valoración, responde este correo y te apoyamos con el siguiente paso.`;
    case "no_show_recovery":
      return `Hola ${name},\n\nVimos que no pudiste asistir a tu cita. Si deseas reagendar o necesitas ayuda, responde este correo y te apoyamos a reactivar tu atención.`;
    case "post_appointment_followup":
      return `Hola ${name},\n\nGracias por visitarnos. ¿Cómo estuvo tu experiencia${treatment}? Si necesitas alguna atención adicional, responde este correo y te ayudamos.`;
    default:
      return `Hola ${name},\n\nTe contactamos desde DentalOperix para darle seguimiento a tu atención.`;
  }
}

function buildFollowupSubject(type: FollowupType) {
  switch (type) {
    case "appointment_reminder":
      return "Recordatorio de cita DentalOperix";
    case "attendance_confirmation":
      return "Confirmación de asistencia DentalOperix";
    case "cancellation_recovery":
      return "Recuperación de cita cancelada";
    case "inactive_reactivation":
      return "Te ayudamos a retomar tu atención dental";
    case "no_show_recovery":
      return "Recuperación de cita no asistida";
    case "post_appointment_followup":
      return "Seguimiento post consulta DentalOperix";
    default:
      return "Seguimiento DentalOperix";
  }
}

function createFollowupAction(
  lead: FollowupLead,
  type: FollowupType,
  appointmentDate: Date | undefined,
  scheduledAt: Date,
): FollowupAction {
  const leadScore = calculateLeadScore(lead);
  return {
    leadId: lead.id,
    type,
    channel: "email",
    recipient: lead.email,
    name: lead.name,
    subject: buildFollowupSubject(type),
    message: buildFollowupMessage(lead, type, appointmentDate),
    scheduledAt: toIso(scheduledAt),
    leadScore: leadScore.score,
    leadCategory: leadScore.category,
  };
}

export function generateFollowupActions(
  leads: FollowupLead[],
  existingFollowups: FollowupRecord[],
  now = new Date(),
): FollowupAction[] {
  const actions: FollowupAction[] = [];

  for (const lead of leads) {
    if (!lead.id || !lead.email) continue;
    const leadScore = calculateLeadScore(lead);
    const status = lead.status?.toString().toLowerCase();
    const appointmentDate = parseDateTime(lead.preferredDate) ?? parseDateTime(lead.createdAt);
    const createdAt = parseDateTime(lead.createdAt) ?? new Date();
    const daysSinceCreation = differenceInDays(createdAt, now);
    const daysUntilAppointment = appointmentDate
      ? differenceInDays(now, appointmentDate)
      : undefined;

    if (status === "agendada" && appointmentDate) {
      if (
        daysUntilAppointment !== undefined &&
        daysUntilAppointment >= 0 &&
        daysUntilAppointment <= 1
      ) {
        const action = createFollowupAction(lead, "attendance_confirmation", appointmentDate, now);
        if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
          actions.push(action);
        }
      } else if (
        daysUntilAppointment !== undefined &&
        daysUntilAppointment > 1 &&
        daysUntilAppointment <= 3
      ) {
        const action = createFollowupAction(lead, "appointment_reminder", appointmentDate, now);
        if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
          actions.push(action);
        }
      }
    }

    if (status === "cancelada" && daysSinceCreation >= 1) {
      const action = createFollowupAction(lead, "cancellation_recovery", appointmentDate, now);
      if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
        actions.push(action);
      }
    }

    if (status === "completada" && appointmentDate) {
      const daysSinceAppointment = differenceInDays(appointmentDate, now);
      if (daysSinceAppointment >= 2) {
        const action = createFollowupAction(
          lead,
          "post_appointment_followup",
          appointmentDate,
          now,
        );
        if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
          actions.push(action);
        }
      }
    }

    if (
      status === "no asistió" ||
      status === "no asistio" ||
      status === "no-show" ||
      status === "no_show"
    ) {
      const action = createFollowupAction(lead, "no_show_recovery", appointmentDate, now);
      if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
        actions.push(action);
      }
    }

    if (status === "nuevo" && daysSinceCreation >= 30) {
      const action = createFollowupAction(lead, "inactive_reactivation", appointmentDate, now);
      if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) {
        actions.push(action);
      }
    }
  }

  return actions.sort((a, b) => b.leadScore - a.leadScore);
}

export async function runPatientFollowups(
  input: unknown,
  now: Date = new Date(),
): Promise<FollowupRunResult> {
  const parsed = followupRunSchema.parse(input);
  const dryRun = parsed.dryRun;

  const leads = await readLeadsFromSheet();
  const errors: string[] = [];
  let existingFollowups: FollowupRecord[] = [];

  try {
    existingFollowups = await readFollowupRecords();
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unable to read existing followups");
  }

  const actions = generateFollowupActions(leads, existingFollowups, now);
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const action of actions) {
    if (dryRun) {
      skipped += 1;
      continue;
    }

    const recordBase = {
      id: `${action.leadId}_${action.type}_${Date.now()}`,
      date: action.scheduledAt,
      leadId: action.leadId,
      name: action.name,
      email: action.recipient,
      type: action.type,
      status: "sent" as const,
      message: action.message,
      source: undefined as string | undefined,
      executedAt: toIso(now),
      error: undefined as string | undefined,
    };

    try {
      await sendFollowupEmail({
        recipient: action.recipient,
        subject: action.subject,
        body: action.message,
      });

      sent += 1;

      try {
        await appendFollowupRecord({
          ...recordBase,
          status: "sent",
        });
      } catch (appendError) {
        const appendMessage =
          appendError instanceof Error ? appendError.message : "Unable to persist sent followup";
        errors.push(appendMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      errors.push(errorMessage);
      failed += 1;

      try {
        await appendFollowupRecord({
          ...recordBase,
          status: "failed",
          error: errorMessage,
        });
      } catch (appendError) {
        const appendMessage =
          appendError instanceof Error ? appendError.message : "Unable to persist failed followup";
        errors.push(appendMessage);
      }
    }
  }

  return {
    dryRun,
    generated: actions.length,
    sent,
    skipped,
    failed,
    errors,
    actions,
  };
}

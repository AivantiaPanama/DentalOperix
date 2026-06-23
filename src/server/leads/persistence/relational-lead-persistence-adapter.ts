import { z } from "zod";
import {
  CRM_STATUS_VALUES,
  LEAD_URGENCY_VALUES,
  googleCRMLeadSchema,
  normalizeLeadUrgency,
  type CRMStatus,
  type GoogleCRMLeadPayload,
  type LeadUrgency,
} from "@/server/google/types";
import type {
  LeadPersistenceAppendInput,
  LeadPersistenceHealth,
  LeadPersistencePort,
  LeadPersistenceUpdateInput,
} from "./lead-persistence-port";
import { LeadPersistenceNotConfiguredError } from "./lead-persistence-port";

const RELATIONAL_RUNTIME_SCHEMA_VERSION = "57.8" as const;

const LEGACY_CRM_STATUS_MAP: Record<string, CRMStatus> = {
  nuevo: "nuevo",
  new: "nuevo",
  contactado: "contactado",
  contacted: "contactado",
  seguimiento: "seguimiento",
  followup: "seguimiento",
  "follow-up": "seguimiento",
  follow_up: "seguimiento",
  agendada: "agendada",
  scheduled: "agendada",
  completada: "completada",
  closed: "completada",
  cancelada: "cancelada",
  cancelled: "cancelada",
  "no interesado": "no interesado",
  "no-interesado": "no interesado",
  no_interesado: "no interesado",
  not_interested: "no interesado",
  "not interested": "no interesado",
  "no asistió": "no asistió",
  "no asistio": "no asistió",
  "no-show": "no asistió",
  "no show": "no asistió",
  no_show: "no asistió",
};

const relationalLeadWriteInputSchema = googleCRMLeadSchema
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
    status: z.string().optional(),
    source: z.string().optional(),
    aiSummary: z.string().optional(),
    calendarEventId: z.string().optional(),
    emailSent: z.boolean().optional(),
    urgency: z.enum(LEAD_URGENCY_VALUES).optional(),
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

type PgClient = {
  connect(): Promise<void>;
  end(): Promise<void>;
  query<T = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[]; rowCount: number | null }>;
};

type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;

function normalizeCRMStatus(raw?: string): CRMStatus {
  const normalized = raw?.toString().trim().toLowerCase() ?? "";
  return LEGACY_CRM_STATUS_MAP[normalized] ?? "nuevo";
}

function normalizeUrgency(raw?: string | null): LeadUrgency | undefined {
  return normalizeLeadUrgency(raw);
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

function isRelationalRuntimeActivationApproved() {
  return (
    process.env.LEADS_PERSISTENCE_MODE === "relational-db" &&
    process.env.RELATIONAL_CUTOVER_APPROVED === "true" &&
    process.env.RELATIONAL_RUNTIME_ACTIVATION_APPROVED === "true"
  );
}

async function createPgClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new LeadPersistenceNotConfiguredError(
      "Relational Lead persistence requires DATABASE_URL or POSTGRES_URL.",
    );
  }

  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  return new pgModule.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
}

function assertRelationalRuntimeActivationApproved() {
  if (!isRelationalRuntimeActivationApproved()) {
    throw new LeadPersistenceNotConfiguredError(
      "Relational Lead persistence is not active. 57.8 requires LEADS_PERSISTENCE_MODE=relational-db, RELATIONAL_CUTOVER_APPROVED=true and RELATIONAL_RUNTIME_ACTIVATION_APPROVED=true.",
    );
  }
}

type RelationalLeadRow = {
  id: string;
  created_at: string | Date;
  name: string;
  phone: string;
  email: string;
  treatment: string;
  message: string | null;
  urgency: string | null;
  preferred_date: string | null;
  status: string;
  source: string | null;
  ai_summary: string | null;
  calendar_event_id: string | null;
  email_sent: boolean;
};

function rowToLead(row: RelationalLeadRow): GoogleCRMLeadPayload {
  return {
    id: row.id,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at.toString(),
    name: row.name,
    phone: row.phone,
    email: row.email,
    treatment: row.treatment,
    message: row.message ?? "",
    urgency: normalizeUrgency(row.urgency),
    preferredDate: row.preferred_date ?? "",
    status: normalizeCRMStatus(row.status),
    source: row.source ?? "relational-db",
    aiSummary: row.ai_summary ?? "",
    calendarEventId: row.calendar_event_id ?? "",
    emailSent: Boolean(row.email_sent),
  };
}

export class RelationalLeadPersistenceAdapter implements LeadPersistencePort {
  readonly mode = "relational-db" as const;

  async appendLead(input: LeadPersistenceAppendInput) {
    assertRelationalRuntimeActivationApproved();

    const payload = relationalLeadWriteInputSchema.parse(input);
    const treatment = payload.treatment ?? payload.service ?? "";
    const lead = {
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
    } satisfies GoogleCRMLeadPayload;

    const client = await createPgClient();

    try {
      await client.connect();
      await client.query(
        `INSERT INTO leads (
           id, created_at, name, phone, email, treatment, message, urgency,
           preferred_date, status, source, ai_summary, calendar_event_id, email_sent,
           physical_source, source_record_hash, schema_version
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8,
           $9, $10, $11, $12, $13, $14,
           'relational-db', NULL, $15
         )`,
        [
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
          lead.emailSent,
          RELATIONAL_RUNTIME_SCHEMA_VERSION,
        ],
      );

      return lead;
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  async updateLead(id: string, update: LeadPersistenceUpdateInput): Promise<void> {
    assertRelationalRuntimeActivationApproved();

    const assignments: string[] = [];
    const values: unknown[] = [];

    if (update.status !== undefined) {
      values.push(normalizeCRMStatus(update.status));
      assignments.push(`status = $${values.length}`);
    }

    if (update.calendarEventId !== undefined) {
      values.push(update.calendarEventId);
      assignments.push(`calendar_event_id = $${values.length}`);
    }

    if (update.emailSent !== undefined) {
      values.push(update.emailSent);
      assignments.push(`email_sent = $${values.length}`);
    }

    if (assignments.length === 0) return;

    values.push(id);
    const client = await createPgClient();

    try {
      await client.connect();
      const result = await client.query(
        `UPDATE leads SET ${assignments.join(", ")} WHERE id = $${values.length}`,
        values,
      );

      if (result.rowCount === 0) {
        throw new Error(`Lead con ID ${id} no encontrado para actualización relacional.`);
      }
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  async listLeads() {
    assertRelationalRuntimeActivationApproved();

    const client = await createPgClient();

    try {
      await client.connect();
      const result = await client.query<RelationalLeadRow>(
        `SELECT id, created_at, name, phone, email, treatment, message, urgency,
                preferred_date, status, source, ai_summary, calendar_event_id, email_sent
           FROM leads
          ORDER BY created_at DESC`,
      );

      return result.rows.map(rowToLead);
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  getHealth(): LeadPersistenceHealth {
    const active = isRelationalRuntimeActivationApproved();

    return {
      mode: this.mode,
      writable: active,
      active,
      sourceOfTruth: "Leads",
      physicalPersistence: "Relational Database",
      notes: active
        ? [
            "57.8 controlled cutover runtime flags are enabled.",
            "Relational Database is the selected physical persistence.",
            "This does not change Leads as Source of Truth.",
          ]
        : [
            "Future persistence adapter is present but fail-closed.",
            "Requires explicit 57.8 cutover flags before reads or writes are enabled.",
            "Must not be used for dual write.",
          ],
    };
  }
}

export const relationalLeadPersistenceAdapter = new RelationalLeadPersistenceAdapter();

import {
  type Appointment,
  type AppointmentActorRole,
  type AppointmentSource,
  type AppointmentStatus,
} from "./appointment-domain";

export const RELATIONAL_APPOINTMENTS_TABLE_NAME = "appointments" as const;

export type AppointmentPersistenceClient = {
  query<T = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[]; rowCount: number | null }>;
};

export type PgClient = AppointmentPersistenceClient & {
  connect(): Promise<void>;
  end(): Promise<void>;
};

type PgClientConstructor = new (config: {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
}) => PgClient;

export type RelationalAppointmentRow = {
  id: string;
  lead_id: string | null;
  provider_id: string | null;
  requested_date: string | null;
  requested_time: string | null;
  scheduled_start_at: string | Date | null;
  scheduled_end_at: string | Date | null;
  duration_minutes: number;
  service: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  notes: string | null;
  calendar_event_id: string | null;
  created_by_user_id: string | null;
  created_by_role: AppointmentActorRole | null;
  created_via: AppointmentSource;
  updated_by_user_id: string | null;
  updated_by_role: AppointmentActorRole | null;
  updated_via: AppointmentSource | null;
  cancelled_by_user_id: string | null;
  cancelled_by_role: AppointmentActorRole | null;
  cancelled_via: AppointmentSource | null;
  cancellation_reason: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export async function createPgClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Appointment persistence requires DATABASE_URL or POSTGRES_URL.");
  }

  const pgModule = (await import("pg")) as unknown as {
    Client: PgClientConstructor;
  };

  return new pgModule.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
}

function toIsoString(value: string | Date | null): string | undefined {
  if (!value) return undefined;

  return value instanceof Date ? value.toISOString() : value.toString();
}

export function rowToAppointment(
  row: RelationalAppointmentRow,
): Appointment {
  return {
    id: row.id,
    leadId: row.lead_id ?? undefined,
    providerId: row.provider_id ?? undefined,
    requestedDate: row.requested_date ?? undefined,
    requestedTime: row.requested_time ?? undefined,
    scheduledStartAt: toIsoString(row.scheduled_start_at),
    scheduledEndAt: toIsoString(row.scheduled_end_at),
    durationMinutes: Number(row.duration_minutes),
    service: row.service,
    status: row.status,
    source: row.source,
    patientName: row.patient_name,
    patientEmail: row.patient_email ?? undefined,
    patientPhone: row.patient_phone ?? undefined,
    notes: row.notes ?? undefined,
    calendarEventId: row.calendar_event_id ?? undefined,
    createdByUserId: row.created_by_user_id ?? undefined,
    createdByRole: row.created_by_role ?? undefined,
    createdVia: row.created_via,
    updatedByUserId: row.updated_by_user_id ?? undefined,
    updatedByRole: row.updated_by_role ?? undefined,
    updatedVia: row.updated_via ?? undefined,
    cancelledByUserId: row.cancelled_by_user_id ?? undefined,
    cancelledByRole: row.cancelled_by_role ?? undefined,
    cancelledVia: row.cancelled_via ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    createdAt: toIsoString(row.created_at) ?? "",
    updatedAt: toIsoString(row.updated_at) ?? "",
  };
}

export const RETURNING_APPOINTMENT_COLUMNS = `
  id, lead_id, provider_id, requested_date, requested_time,
  scheduled_start_at, scheduled_end_at, duration_minutes, service, status, source,
  patient_name, patient_email, patient_phone, notes, calendar_event_id,
  created_by_user_id, created_by_role, created_via,
  updated_by_user_id, updated_by_role, updated_via,
  cancelled_by_user_id, cancelled_by_role, cancelled_via, cancellation_reason,
  created_at, updated_at
`;
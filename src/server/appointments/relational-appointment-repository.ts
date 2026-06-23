import {
  createAppointmentEntity,
  validateUpdateAppointmentInput,
  type Appointment,
  type AppointmentActorRole,
  type AppointmentSource,
  type AppointmentStatus,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
} from "./appointment-domain";
import {
  AppointmentNotFoundError,
  type AppointmentConflictSearch,
  type AppointmentRepository,
} from "./appointment-repository";

export const RELATIONAL_APPOINTMENTS_TABLE_NAME = "appointments" as const;

export type AppointmentPersistenceClient = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }>;
};

type PgClient = AppointmentPersistenceClient & {
  connect(): Promise<void>;
  end(): Promise<void>;
};

type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;

type RelationalAppointmentRow = {
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

async function createPgClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Appointment persistence requires DATABASE_URL or POSTGRES_URL.");
  }

  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  return new pgModule.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
}

function toIsoString(value: string | Date | null): string | undefined {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value.toString();
}

function rowToAppointment(row: RelationalAppointmentRow): Appointment {
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

const RETURNING_APPOINTMENT_COLUMNS = `
  id, lead_id, provider_id, requested_date, requested_time,
  scheduled_start_at, scheduled_end_at, duration_minutes, service, status, source,
  patient_name, patient_email, patient_phone, notes, calendar_event_id,
  created_by_user_id, created_by_role, created_via,
  updated_by_user_id, updated_by_role, updated_via,
  cancelled_by_user_id, cancelled_by_role, cancelled_via, cancellation_reason,
  created_at, updated_at
`;

export class RelationalAppointmentRepository implements AppointmentRepository {
  constructor(private readonly clientFactory: () => Promise<AppointmentPersistenceClient> = createPgClient) {}

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment = createAppointmentEntity(input);
    const client = await this.clientFactory();

    const result = await client.query<RelationalAppointmentRow>(
      `
        INSERT INTO ${RELATIONAL_APPOINTMENTS_TABLE_NAME} (
          id, lead_id, provider_id, requested_date, requested_time,
          scheduled_start_at, scheduled_end_at, duration_minutes, service, status, source,
          patient_name, patient_email, patient_phone, notes, calendar_event_id,
          created_by_user_id, created_by_role, created_via,
          updated_by_user_id, updated_by_role, updated_via,
          cancelled_by_user_id, cancelled_by_role, cancelled_via, cancellation_reason,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19,
          $20, $21, $22,
          $23, $24, $25, $26,
          $27, $28
        )
        RETURNING ${RETURNING_APPOINTMENT_COLUMNS}
      `,
      [
        appointment.id,
        appointment.leadId,
        appointment.providerId,
        appointment.requestedDate,
        appointment.requestedTime,
        appointment.scheduledStartAt,
        appointment.scheduledEndAt,
        appointment.durationMinutes,
        appointment.service,
        appointment.status,
        appointment.source,
        appointment.patientName,
        appointment.patientEmail,
        appointment.patientPhone,
        appointment.notes,
        appointment.calendarEventId,
        appointment.createdByUserId,
        appointment.createdByRole,
        appointment.createdVia,
        appointment.updatedByUserId,
        appointment.updatedByRole,
        appointment.updatedVia,
        appointment.cancelledByUserId,
        appointment.cancelledByRole,
        appointment.cancelledVia,
        appointment.cancellationReason,
        appointment.createdAt,
        appointment.updatedAt,
      ],
    );

    return rowToAppointment(result.rows[0]);
  }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    const client = await this.clientFactory();
    const result = await client.query<RelationalAppointmentRow>(
      `
        SELECT ${RETURNING_APPOINTMENT_COLUMNS}
        FROM ${RELATIONAL_APPOINTMENTS_TABLE_NAME}
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    return result.rows[0] ? rowToAppointment(result.rows[0]) : null;
  }

  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment> {
    const update = validateUpdateAppointmentInput(input);
    const assignments: string[] = [];
    const values: unknown[] = [];

    const addAssignment = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };

    if (update.providerId !== undefined) addAssignment("provider_id", update.providerId);
    if (update.requestedDate !== undefined) addAssignment("requested_date", update.requestedDate);
    if (update.requestedTime !== undefined) addAssignment("requested_time", update.requestedTime);
    if (update.scheduledStartAt !== undefined) addAssignment("scheduled_start_at", update.scheduledStartAt);
    if (update.scheduledEndAt !== undefined) addAssignment("scheduled_end_at", update.scheduledEndAt);
    if (update.durationMinutes !== undefined) addAssignment("duration_minutes", update.durationMinutes);
    if (update.service !== undefined) addAssignment("service", update.service);
    if (update.status !== undefined) addAssignment("status", update.status);
    if (update.patientName !== undefined) addAssignment("patient_name", update.patientName);
    if (update.patientEmail !== undefined) addAssignment("patient_email", update.patientEmail);
    if (update.patientPhone !== undefined) addAssignment("patient_phone", update.patientPhone);
    if (update.notes !== undefined) addAssignment("notes", update.notes);
    if (update.calendarEventId !== undefined) addAssignment("calendar_event_id", update.calendarEventId);
    if (update.cancellationReason !== undefined) addAssignment("cancellation_reason", update.cancellationReason);

    if (update.actor) {
      addAssignment("updated_by_user_id", update.actor.userId);
      addAssignment("updated_by_role", update.actor.role);
      addAssignment("updated_via", update.actor.via);

      if (update.status === "cancelled") {
        addAssignment("cancelled_by_user_id", update.actor.userId);
        addAssignment("cancelled_by_role", update.actor.role);
        addAssignment("cancelled_via", update.actor.via);
      }
    }

    assignments.push("updated_at = now()");
    values.push(id);

    const client = await this.clientFactory();
    const result = await client.query<RelationalAppointmentRow>(
      `
        UPDATE ${RELATIONAL_APPOINTMENTS_TABLE_NAME}
        SET ${assignments.join(", ")}
        WHERE id = $${values.length}
        RETURNING ${RETURNING_APPOINTMENT_COLUMNS}
      `,
      values,
    );

    if (!result.rows[0]) {
      throw new AppointmentNotFoundError(id);
    }

    return rowToAppointment(result.rows[0]);
  }

  async listProviderCapacityConflicts(search: AppointmentConflictSearch): Promise<Appointment[]> {
    const client = await this.clientFactory();
    const values: unknown[] = [search.providerId, search.startAt, search.endAt];
    const excludeClause = search.excludeAppointmentId ? `AND id <> $4` : "";
    if (search.excludeAppointmentId) values.push(search.excludeAppointmentId);

    const result = await client.query<RelationalAppointmentRow>(
      `
        SELECT ${RETURNING_APPOINTMENT_COLUMNS}
        FROM ${RELATIONAL_APPOINTMENTS_TABLE_NAME}
        WHERE provider_id = $1
          AND status = 'confirmed'
          AND scheduled_start_at < $3
          AND scheduled_end_at > $2
          ${excludeClause}
        ORDER BY scheduled_start_at ASC
      `,
      values,
    );

    return result.rows.map(rowToAppointment);
  }
}

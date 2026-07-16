import type { OperationalAppointmentSummary } from "./operational-daily-view.types";

type AppointmentReadRow = {
  id: string;
  patient_name: string | null;
  scheduled_start_at: string | Date | null;
  scheduled_end_at: string | Date | null;
  service: string | null;
  status: string | null;
};

type AppointmentReadClient = {
  query<T = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

async function createReadClient(): Promise<AppointmentReadClient> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Appointment read access requires DATABASE_URL or POSTGRES_URL.");
  }

  const pgModule = (await import("pg")) as unknown as {
    Client: new (config: {
      connectionString: string;
      ssl?: { rejectUnauthorized: boolean };
    }) => AppointmentReadClient;
  };

  return new pgModule.Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function toIsoString(value: string | Date | null): string | undefined {
  if (!value) return undefined;

  return value instanceof Date ? value.toISOString() : value;
}

function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function mapAppointmentRow(
  row: AppointmentReadRow,
): OperationalAppointmentSummary {
  return {
    id: row.id,
    patientName: normalize(row.patient_name) || "Paciente sin identificar",
    scheduledStartAt: toIsoString(row.scheduled_start_at),
    scheduledEndAt: toIsoString(row.scheduled_end_at),
    service: normalize(row.service) || "Consulta",
    status: normalize(row.status) || "unknown",
  };
}

/**
 * Read adapter for Operational Daily View.
 *
 * Responsibility:
 * - Read appointments for a clinic day.
 * - Transform persistence shape into operational DTO.
 *
 * Does NOT:
 * - update appointments;
 * - create appointments;
 * - apply domain rules.
 */
export async function listAppointmentsForOperationalDay(
  date: Date,
): Promise<OperationalAppointmentSummary[]> {
  const { start, end } = getDayRange(date);

  const client = await createReadClient();

  const result = await client.query<AppointmentReadRow>(
    `
      SELECT
        id,
        patient_name,
        scheduled_start_at,
        scheduled_end_at,
        service,
        status
      FROM appointments
      WHERE scheduled_start_at >= $1
        AND scheduled_start_at < $2
      ORDER BY scheduled_start_at ASC
    `,
    [start, end],
  );

  return result.rows.map(mapAppointmentRow);
}
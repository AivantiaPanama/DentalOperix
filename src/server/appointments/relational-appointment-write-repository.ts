import {
  createAppointmentEntity,
  validateUpdateAppointmentInput,
  type Appointment,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
} from "./appointment-domain";

import { AppointmentNotFoundError } from "./appointment-repository";

import type { AppointmentWriteRepository } from "./appointment-write-repository";

import {
  createPgClient,
  RELATIONAL_APPOINTMENTS_TABLE_NAME,
  RETURNING_APPOINTMENT_COLUMNS,
  rowToAppointment,
  type AppointmentPersistenceClient,
  type RelationalAppointmentRow,
} from "./relational-appointment-shared";

export class RelationalAppointmentWriteRepository
  implements AppointmentWriteRepository
{
  constructor(
    private readonly clientFactory: () => Promise<AppointmentPersistenceClient> =
      createPgClient,
  ) {}

  async createAppointment(
    input: CreateAppointmentInput,
  ): Promise<Appointment> {
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

  async updateAppointment(
    id: string,
    input: UpdateAppointmentInput,
  ): Promise<Appointment> {
    const update = validateUpdateAppointmentInput(input);
    const assignments: string[] = [];
    const values: unknown[] = [];

    const addAssignment = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };

    if (update.providerId !== undefined) {
      addAssignment("provider_id", update.providerId);
    }

    if (update.requestedDate !== undefined) {
      addAssignment("requested_date", update.requestedDate);
    }

    if (update.requestedTime !== undefined) {
      addAssignment("requested_time", update.requestedTime);
    }

    if (update.scheduledStartAt !== undefined) {
      addAssignment("scheduled_start_at", update.scheduledStartAt);
    }

    if (update.scheduledEndAt !== undefined) {
      addAssignment("scheduled_end_at", update.scheduledEndAt);
    }

    if (update.durationMinutes !== undefined) {
      addAssignment("duration_minutes", update.durationMinutes);
    }

    if (update.service !== undefined) {
      addAssignment("service", update.service);
    }

    if (update.status !== undefined) {
      addAssignment("status", update.status);
    }

    if (update.patientName !== undefined) {
      addAssignment("patient_name", update.patientName);
    }

    if (update.patientEmail !== undefined) {
      addAssignment("patient_email", update.patientEmail);
    }

    if (update.patientPhone !== undefined) {
      addAssignment("patient_phone", update.patientPhone);
    }

    if (update.notes !== undefined) {
      addAssignment("notes", update.notes);
    }

    if (update.calendarEventId !== undefined) {
      addAssignment("calendar_event_id", update.calendarEventId);
    }

    if (update.cancellationReason !== undefined) {
      addAssignment("cancellation_reason", update.cancellationReason);
    }

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
}
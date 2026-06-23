import { intervalsOverlap, statusConsumesProviderCapacity, type Appointment } from "./appointment-domain";
import type { AppointmentRepository } from "./appointment-repository";

export type AvailabilityCheckInput = {
  providerId: string;
  startAt: string;
  endAt: string;
  excludeAppointmentId?: string;
};

export type AvailabilityCheckResult = {
  available: boolean;
  providerId: string;
  startAt: string;
  endAt: string;
  conflicts: Appointment[];
};

export class AppointmentAvailabilityService {
  constructor(private readonly repository: Pick<AppointmentRepository, "listProviderCapacityConflicts">) {}

  async checkProviderAvailability(input: AvailabilityCheckInput): Promise<AvailabilityCheckResult> {
    const conflicts = await this.repository.listProviderCapacityConflicts(input);

    return {
      available: conflicts.length === 0,
      providerId: input.providerId,
      startAt: input.startAt,
      endAt: input.endAt,
      conflicts,
    };
  }
}

export function appointmentConflictsWithInterval(
  appointment: Appointment,
  interval: { providerId: string; startAt: string; endAt: string; excludeAppointmentId?: string },
): boolean {
  if (appointment.id === interval.excludeAppointmentId) return false;
  if (appointment.providerId !== interval.providerId) return false;
  if (!appointment.scheduledStartAt || !appointment.scheduledEndAt) return false;
  if (!statusConsumesProviderCapacity(appointment.status)) return false;

  return intervalsOverlap(
    { startAt: appointment.scheduledStartAt, endAt: appointment.scheduledEndAt },
    { startAt: interval.startAt, endAt: interval.endAt },
  );
}

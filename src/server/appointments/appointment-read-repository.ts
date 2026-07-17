import type { Appointment, AppointmentStatus } from "./appointment-domain";

export type AppointmentConflictSearch = {
  providerId: string;
  startAt: string;
  endAt: string;
  excludeAppointmentId?: string;
};

export type AppointmentDateRangeSearch = {
  startAt: string;
  endAt: string;
  providerId?: string;
  statuses?: readonly AppointmentStatus[];
};

export interface AppointmentReadRepository {
  findAppointmentById(id: string): Promise<Appointment | null>;

  listAppointmentsByDateRange(
    search: AppointmentDateRangeSearch,
  ): Promise<Appointment[]>;

  listProviderCapacityConflicts(
    search: AppointmentConflictSearch,
  ): Promise<Appointment[]>;
}

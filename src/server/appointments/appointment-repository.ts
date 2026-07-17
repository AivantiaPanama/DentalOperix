import type { AppointmentWriteRepository } from "./appointment-write-repository";

import type { AppointmentReadRepository } from "./appointment-read-repository";

export type {
  AppointmentConflictSearch,
  AppointmentDateRangeSearch,
} from "./appointment-read-repository";

export interface AppointmentRepository
  extends AppointmentReadRepository,
    AppointmentWriteRepository {}

export class AppointmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Appointment ${id} was not found.`);
    this.name = "AppointmentNotFoundError";
  }
}
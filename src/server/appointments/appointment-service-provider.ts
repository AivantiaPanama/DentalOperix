import { AppointmentService } from "./appointment-service";
import { AppointmentAvailabilityService } from "./availability-service";
import { RelationalAppointmentRepository } from "./relational-appointment-repository";
import type { AppointmentRepository } from "./appointment-repository";

/**
 * 61.2-06C Appointment Service Provider.
 *
 * Governance boundary:
 * - Provides Assistant Appointment Workflow access to the Appointment domain only.
 * - Does not route through Leads persistence and does not modify Leads Source of Truth.
 * - Tests may override the repository factory without changing production wiring.
 */
class AppointmentServiceProvider {
  private repositoryFactory: () => AppointmentRepository = () =>
    new RelationalAppointmentRepository();

  getAppointmentService(): AppointmentService {
    return new AppointmentService(this.repositoryFactory());
  }

  getAvailabilityService(): AppointmentAvailabilityService {
    return new AppointmentAvailabilityService(this.repositoryFactory());
  }

  setRepositoryFactoryForTesting(factory: () => AppointmentRepository) {
    this.repositoryFactory = factory;
  }

  resetForTesting() {
    this.repositoryFactory = () => new RelationalAppointmentRepository();
  }
}

export const appointmentServiceProvider = new AppointmentServiceProvider();

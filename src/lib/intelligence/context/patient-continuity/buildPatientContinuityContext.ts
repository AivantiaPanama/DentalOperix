import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import type { Appointment } from "@/lib/clinic-data";
import type { ClinicalReadAggregate } from "@/server/read-models/clinical-read-aggregate-service";
import type { IntelligenceContext } from "@/lib/intelligence/types";

export type PatientContinuityContext = IntelligenceContext & {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  metadata?: Record<string, unknown> & {
    latestAppointment?: Appointment;
    appointments?: Appointment[];
    appointmentCount?: number;
    nextAppointmentDate?: string;
    lastRelevantActivityDate?: string;
    treatmentPlanNames?: string[];
    latestClinicalOutcome?: string;
    notes?: string;
  };
};

export type PatientContinuityContextInput = {
  patientId: string;
  patientProfile?: PatientAdministrativeProfile;
  appointments?: Appointment[];
  clinicalAggregate?: ClinicalReadAggregate;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function parseDateValue(value: string | undefined | null): number | undefined {
  const numericValue = Date.parse(normalize(value));
  return Number.isNaN(numericValue) ? undefined : numericValue;
}

function parseAppointmentDate(appointment: Appointment): number | undefined {
  return parseDateValue(`${appointment.date}T${appointment.time}:00`);
}

function toAppointmentValue(value: unknown): Appointment | undefined {
  if (!value || typeof value !== "object") return undefined;
  const appointment = value as Partial<Appointment>;
  if (!appointment.id || !appointment.date || !appointment.time) return undefined;
  return appointment as Appointment;
}

export function buildPatientContinuityContext(
  input: PatientContinuityContextInput,
  now: Date = new Date(),
): PatientContinuityContext {
  const appointments = input.appointments ?? [];
  const clinicalAggregate = input.clinicalAggregate;
  const patientProfile = input.patientProfile;

  const sortedAppointments = [...appointments].sort((a, b) => {
    const left = parseAppointmentDate(a) ?? 0;
    const right = parseAppointmentDate(b) ?? 0;
    return right - left;
  });

  const latestAppointment = toAppointmentValue(sortedAppointments[0]) ?? undefined;
  const nextAppointment = [...appointments]
    .filter((appointment) => {
      const timestamp = parseAppointmentDate(appointment);
      return Boolean(timestamp && timestamp >= now.getTime());
    })
    .sort((a, b) => {
      const left = parseAppointmentDate(a) ?? 0;
      const right = parseAppointmentDate(b) ?? 0;
      return left - right;
    })[0];

  const treatmentPlanNames = (clinicalAggregate?.treatmentPlans ?? [])
    .map((plan) => normalize(plan.planName))
    .filter(Boolean);
  const latestClinicalOutcome = clinicalAggregate?.clinicalOutcomes?.[0]?.outcomeType;
  const activityTimestamps = [
    ...appointments.map((appointment) => parseAppointmentDate(appointment)),
    ...(clinicalAggregate?.treatmentPlans ?? []).map((plan) => parseDateValue(plan.startDate)),
    ...(clinicalAggregate?.clinicalOutcomes ?? []).map((outcome) => parseDateValue(outcome.recordedAt)),
  ].filter((value): value is number => value !== undefined);

  const lastRelevantActivityDate =
    activityTimestamps.length > 0 ? new Date(Math.max(...activityTimestamps)).toISOString() : undefined;

  const metadata = {
    latestAppointment,
    appointments,
    appointmentCount: appointments.length,
    nextAppointmentDate: nextAppointment ? `${nextAppointment.date}T${nextAppointment.time}:00` : undefined,
    lastRelevantActivityDate,
    treatmentPlanNames,
    latestClinicalOutcome: normalize(latestClinicalOutcome),
    notes: patientProfile?.notes
      ? `Patient operational context derived from existing read-model and appointment data. ${patientProfile.notes}`
      : "No operational continuity data available yet; this context is read-only and safe for future signal generation.",
  };

  const hasOperationalContext = Boolean(
    patientProfile || appointments.length > 0 || treatmentPlanNames.length > 0 || clinicalAggregate?.clinicalOutcomes?.length || clinicalAggregate?.treatmentPlans?.length,
  );

  return {
    entityType: "patient",
    entityId: input.patientId,
    state: hasOperationalContext ? "ready" : "incomplete",
    patientName: patientProfile?.displayName ?? "Paciente sin nombre",
    patientEmail: patientProfile?.email,
    patientPhone: patientProfile?.phone,
    metadata,
  };
}

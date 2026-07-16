export type OperationalAppointmentSummary = {
  id: string;
  patientName: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  service: string;
  status: string;
};

export type OperationalLeadSummary = {
  leadId: string;
  name: string;
  treatment?: string;
  status: string;
  priority?: string;
};

export type OperationalDailyView = {
  date: string;

  summary: {
    appointmentsCount: number;
    newLeadsCount: number;
  };

  appointments: OperationalAppointmentSummary[];

  newLeads: OperationalLeadSummary[];
};
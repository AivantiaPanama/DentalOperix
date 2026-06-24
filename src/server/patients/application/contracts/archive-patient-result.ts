export type ArchivePatientResult = {
  patientId: string;
  previousState: string;
  newState: string;
  archivedAt: Date;
};

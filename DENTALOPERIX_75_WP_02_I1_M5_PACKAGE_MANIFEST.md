# DentalOperix — WP-02 I1-M5 Package Manifest

## Package

DENTALOPERIX_75_WP_02_I1_M5_CLINICAL_NOTE_API_CONTRACTS_PACKAGE.zip

## Scope

Clinical Note API & Contracts.

## Added / Updated Files

### API

- `src/server/clinical-records/api/clinical-note-api-contracts.ts`
- `src/server/clinical-records/api/clinical-note-api-controller.ts`
- `src/server/clinical-records/api/index.ts`

### Routes

- `src/routes/api/clinical-records/$patientId/notes.ts`
- `src/routes/api/clinical-records/$patientId/notes/$noteId.ts`

### Application Layer

- `src/server/clinical-records/application/commands/get-clinical-note-command.ts`
- `src/server/clinical-records/application/commands/list-clinical-notes-by-patient-command.ts`
- `src/server/clinical-records/application/use-cases/get-clinical-note-use-case.ts`
- `src/server/clinical-records/application/use-cases/list-clinical-notes-by-patient-use-case.ts`
- `src/server/clinical-records/application/services/clinical-note-application-service.ts`
- `src/server/clinical-records/application/dto/clinical-note-application-results.ts`
- updated command indexes and mutation commands for route-level patient ownership checks

### Documentation

- `docs/implementation/75.0/WP-02/75.2.10_WP_02_I1_M5_CLINICAL_NOTE_API_CONTRACTS_REPORT.md`

## Not Included

- UI implementation
- test execution
- build execution
- TypeScript execution
- protected component modifications
- Leads / Patients / Appointments changes

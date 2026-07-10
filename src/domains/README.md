# Canonical Domain Source Structure

This directory is the canonical domain entrypoint introduced in Baseline 75.

To avoid breaking existing import paths in the Foundation Release, executable code remains in its certified runtime locations, especially `src/server/*`, `src/lib/*`, `src/components/*`, and `src/routes/*`.

Domain mappings:

- `src/domains/clinical-records` -> certified runtime assets in `src/server/clinical-records` and related clinical routes.
- `src/domains/patients` -> certified runtime assets in `src/server/patients` and `src/lib/patients`.
- `src/domains/leads` -> certified runtime assets in `src/server/leads` and lead-related routes.
- `src/domains/appointments` -> certified runtime assets in `src/server/appointments`.

Future work packages may migrate implementation files into these domain folders only through an approved architecture plan and import-safe refactor.

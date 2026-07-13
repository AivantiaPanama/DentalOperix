# Knowledge Registry

| ID | Knowledge statement | Authority / evidence | Status |
|---|---|---|---|
| KR-CA-001 | Commercial Demo is a presentation and composition layer. | PR-01–PR-03 implementation evidence and repository code. | Certified for edition |
| KR-CA-002 | The scenario identifier is `new-patient-acquisition`. | `src/data/commercialDemoFoundation.ts`. | Implemented |
| KR-CA-003 | The narrative contains Patient Journey, Clinic Journey and Commercial Evidence. | Foundation data contract and journey card. | Implemented |
| KR-CA-004 | `/commercial-demo` is the public entry point. | `src/routes/commercial-demo.tsx`. | Implemented |
| KR-CA-005 | The public page is composed from presentational components. | `src/components/commercial/`. | Implemented |
| KR-CA-006 | No new domain, API, persistence, migration, table or Source of Truth was introduced. | Approved restrictions and implementation evidence. | Preserved |
| KR-CA-007 | Protected product boundaries were not modified by the commercial increments. | PR-01–PR-03 reports. | Preserved |
| KR-CA-008 | Targeted tests and builds passed for PR-01–PR-03. | Copilot implementation evidence. | Verified evidence |
| KR-RB-001 | Institutional documents were synchronized during RB-01. | Publication Synchronization Report. | Verified |
| KR-RB-002 | Cross references and traceability were checked before assembly. | Editorial and Traceability Verification Reports. | Verified |

## Evidence location

Primary commercial implementation evidence is preserved at:

`docs/publication-engineering/RB-01/evidence/PR01_PR02_PR03_COPILOT_IMPLEMENTATION_EVIDENCE.md`

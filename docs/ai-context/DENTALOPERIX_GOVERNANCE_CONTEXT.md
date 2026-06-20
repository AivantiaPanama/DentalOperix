# DentalOperix Governance Context

Status: ACTIVE
Owner: Governance Guardian
Last updated: 2026-06-20

## Mandatory Proposal Sequence

Every initiative must include:

1. Architectural analysis.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Compatibility with certified architecture.
6. Implementation plan.
7. Explicit approval before code generation.

## Documentation Update Rule

Every implementation must update the relevant initiative document and, when applicable:

- `PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`
- `60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md`
- `FUTURE_IMPROVEMENTS_BACKLOG.md`
- `DEVELOPMENT_GOVERNANCE_PATTERNS.md`
- `IMPLEMENTATION_CHECKLIST.md`

## AI Governance Rule

No AI output is trusted by default. It must be reviewed before integration.

## Security Rule

Real `.env`, `.env.*`, `.env.relational.prod`, and `.env.cutover.prod` files must not be committed. Use examples only and rotate exposed credentials.

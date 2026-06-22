# RBAC Architecture Review V1.1

Document ID: `RBAC-ARCHITECTURE-REVIEW-V1.1`
Related Artifact: `docs/ai-outputs/CLAUDE/RBAC-MATRIX-V1.1.md`
Iteration: `61.1 - Users & RBAC Foundation`
Reviewer Role: Architect Principal / Technical Reviewer / Product Governance Guardian
Status: `APPROVED`
Date: 2026-06-21

## Review Result

```text
Functional Approval: PASS
Architecture Compatibility: PASS
Leads = Source of Truth: PASS
Program 57.x Compatibility: PASS
Ready for Documentation Propagation: YES
```

## Approved Architecture Findings

1. `lead.status.update`, `lead.notes.update`, and `lead.owner.reassign` are separate permissions.
2. `lead.create` remains denied for all user roles.
3. Lead creation remains exclusively tied to `BookingDialog -> processDentalLead -> /api/leads/create`.
4. Physical deletion of Leads is prohibited.
5. Physical deletion of Appointments is prohibited; cancellation is the terminal operation.
6. Physical deletion of Users is prohibited; deactivate/reactivate is the lifecycle model.
7. Patient Records are out of scope for 61.1.
8. RBAC is authorization-only and does not change persistence architecture.

## Protected Architecture Confirmation

The following architecture remains unchanged:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

The following rule remains unchanged:

```text
Leads = Source of Truth
```

## Open Items Preserved

1. Doctor <-> Patient Assignment Model.
2. Lead <-> Patient Relationship Model.
3. Retention / Soft Delete Policy.
4. Role Assignment Workflow.

## Decision

`RBAC-MATRIX-V1.1` is approved as the functional baseline for 61.1 and may be propagated to official DentalOperix governance documentation.

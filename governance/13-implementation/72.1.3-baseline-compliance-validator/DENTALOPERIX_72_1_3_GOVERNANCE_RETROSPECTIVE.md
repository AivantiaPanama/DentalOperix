---
document_id: DOX-72.1.3-RETRO
title: 72.1.3 I1 and R1 Governance Retrospective
version: 1.0
status: CLOSED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Governance Retrospective
---

# 72.1.3 Governance Retrospective - I1 and R1

## What Worked

- Small, controlled implementation packages reduced architectural risk.
- User-owned local evidence created a clear governance trail.
- TypeScript type checking detected an RBAC contract inconsistency before certification.
- The RBAC fix aligned consumers with the existing catalog instead of introducing undocumented permissions.

## What to Keep

- Mandatory architecture review before implementation.
- Mandatory evidence review before certification.
- Build, typecheck, and full suite validation before closure.
- No assistant-generated unit tests under the current project testing policy.

## What to Improve

- Consider adding a standard `typecheck` script in a future infrastructure/governance increment.
- Consider a future RBAC semantic review to determine whether `patients:create` should exist as a separate permission from `patients:update`. This is not part of 72.1.3-R1 and must not be introduced without formal review.

## Governance Lesson

A typed RBAC catalog is an effective boundary guard. Certification should require the code, tests, and typed governance contracts to agree.

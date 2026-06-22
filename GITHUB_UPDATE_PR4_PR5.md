# GitHub Update Instructions - 61.1 PR-4 Certification and PR-5 Readiness

## Branch Recommendation

```bash
git checkout -b chore/61.1-pr4-certification-pr5-readiness
```

## Files to Commit

```text
PR4_DASHBOARD_ROUTING_CHANGELOG.md
GITHUB_UPDATE_PR4_PR5.md
README_61.1_PACKAGE_V1.2.md
docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md
docs/implementation/61.1/61.1_CERTIFICATION_CHECKLIST.md
docs/implementation/61.1/61.1_IMPLEMENTATION_STATUS.md
docs/implementation/61.1/61.1_REQUIREMENTS_TRACEABILITY_MATRIX.md
docs/implementation/61.1/61.1_PR4_CERTIFICATION_REPORT.md
docs/implementation/61.1/61.1_PR5_VALIDATION_HARDENING_READINESS.md
```

## Suggested Commit

```bash
git add PR4_DASHBOARD_ROUTING_CHANGELOG.md \
  GITHUB_UPDATE_PR4_PR5.md \
  README_61.1_PACKAGE_V1.2.md \
  docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md \
  docs/implementation/61.1/61.1_CERTIFICATION_CHECKLIST.md \
  docs/implementation/61.1/61.1_IMPLEMENTATION_STATUS.md \
  docs/implementation/61.1/61.1_REQUIREMENTS_TRACEABILITY_MATRIX.md \
  docs/implementation/61.1/61.1_PR4_CERTIFICATION_REPORT.md \
  docs/implementation/61.1/61.1_PR5_VALIDATION_HARDENING_READINESS.md

git commit -m "certify 61.1 PR-4 dashboard routing and prepare PR-5"

git push -u origin chore/61.1-pr4-certification-pr5-readiness
```

## PR Title

```text
Certify 61.1 PR-4 Dashboard Routing and prepare PR-5 Validation & Hardening
```

## PR Summary

```text
- Certifies PR-4 Dashboard Routing based on successful local/Cursor validation.
- Updates the 61.1 handoff to set PR-5 Validation & Hardening as the current execution target.
- Adds PR-4 certification report.
- Adds PR-5 readiness document.
- Updates certification checklist, implementation status, and requirements traceability matrix.
- Preserves Leads = Source of Truth and all protected component boundaries.
```

## Governance Confirmation

```text
No protected components modified.
No Lead persistence changes introduced.
No Patient Management introduced.
No 61.2 Assistant Dashboard implementation introduced.
```

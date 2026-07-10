# GitHub Update Instructions - 61.1 PR-4 Certification and PR-5 Readiness

## Branch Recommendation

```bash
git checkout -b chore/61.1-pr4-certification-pr5-readiness
```

## Files to Commit

```text
PR4\_DASHBOARD\_ROUTING\_CHANGELOG.md
GITHUB\_UPDATE\_PR4\_PR5.md
README\_61.1\_PACKAGE\_V1.2.md
docs/ai-context/DENTALOPERIX\_NEW\_CHAT\_HANDOFF\_61\_1.md
docs/implementation/61.1/61.1\_CERTIFICATION\_CHECKLIST.md
docs/implementation/61.1/61.1\_IMPLEMENTATION\_STATUS.md
docs/implementation/61.1/61.1\_REQUIREMENTS\_TRACEABILITY\_MATRIX.md
docs/implementation/61.1/61.1\_PR4\_CERTIFICATION\_REPORT.md
docs/implementation/61.1/61.1\_PR5\_VALIDATION\_HARDENING\_READINESS.md
```

## Suggested Commit

```bash
git add PR4\_DASHBOARD\_ROUTING\_CHANGELOG.md \\
  GITHUB\_UPDATE\_PR4\_PR5.md \\
  README\_61.1\_PACKAGE\_V1.2.md \\
  docs/ai-context/DENTALOPERIX\_NEW\_CHAT\_HANDOFF\_61\_1.md \\
  docs/implementation/61.1/61.1\_CERTIFICATION\_CHECKLIST.md \\
  docs/implementation/61.1/61.1\_IMPLEMENTATION\_STATUS.md \\
  docs/implementation/61.1/61.1\_REQUIREMENTS\_TRACEABILITY\_MATRIX.md \\
  docs/implementation/61.1/61.1\_PR4\_CERTIFICATION\_REPORT.md \\
  docs/implementation/61.1/61.1\_PR5\_VALIDATION\_HARDENING\_READINESS.md

git commit -m "certify 61.1 PR-4 dashboard routing and prepare PR-5"

git push -u origin chore/61.1-pr4-certification-pr5-readiness
```

## PR Title

```text
Certify 61.1 PR-4 Dashboard Routing and prepare PR-5 Validation \& Hardening
```

## PR Summary

```text
- Certifies PR-4 Dashboard Routing based on successful local/Cursor validation.
- Updates the 61.1 handoff to set PR-5 Validation \& Hardening as the current execution target.
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


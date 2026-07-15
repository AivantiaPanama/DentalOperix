---
document_id: DOX-72.1.3-EVIDENCE
title: 72.1.3 Local Validation Evidence Summary
version: 1.0
status: ACCEPTED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Evidence Summary
---

# 72.1.3 Local Validation Evidence Summary

## Evidence Owner

Project owner executed all local validation commands.

## Final Validation Results

| Command            | Result |
| ------------------ | ------ |
| `npx tsc --noEmit` | PASS   |
| `npm run build`    | PASS   |
| `npm run test`     | PASS   |

## Final Suite Result

- Test Files: 135 passed / 135 total
- Tests: 583 passed / 583 total

## Notes

The test output includes expected stderr/stdout lines from tests that intentionally validate degraded-mode behavior, fallbacks, controlled failures, or mocked external service errors. Since the final suite result is PASS, those log lines are not treated as certification blockers.

## Evidence Files

- `72_1_3_INITIAL_BUILD_AND_TYPECHECK_EVIDENCE.txt`
- `72_1_3_INTERMEDIATE_TEST_EVIDENCE_BEFORE_ASSERT_UPDATE.txt`
- `72_1_3_FINAL_TEST_EVIDENCE_135_FILES_583_TESTS_PASS.txt`

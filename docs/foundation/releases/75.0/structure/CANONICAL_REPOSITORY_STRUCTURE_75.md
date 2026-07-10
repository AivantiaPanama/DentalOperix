# Canonical Repository Structure — Baseline 75

**Baseline:** DENTALOPERIX_BASELINE_75_WP02_CERTIFIED  
**Status:** ACTIVE FOUNDATION STRUCTURE

## Root

The repository root is reserved for active project entry points, package configuration, runtime configuration examples and primary directories.

Expected root-level assets include:

```text
README.md
package.json
package-lock.json
tsconfig.json
vite.config.ts
server.js
src/
docs/
governance/
scripts/
supabase/
```

Historical manifests, old package summaries, previous update reports and superseded evidence should not remain at root.

## Documentation

```text
docs/
├── foundation-release/
│   └── 75.0/
├── reference-implementations/
├── historical-governance/
├── adr/
├── architecture/
├── governance/
├── implementation/
├── registries/
└── validation/
```

## Foundation Release

```text
docs/foundation-release/75.0/
├── 75.1_REPOSITORY_AUDIT_REPORT.md
├── 75.2_REPOSITORY_CONSOLIDATION_REPORT.md
├── 75.3_WP_02_CLOSURE_AND_KNOWLEDGE_CERTIFICATION_PACKAGE.md
├── BASELINE_MANIFEST_75.md
├── FOUNDATION_DASHBOARD.md
├── FOUNDATION_MANIFEST.md
├── FOUNDATION_RELEASE_NOTES.md
├── VALIDATION_EVIDENCE_TEMPLATE.md
├── evidence/
└── structure/
```

## Historical Governance

```text
docs/historical-governance/
├── root-artifacts/
└── baselines/
```

This area preserves previous program artifacts for traceability without cluttering the active root.

## Source Code

No source code was moved as part of this structural update. Existing application paths remain under:

```text
src/
supabase/
scripts/
governance/
```

## Rule

A future baseline must keep the repository root operationally clean and place governance, historical and certification artifacts under `docs/` unless they are active runtime or package entry points.

# 75 Canonical Structure Enforcement Report

## Status

APPLIED

## Reason

The prior structured ZIP preserved many historical folders but did not fully implement the canonical structure proposed for the Foundation Release.

## Canonical structure enforced

```text
/docs
    /foundation
    /governance
    /architecture
    /knowledge
    /reference-implementations
    /work-packages

/src
    /domains
    /shared
    /platform

/tools
    /foundation-release-builder
    /governance
```

## Scope of changes

- Foundation Release evidence moved under `docs/foundation/releases/75.0`.
- Registry assets moved under `docs/knowledge/registries`.
- Product architecture moved under `docs/architecture/product`.
- ADR assets moved under `docs/architecture/adr`.
- Engineering governance framework moved under `docs/governance/framework`.
- Canonical `src/domains`, `src/shared`, and `src/platform` folders created without moving certified runtime code.
- Canonical `tools/foundation-release-builder` and `tools/governance` folders created.

## Governance note

Runtime source code was not physically migrated into `src/domains`, `src/shared`, or `src/platform` because doing so would require an import-safe refactor, build validation, and explicit approval. Baseline 75 establishes the canonical target structure while preserving certified runtime compatibility.

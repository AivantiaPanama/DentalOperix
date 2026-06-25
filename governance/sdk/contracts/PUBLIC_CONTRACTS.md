# Governance SDK Public Contracts

Status: ACTIVE / AUTHORIZED FOR IMPLEMENTATION

## IValidator

Runs a validation against a ValidationContext and returns one or more ValidationResult records.

## IValidationEngine

Coordinates validator execution and produces a ValidationReport.

## IReportGenerator

Transforms validation results into governance reports.

## IEvidenceProvider

Creates evidence references for audit-ready output.

## IRegistryProvider

Reads governance registries in a controlled, read-only manner.

## IComplianceRule

Represents a versioned compliance rule used by validators.

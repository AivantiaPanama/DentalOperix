# DentalOperix 72.1.3-I1 - Domain Foundation Implementation Notes

## Scope

This package introduces the domain foundation for the Baseline Compliance Validator.

Included:

- BaselineDescriptor
- ComplianceRule
- RuleResult
- ComplianceReport
- GovernanceDecision
- BaselineRepositoryPort
- ComplianceRuleRegistryPort
- ValidationEnginePort
- ComplianceReportExporterPort

Not included:

- Infrastructure adapters
- Manifest loaders
- Rule registry implementation
- Validation orchestration
- Report generation implementation
- Unit tests

## Governance Constraints

This package is read-only and isolated to `src/governance/baseline`.

It does not modify:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

It does not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth
- Persistence re-architecture
- Functional architecture changes

## Baseline Compatibility

Target baseline:

- DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE

Documentation package:

- DENTALOPERIX_72_1_2_DOCUMENTATION_AUDITED_UPDATED_PACKAGE.zip

## Testing Policy

No unit tests are generated or required in this implementation package. Test execution remains user-owned according to the active DentalOperix governance policy.

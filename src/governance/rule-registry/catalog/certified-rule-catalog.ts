import type { RuleDefinition } from "../domain";

const baseline71_5 = "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE";
const ruleVersion = {
  value: "1.0.0",
  compatibleBaselineVersions: [baseline71_5],
} as const;

export const CERTIFIED_RULE_CATALOG: readonly RuleDefinition[] = [
  {
    identifier: { value: "ARCH-001", version: "1.0.0" },
    name: "Certified Architecture Boundary Preservation",
    description: "Validates that certified functional architectures remain isolated from governance implementation work.",
    objective: "Prevent governance platform increments from modifying certified Leads, Patients, Appointment, Calendar, Gmail, or UI boundaries.",
    category: "architecture",
    severity: "critical",
    lifecycleStatus: "certified",
    version: ruleVersion,
    evaluationCriteria: {
      summary: "No protected architecture boundary is modified by the governance increment.",
      expectedResult: "PASS when no protected runtime boundary is changed.",
    },
    requiredEvidence: ["Architecture Conformance Review", "Protected Components Validation"],
    dependencies: [],
  },
  {
    identifier: { value: "BOUNDARY-001", version: "1.0.0" },
    name: "Governance Isolation Boundary",
    description: "Validates that governance modules do not import or depend on functional runtime modules.",
    objective: "Preserve governance platform isolation from clinical and acquisition runtime behavior.",
    category: "boundaries",
    severity: "critical",
    lifecycleStatus: "certified",
    version: ruleVersion,
    evaluationCriteria: {
      summary: "Governance modules remain under src/governance and avoid functional runtime imports.",
      expectedResult: "PASS when governance code references only governance contracts and TypeScript primitives.",
    },
    requiredEvidence: ["Boundary Guard Evidence", "TypeScript Import Review"],
    dependencies: [{ value: "ARCH-001", version: "1.0.0" }],
  },
  {
    identifier: { value: "PERSIST-001", version: "1.0.0" },
    name: "No Persistence Re-Architecture",
    description: "Validates that the increment does not introduce persistence adapters, database writes, or new storage ownership.",
    objective: "Protect certified persistence architecture and avoid new source-of-truth behavior.",
    category: "persistence",
    severity: "critical",
    lifecycleStatus: "certified",
    version: ruleVersion,
    evaluationCriteria: {
      summary: "No database schema, adapter, provider, or persistence ownership is changed.",
      expectedResult: "PASS when the increment is read-only or in-memory only.",
    },
    requiredEvidence: ["Persistence Impact Review", "Implementation Scope Review"],
    dependencies: [{ value: "ARCH-001", version: "1.0.0" }],
  },
  {
    identifier: { value: "SOT-001", version: "1.0.0" },
    name: "Sources of Truth Preservation",
    description: "Validates that Leads, Patients, and Appointments sources of truth remain unchanged.",
    objective: "Prevent dual-write, lead replacement, or new source-of-truth introduction.",
    category: "sources-of-truth",
    severity: "critical",
    lifecycleStatus: "certified",
    version: ruleVersion,
    evaluationCriteria: {
      summary: "No source-of-truth ownership changes are introduced.",
      expectedResult: "PASS when certified ownership boundaries remain unchanged.",
    },
    requiredEvidence: ["Sources of Truth Review", "Governance Validation"],
    dependencies: [{ value: "PERSIST-001", version: "1.0.0" }],
  },
  {
    identifier: { value: "GOV-001", version: "1.0.0" },
    name: "Governance Evidence Traceability",
    description: "Validates that implementation packages include traceable documentation and evidence artifacts.",
    objective: "Ensure each increment remains auditable under DGF, GPS, GPRA, and GARB governance.",
    category: "governance",
    severity: "high",
    lifecycleStatus: "certified",
    version: ruleVersion,
    evaluationCriteria: {
      summary: "Package includes implementation report, manifest, and certification evidence references.",
      expectedResult: "PASS when artifacts identify scope, baseline, constraints, and validation evidence.",
    },
    requiredEvidence: ["Implementation Report", "Package Manifest", "Validation Evidence"],
    dependencies: [],
  },
] as const;

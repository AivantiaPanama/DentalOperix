import { beforeEach, describe, expect, it, vi } from "vitest";
import { getReadModelSource } from "./read-model-source-provider";
import { listLeadOperationsProfiles } from "@/server/leads/operations-repository";
import { listPatientAdministrativeProfiles } from "@/server/patients/admin-repository";
import { readWorksheetReadModels } from "@/server/read-models/worksheet-read-models";
import { buildPatientAggregatesFromReadModels } from "@/server/read-models/patient-aggregate-read-service";
import { buildCrmReadAggregatesFromReadModels } from "@/server/read-models/crm-read-aggregate-service";
import { buildBillingReadAggregatesFromReadModels } from "@/server/read-models/billing-read-aggregate-service";
import { buildClinicalReadAggregatesFromReadModels } from "@/server/read-models/clinical-read-aggregate-service";
import { buildOperationsReadAggregateFromReadModels } from "@/server/read-models/operations-read-aggregate-service";
import { buildFinanceReadAggregateFromReadModels } from "@/server/read-models/finance-read-aggregate-service";
import { buildInventoryReadAggregateFromReadModels } from "@/server/read-models/inventory-read-aggregate-service";
import { readObservabilityProvider, type ReadObservabilityEvent } from "./read-observability-provider";

vi.mock("@/server/leads/operations-repository", () => ({
  listLeadOperationsProfiles: vi.fn(),
}));

vi.mock("@/server/patients/admin-repository", () => ({
  listPatientAdministrativeProfiles: vi.fn(),
}));

vi.mock("@/server/read-models/worksheet-read-models", () => ({
  readWorksheetReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/patient-aggregate-read-service", () => ({
  buildPatientAggregatesFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/crm-read-aggregate-service", () => ({
  buildCrmReadAggregatesFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/billing-read-aggregate-service", () => ({
  buildBillingReadAggregatesFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/clinical-read-aggregate-service", () => ({
  buildClinicalReadAggregatesFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/operations-read-aggregate-service", () => ({
  buildOperationsReadAggregateFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/finance-read-aggregate-service", () => ({
  buildFinanceReadAggregateFromReadModels: vi.fn(),
}));

vi.mock("@/server/read-models/inventory-read-aggregate-service", () => ({
  buildInventoryReadAggregateFromReadModels: vi.fn(),
}));

const readModels = {
  patients: [{ patientId: "PAT-001" }],
  identifiers: [{ patientId: "PAT-001", type: "CID", value: "8-123-456" }],
  contacts: [],
  administrativeProfiles: [],
  treatmentInterests: [],
  crmFolios: [],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
  products: [],
  consumables: [],
  stockLevels: [],
  warehouses: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  readObservabilityProvider.clearBufferedEvents();
  readObservabilityProvider.setSink(undefined);

  vi.mocked(listLeadOperationsProfiles).mockResolvedValue([{ leadId: "lead-1" }] as never);
  vi.mocked(listPatientAdministrativeProfiles).mockResolvedValue([{ id: "legacy-patient" }] as never);
  vi.mocked(readWorksheetReadModels).mockResolvedValue(readModels as never);
  vi.mocked(buildClinicalReadAggregatesFromReadModels).mockReturnValue({
    clinicalAggregates: [{ patientId: "read-model-patient", treatmentPlans: [], treatmentStages: [], clinicalOutcomes: [] }],
    diagnostics: {
      totalPatients: 1,
      totalTreatmentPlans: 0,
      totalTreatmentStages: 0,
      totalClinicalOutcomes: 0,
      patientsWithTreatmentPlans: 0,
      patientsWithTreatmentStages: 0,
      patientsWithClinicalOutcomes: 0,
      orphanTreatmentPlans: 0,
      orphanTreatmentStages: 0,
      orphanClinicalOutcomes: 0,
      incompleteTreatmentPlans: 0,
      incompleteTreatmentStages: 0,
      incompleteClinicalOutcomes: 0,
    },
  } as never);
  vi.mocked(buildPatientAggregatesFromReadModels).mockReturnValue({
    patients: [{ id: "patient-1", resolvedIdentity: { documentType: "CID", value: "8-123-456" } }],
    administrativeProfiles: [{ id: "patient-1", fullName: "Paciente Uno" }],
    diagnostics: {
      totalPatients: 1,
      totalIdentifiers: 1,
      patientsWithExplicitIdentity: 1,
      patientsWithTemporaryIdentity: 0,
      duplicateResolvedIdentities: [],
    },
  } as never);
  vi.mocked(buildCrmReadAggregatesFromReadModels).mockReturnValue({
    crmAggregates: [{ patientId: "PAT-001", treatmentInterests: [], crmFolios: [] }],
    diagnostics: {
      totalPatients: 1,
      totalTreatmentInterests: 0,
      totalCrmFolios: 0,
      patientsWithTreatmentInterests: 0,
      patientsWithCrmFolios: 0,
      orphanTreatmentInterests: 0,
      orphanCrmFolios: 0,
    },
  } as never);
  vi.mocked(buildBillingReadAggregatesFromReadModels).mockReturnValue({
    billingAggregates: [{ patientId: "PAT-001", billingProfiles: [] }],
    diagnostics: {
      totalPatients: 1,
      totalBillingProfiles: 0,
      patientsWithBillingProfiles: 0,
      orphanBillingProfiles: 0,
      incompleteBillingProfiles: 0,
    },
  } as never);
  vi.mocked(buildOperationsReadAggregateFromReadModels).mockReturnValue({
    operationsAggregate: { automationRuns: [], operationalKpis: [], workflowExecutionStatus: [] },
    diagnostics: {
      totalAutomationRuns: 0,
      totalOperationalKpis: 0,
      totalWorkflowExecutionStatus: 0,
      usableAutomationRuns: 0,
      usableOperationalKpis: 0,
      usableWorkflowExecutionStatus: 0,
      incompleteAutomationRuns: 0,
      incompleteOperationalKpis: 0,
      incompleteWorkflowExecutionStatus: 0,
    },
  } as never);
  vi.mocked(buildFinanceReadAggregateFromReadModels).mockReturnValue({
    financeAggregate: { invoices: [], payments: [], collections: [], financialKpis: [] },
    diagnostics: {
      totalInvoices: 0,
      totalPayments: 0,
      totalCollections: 0,
      totalFinancialKpis: 0,
      usableInvoices: 0,
      usablePayments: 0,
      usableCollections: 0,
      usableFinancialKpis: 0,
      incompleteInvoices: 0,
      incompletePayments: 0,
      incompleteCollections: 0,
      incompleteFinancialKpis: 0,
    },
  } as never);

  vi.mocked(buildInventoryReadAggregateFromReadModels).mockReturnValue({
    inventoryAggregate: { products: [], consumables: [], stockLevels: [], warehouses: [] },
    diagnostics: {
      totalProducts: 0,
      totalConsumables: 0,
      totalStockLevels: 0,
      totalWarehouses: 0,
      usableProducts: 0,
      usableConsumables: 0,
      usableStockLevels: 0,
      usableWarehouses: 0,
      incompleteProducts: 0,
      incompleteConsumables: 0,
      incompleteStockLevels: 0,
      incompleteWarehouses: 0,
    },
  } as never);

});

describe("read observability hardening", () => {
  it("emits standardized read and domain telemetry for Patient, CRM, Billing, Clinical, Operations, Finance, Inventory, and Support", async () => {
    await getReadModelSource({ consumerName: "Governance Runtime" });

    const events = readObservabilityProvider.getBufferedEvents();
    const readEvents = events.filter((event) => event.type === "read");
    const domainEvents = events.filter((event) => event.type === "domain");

    expect(readEvents).toHaveLength(8);
    expect(domainEvents).toHaveLength(8);
    expect(readEvents.map((event) => event.domain).sort()).toEqual(["Billing", "CRM", "Clinical", "Finance", "Inventory", "Operations", "Patient", "Support"]);
    expect(domainEvents.map((event) => event.domain).sort()).toEqual(["Billing", "CRM", "Clinical", "Finance", "Inventory", "Operations", "Patient", "Support"]);
    expect(readEvents.every((event) => event.source === "ReadModel" && event.recordCount >= 0)).toBe(true);
    expect(domainEvents.every((event) => event.source === "ReadModel" && event.healthy)).toBe(true);
  });

  it("keeps telemetry failures best-effort during full source resolution", async () => {
    const sink = vi.fn((event: ReadObservabilityEvent) => {
      if (event.type === "aggregate" || event.type === "domain") {
        throw new Error("observability sink unavailable");
      }
    });
    readObservabilityProvider.setSink(sink);

    await expect(getReadModelSource({ consumerName: "Patient Management" })).resolves.toMatchObject({
      mode: "read-model",
      patients: [{ id: "patient-1", fullName: "Paciente Uno" }],
    });

    expect(sink).toHaveBeenCalled();
    expect(readObservabilityProvider.getBufferedEvents().length).toBeGreaterThanOrEqual(9);
  });

  it("emits fallback telemetry without leaking diagnostics into public patients", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(null as never);

    const source = await getReadModelSource({ consumerName: "Patient Management" });
    const events = readObservabilityProvider.getBufferedEvents();
    const fallbackEvents = events.filter((event) => event.type === "fallback");
    const serializedPatients = JSON.stringify(source.patients);

    expect(source.mode).toBe("legacy-leads");
    expect(fallbackEvents).toHaveLength(8);
    expect(fallbackEvents.every((event) => event.reason === "read-model-unavailable")).toBe(true);
    expect(serializedPatients).not.toContain("resolvedIdentity");
    expect(serializedPatients).not.toContain("diagnostics");
  });
});

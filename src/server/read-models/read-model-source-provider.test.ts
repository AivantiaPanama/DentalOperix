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
import { readObservabilityProvider } from "@/server/read-models/read-observability-provider";

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

const leadOperations = [{ leadId: "lead-1" }];
const legacyPatients = [{ id: "legacy-patient" }];
const readModelPatients = [{ id: "read-model-patient" }];
const readModels = {
  patients: [{ patientId: "PAT-001" }],
  identifiers: [],
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
  vi.mocked(listLeadOperationsProfiles).mockResolvedValue(leadOperations as never);
  vi.mocked(listPatientAdministrativeProfiles).mockResolvedValue(legacyPatients as never);
  vi.mocked(buildCrmReadAggregatesFromReadModels).mockReturnValue({
    crmAggregates: [{ patientId: "read-model-patient", treatmentInterests: [], crmFolios: [] }],
    diagnostics: { totalPatients: 1, totalTreatmentInterests: 0, totalCrmFolios: 0, patientsWithTreatmentInterests: 0, patientsWithCrmFolios: 0, orphanTreatmentInterests: 0, orphanCrmFolios: 0 },
  } as never);
  vi.mocked(buildBillingReadAggregatesFromReadModels).mockReturnValue({
    billingAggregates: [{ patientId: "read-model-patient", billingProfiles: [] }],
    diagnostics: { totalPatients: 1, totalBillingProfiles: 0, patientsWithBillingProfiles: 0, orphanBillingProfiles: 0, incompleteBillingProfiles: 0 },
  } as never);
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

  vi.mocked(buildPatientAggregatesFromReadModels).mockReturnValue({
    patients: [{ ...readModelPatients[0], resolvedIdentity: { documentType: "TMP-PAT" } }],
    administrativeProfiles: readModelPatients,
    diagnostics: {
      totalPatients: 1,
      totalIdentifiers: 0,
      patientsWithExplicitIdentity: 0,
      patientsWithTemporaryIdentity: 1,
      duplicateResolvedIdentities: [],
    },
  } as never);
});

describe("read model source provider", () => {
  it("uses read model patients when worksheet read models are available", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(readModels as never);

    const source = await getReadModelSource({ consumerName: "Test Consumer" });

    expect(source.mode).toBe("read-model");
    expect(source.patients).toBe(readModelPatients);
    expect(source.leadOperations).toBe(leadOperations);
    expect(source.diagnostics.usedReadModel).toBe(true);
    expect(source.diagnostics.checkedReadModelPatients).toBe(1);
    expect(source.diagnostics.patientAggregateDiagnostics?.patientsWithTemporaryIdentity).toBe(1);
    expect(source.crmAggregates).toHaveLength(1);
    expect(source.billingAggregates).toHaveLength(1);
    expect(source.operationsAggregate).toEqual({ automationRuns: [], operationalKpis: [], workflowExecutionStatus: [] });
    expect(source.diagnostics.crmAggregateDiagnostics).toMatchObject({ totalPatients: 1 });
    expect(source.diagnostics.billingAggregateDiagnostics).toMatchObject({ totalPatients: 1 });
    expect(listPatientAdministrativeProfiles).not.toHaveBeenCalled();
  });



  it("emits read, aggregate, and domain telemetry when read models are used", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(readModels as never);

    await getReadModelSource({ consumerName: "Patient Management" });

    const events = readObservabilityProvider.getBufferedEvents();
    expect(events.filter((event) => event.type === "aggregate")).toHaveLength(8);
    expect(events.filter((event) => event.type === "read")).toHaveLength(8);
    expect(events.filter((event) => event.type === "domain")).toHaveLength(8);
    expect(events.find((event) => event.type === "aggregate" && event.domain === "Patient")).toMatchObject({
      aggregate: "PatientAggregateReadService",
      recordCount: 1,
    });
  });

  it("emits fallback telemetry for each domain when read models are unavailable", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(null);

    await getReadModelSource({ consumerName: "Patient Management" });

    const fallbackEvents = readObservabilityProvider
      .getBufferedEvents()
      .filter((event) => event.type === "fallback");

    expect(fallbackEvents).toHaveLength(8);
    expect(fallbackEvents.map((event) => event.domain).sort()).toEqual(["Billing", "CRM", "Clinical", "Finance", "Inventory", "Operations", "Patient", "Support"]);
    expect(fallbackEvents.every((event) => event.type === "fallback" && event.reason === "read-model-unavailable")).toBe(true);
  });

  it("keeps aggregate diagnostics internal while exposing only administrative profile patients", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(readModels as never);

    const source = await getReadModelSource({ consumerName: "Patient Management" });

    expect(source.patients).toEqual(readModelPatients);
    expect(JSON.stringify(source.patients)).not.toContain("resolvedIdentity");
    expect(source.diagnostics.patientAggregateDiagnostics).toMatchObject({
      totalPatients: 1,
      patientsWithTemporaryIdentity: 1,
    });
  });

  it("falls back explicitly when worksheet read models contain no patients", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue({ ...readModels, patients: [] } as never);

    const source = await getReadModelSource({ consumerName: "Patient Management" });

    expect(source.mode).toBe("legacy-leads");
    expect(source.patients).toBe(legacyPatients);
    expect(source.diagnostics).toMatchObject({
      usedReadModel: false,
      fallbackReason: "read-model-unavailable",
      checkedReadModelPatients: 0,
    });
    expect(buildPatientAggregatesFromReadModels).not.toHaveBeenCalled();
    expect(buildCrmReadAggregatesFromReadModels).not.toHaveBeenCalled();
    expect(buildBillingReadAggregatesFromReadModels).not.toHaveBeenCalled();
    expect(buildClinicalReadAggregatesFromReadModels).not.toHaveBeenCalled();
    expect(buildOperationsReadAggregateFromReadModels).not.toHaveBeenCalled();
    expect(buildFinanceReadAggregateFromReadModels).not.toHaveBeenCalled();
    expect(buildInventoryReadAggregateFromReadModels).not.toHaveBeenCalled();
  });

  it("falls back to legacy Leads patients when read models are unavailable", async () => {
    vi.mocked(readWorksheetReadModels).mockResolvedValue(null);

    const source = await getReadModelSource({ consumerName: "Test Consumer" });

    expect(source.mode).toBe("legacy-leads");
    expect(source.patients).toBe(legacyPatients);
    expect(source.leadOperations).toBe(leadOperations);
    expect(source.diagnostics.usedReadModel).toBe(false);
    expect(source.diagnostics.fallbackReason).toBe("read-model-unavailable");
  });

  it("falls back to legacy Leads patients when read model access fails", async () => {
    vi.mocked(readWorksheetReadModels).mockRejectedValue(new Error("sheet unavailable"));

    const source = await getReadModelSource({ consumerName: "Test Consumer" });

    expect(source.mode).toBe("legacy-leads");
    expect(source.patients).toBe(legacyPatients);
    expect(source.diagnostics.fallbackReason).toBe("read-model-error");
  });
});

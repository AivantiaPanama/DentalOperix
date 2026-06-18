import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import {
  listLeadOperationsProfiles,
  type LeadOperationsProfile,
} from "@/server/leads/operations-repository";
import { listPatientAdministrativeProfiles } from "@/server/patients/admin-repository";
import {
  buildPatientAggregatesFromReadModels,
  type PatientAggregateReadDiagnostics,
} from "@/server/read-models/patient-aggregate-read-service";
import { readWorksheetReadModels } from "@/server/read-models/worksheet-read-models";
import {
  buildCrmReadAggregatesFromReadModels,
  type CrmReadAggregate,
  type CrmReadAggregateDiagnostics,
} from "@/server/read-models/crm-read-aggregate-service";
import {
  buildBillingReadAggregatesFromReadModels,
  type BillingReadAggregate,
  type BillingReadAggregateDiagnostics,
} from "@/server/read-models/billing-read-aggregate-service";
import { readObservabilityProvider } from "@/server/read-models/read-observability-provider";
import {
  buildClinicalReadAggregatesFromReadModels,
  type ClinicalReadAggregate,
  type ClinicalReadAggregateDiagnostics,
} from "@/server/read-models/clinical-read-aggregate-service";
import {
  buildOperationsReadAggregateFromReadModels,
  type OperationsReadAggregate,
  type OperationsReadAggregateDiagnostics,
} from "@/server/read-models/operations-read-aggregate-service";
import {
  buildFinanceReadAggregateFromReadModels,
  type FinanceReadAggregate,
  type FinanceReadAggregateDiagnostics,
} from "@/server/read-models/finance-read-aggregate-service";
import {
  buildInventoryReadAggregateFromReadModels,
  type InventoryReadAggregate,
  type InventoryReadAggregateDiagnostics,
} from "@/server/read-models/inventory-read-aggregate-service";
import {
  buildSupportReadAggregateFromReadModels,
  type SupportReadAggregate,
  type SupportReadAggregateDiagnostics,
} from "@/server/read-models/support-read-aggregate-service";

export type ReadModelSourceMode = "read-model" | "legacy-leads";

export type ReadModelSourceDiagnostics = {
  usedReadModel: boolean;
  fallbackReason?: "read-model-unavailable" | "read-model-error";
  checkedReadModelPatients: number;
  patientAggregateDiagnostics?: PatientAggregateReadDiagnostics;
  crmAggregateDiagnostics?: CrmReadAggregateDiagnostics;
  billingAggregateDiagnostics?: BillingReadAggregateDiagnostics;
  clinicalAggregateDiagnostics?: ClinicalReadAggregateDiagnostics;
  operationsAggregateDiagnostics?: OperationsReadAggregateDiagnostics;
  financeAggregateDiagnostics?: FinanceReadAggregateDiagnostics;
  inventoryAggregateDiagnostics?: InventoryReadAggregateDiagnostics;
  supportAggregateDiagnostics?: SupportReadAggregateDiagnostics;
};

export type ReadModelSource = {
  mode: ReadModelSourceMode;
  patients: PatientAdministrativeProfile[];
  leadOperations: LeadOperationsProfile[];
  crmAggregates: CrmReadAggregate[];
  billingAggregates: BillingReadAggregate[];
  clinicalAggregates: ClinicalReadAggregate[];
  operationsAggregate: OperationsReadAggregate;
  financeAggregate: FinanceReadAggregate;
  inventoryAggregate: InventoryReadAggregate;
  supportAggregate: SupportReadAggregate;
  diagnostics: ReadModelSourceDiagnostics;
};

type GetReadModelSourceOptions = {
  consumerName: string;
};

function trackDomainTelemetry(
  consumerName: string,
  mode: ReadModelSourceMode,
  counts: { patients: number; crm: number; billing: number; clinical: number; operations: number; finance: number; inventory: number; support: number },
) {
  const source = mode === "read-model" ? "ReadModel" : "LeadProjection";

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Patient",
    aggregate: "PatientAggregateReadService",
    source,
    recordCount: counts.patients,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Patient",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "CRM",
    aggregate: "CRMReadAggregateService",
    source,
    recordCount: counts.crm,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "CRM",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Billing",
    aggregate: "BillingReadAggregateService",
    source,
    recordCount: counts.billing,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Billing",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Clinical",
    aggregate: "ClinicalAggregateReadService",
    source,
    recordCount: counts.clinical,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Clinical",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Operations",
    aggregate: "OperationsAggregateReadService",
    source,
    recordCount: counts.operations,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Operations",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Finance",
    aggregate: "FinanceAggregateReadService",
    source,
    recordCount: counts.finance,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Finance",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Inventory",
    aggregate: "InventoryAggregateReadService",
    source,
    recordCount: counts.inventory,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Inventory",
    healthy: true,
    source,
  });

  readObservabilityProvider.trackRead({
    consumerName,
    domain: "Support",
    aggregate: "SupportAggregateReadService",
    source,
    recordCount: counts.support,
  });
  readObservabilityProvider.trackDomain({
    consumerName,
    domain: "Support",
    healthy: true,
    source,
  });
}

async function getLegacyLeadsSource(
  leadOperationsPromise: Promise<LeadOperationsProfile[]>,
  fallbackReason: ReadModelSourceDiagnostics["fallbackReason"],
  consumerName: string,
): Promise<ReadModelSource> {
  const [patients, leadOperations] = await Promise.all([
    listPatientAdministrativeProfiles(),
    leadOperationsPromise,
  ]);

  const reason = fallbackReason ?? "read-model-unavailable";
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Patient",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "CRM",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Billing",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Clinical",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Operations",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Finance",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Inventory",
    aggregate: "ReadModelSourceProvider",
    reason,
  });
  readObservabilityProvider.trackFallback({
    consumerName,
    domain: "Support",
    aggregate: "ReadModelSourceProvider",
    reason,
  });

  trackDomainTelemetry(consumerName, "legacy-leads", {
    patients: patients.length,
    crm: 0,
    billing: 0,
    clinical: 0,
    operations: 0,
    finance: 0,
    inventory: 0,
    support: 0,
  });

  return {
    mode: "legacy-leads",
    patients,
    leadOperations,
    crmAggregates: [],
    billingAggregates: [],
    clinicalAggregates: [],
    operationsAggregate: { automationRuns: [], operationalKpis: [], workflowExecutionStatus: [] },
    financeAggregate: { invoices: [], payments: [], collections: [], financialKpis: [] },
    inventoryAggregate: { products: [], consumables: [], stockLevels: [], warehouses: [] },
    supportAggregate: { supportCases: [], supportTickets: [], resolutionMetrics: [], satisfactionMetrics: [] },
    diagnostics: {
      usedReadModel: false,
      fallbackReason,
      checkedReadModelPatients: 0,
    },
  };
}

export async function getReadModelSource({
  consumerName,
}: GetReadModelSourceOptions): Promise<ReadModelSource> {
  const leadOperationsPromise = listLeadOperationsProfiles();

  try {
    const models = await readWorksheetReadModels();
    if (!models || models.patients.length === 0) {
      return await getLegacyLeadsSource(leadOperationsPromise, "read-model-unavailable", consumerName);
    }

    const [leadOperations] = await Promise.all([leadOperationsPromise]);
    const aggregateResult = buildPatientAggregatesFromReadModels(models);
    const crmAggregateResult = buildCrmReadAggregatesFromReadModels(models);
    const billingAggregateResult = buildBillingReadAggregatesFromReadModels(models);
    const clinicalAggregateResult = buildClinicalReadAggregatesFromReadModels(models);
    const operationsAggregateResult = buildOperationsReadAggregateFromReadModels(models);
    const financeAggregateResult = buildFinanceReadAggregateFromReadModels(models);
    const inventoryAggregateResult = buildInventoryReadAggregateFromReadModels(models);
    const supportAggregateResult = buildSupportReadAggregateFromReadModels(models);

    const patients = aggregateResult.administrativeProfiles ?? aggregateResult.patients;

    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Patient",
      aggregate: "PatientAggregateReadService",
      success: true,
      recordCount: patients.length,
      diagnostics: aggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "CRM",
      aggregate: "CRMReadAggregateService",
      success: true,
      recordCount: crmAggregateResult.crmAggregates.length,
      diagnostics: crmAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Billing",
      aggregate: "BillingReadAggregateService",
      success: true,
      recordCount: billingAggregateResult.billingAggregates.length,
      diagnostics: billingAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Clinical",
      aggregate: "ClinicalAggregateReadService",
      success: true,
      recordCount: clinicalAggregateResult.clinicalAggregates.length,
      diagnostics: clinicalAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Operations",
      aggregate: "OperationsAggregateReadService",
      success: true,
      recordCount:
        operationsAggregateResult.operationsAggregate.automationRuns.length +
        operationsAggregateResult.operationsAggregate.operationalKpis.length +
        operationsAggregateResult.operationsAggregate.workflowExecutionStatus.length,
      diagnostics: operationsAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      success: true,
      recordCount:
        financeAggregateResult.financeAggregate.invoices.length +
        financeAggregateResult.financeAggregate.payments.length +
        financeAggregateResult.financeAggregate.collections.length +
        financeAggregateResult.financeAggregate.financialKpis.length,
      diagnostics: financeAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Inventory",
      aggregate: "InventoryAggregateReadService",
      success: true,
      recordCount:
        inventoryAggregateResult.inventoryAggregate.products.length +
        inventoryAggregateResult.inventoryAggregate.consumables.length +
        inventoryAggregateResult.inventoryAggregate.stockLevels.length +
        inventoryAggregateResult.inventoryAggregate.warehouses.length,
      diagnostics: inventoryAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    readObservabilityProvider.trackAggregate({
      consumerName,
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      success: true,
      recordCount:
        supportAggregateResult.supportAggregate.supportCases.length +
        supportAggregateResult.supportAggregate.supportTickets.length +
        supportAggregateResult.supportAggregate.resolutionMetrics.length +
        supportAggregateResult.supportAggregate.satisfactionMetrics.length,
      diagnostics: supportAggregateResult.diagnostics as unknown as Record<string, unknown>,
    });
    trackDomainTelemetry(consumerName, "read-model", {
      patients: patients.length,
      crm: crmAggregateResult.crmAggregates.length,
      billing: billingAggregateResult.billingAggregates.length,
      clinical: clinicalAggregateResult.clinicalAggregates.length,
      operations:
        operationsAggregateResult.operationsAggregate.automationRuns.length +
        operationsAggregateResult.operationsAggregate.operationalKpis.length +
        operationsAggregateResult.operationsAggregate.workflowExecutionStatus.length,
      finance:
        financeAggregateResult.financeAggregate.invoices.length +
        financeAggregateResult.financeAggregate.payments.length +
        financeAggregateResult.financeAggregate.collections.length +
        financeAggregateResult.financeAggregate.financialKpis.length,
      inventory:
        inventoryAggregateResult.inventoryAggregate.products.length +
        inventoryAggregateResult.inventoryAggregate.consumables.length +
        inventoryAggregateResult.inventoryAggregate.stockLevels.length +
        inventoryAggregateResult.inventoryAggregate.warehouses.length,
      support:
        supportAggregateResult.supportAggregate.supportCases.length +
        supportAggregateResult.supportAggregate.supportTickets.length +
        supportAggregateResult.supportAggregate.resolutionMetrics.length +
        supportAggregateResult.supportAggregate.satisfactionMetrics.length,
    });

    return {
      mode: "read-model",
      patients,
      leadOperations,
      crmAggregates: crmAggregateResult.crmAggregates,
      billingAggregates: billingAggregateResult.billingAggregates,
      clinicalAggregates: clinicalAggregateResult.clinicalAggregates,
      operationsAggregate: operationsAggregateResult.operationsAggregate,
      financeAggregate: financeAggregateResult.financeAggregate,
      inventoryAggregate: inventoryAggregateResult.inventoryAggregate,
      supportAggregate: supportAggregateResult.supportAggregate,
      diagnostics: {
        usedReadModel: true,
        checkedReadModelPatients: aggregateResult.patients.length,
        patientAggregateDiagnostics: aggregateResult.diagnostics,
        crmAggregateDiagnostics: crmAggregateResult.diagnostics,
        billingAggregateDiagnostics: billingAggregateResult.diagnostics,
        clinicalAggregateDiagnostics: clinicalAggregateResult.diagnostics,
        operationsAggregateDiagnostics: operationsAggregateResult.diagnostics,
        financeAggregateDiagnostics: financeAggregateResult.diagnostics,
        inventoryAggregateDiagnostics: inventoryAggregateResult.diagnostics,
        supportAggregateDiagnostics: supportAggregateResult.diagnostics,
      },
    };
  } catch (error) {
    console.warn(`${consumerName} read model pilot fell back to legacy Leads source:`, error);
    return await getLegacyLeadsSource(leadOperationsPromise, "read-model-error", consumerName);
  }
}

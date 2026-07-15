import { google } from "googleapis";
import { getServerConfig } from "@/lib/config.server";
import { getGoogleAuth } from "@/server/google/auth";

export const READ_MODEL_SHEETS = {
  patients: "Patients",
  identifiers: "PatientIdentifiers",
  contacts: "PatientContacts",
  administrativeProfiles: "PatientAdministrativeProfiles",
  treatmentInterests: "TreatmentInterests",
  crmFolios: "CrmFolios",
  billingProfiles: "PatientBillingProfiles",
  treatmentPlans: "TreatmentPlans",
  treatmentStages: "TreatmentStages",
  clinicalOutcomes: "ClinicalOutcomes",
  automationRuns: "AutomationRuns",
  operationalKpis: "OperationalKPIs",
  workflowExecutionStatus: "WorkflowExecutionStatus",
  invoices: "Invoices",
  payments: "Payments",
  collections: "Collections",
  financialKpis: "FinancialKPIs",
  products: "Products",
  consumables: "Consumables",
  stockLevels: "StockLevels",
  warehouses: "Warehouses",
  supportCases: "SupportCases",
  supportTickets: "SupportTickets",
  resolutionMetrics: "ResolutionMetrics",
  satisfactionMetrics: "SatisfactionMetrics",
} as const;

export type PatientReadModel = {
  patientId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  administrativeStatus: string;
  identityStatus: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type PatientIdentifierReadModel = {
  identifierId: string;
  patientId: string;
  identifierType: string;
  identifierValue: string;
  country: string;
  isPrimary: boolean;
  verificationStatus: string;
  issuedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type PatientContactReadModel = {
  contactId: string;
  patientId: string;
  contactType: string;
  contactValue: string;
  isPrimary: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type PatientAdministrativeProfileReadModel = {
  profileId: string;
  patientId: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredContactMethod: string;
  verificationStatus: string;
  verifiedAt: string;
  verifiedBy: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type TreatmentInterestReadModel = {
  treatmentInterestId: string;
  patientId: string;
  leadId: string;
  serviceSlug: string;
  serviceName: string;
  status: string;
  interestSource: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type PatientBillingProfileReadModel = {
  billingProfileId: string;
  patientId: string;
  billingType: string;
  taxIdType: string;
  taxIdValue: string;
  ruc: string;
  dv: string;
  legalName: string;
  fiscalAddress: string;
  billingEmail: string;
  billingPhone: string;
  country: string;
  billingStatus: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type TreatmentPlanReadModel = {
  treatmentPlanId: string;
  patientId: string;
  planName: string;
  status: string;
  priority: string;
  startDate: string;
  targetEndDate: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type TreatmentStageReadModel = {
  treatmentStageId: string;
  treatmentPlanId: string;
  patientId: string;
  stageName: string;
  status: string;
  sequence: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type ClinicalOutcomeReadModel = {
  clinicalOutcomeId: string;
  treatmentPlanId: string;
  patientId: string;
  outcomeType: string;
  status: string;
  outcomeValue: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type AutomationRunReadModel = {
  automationRunId: string;
  patientId: string;
  leadId: string;
  workflowName: string;
  status: string;
  startedAt: string;
  completedAt: string;
  durationMs: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type OperationalKpiReadModel = {
  operationalKpiId: string;
  metricName: string;
  metricValue: string;
  metricUnit: string;
  periodStart: string;
  periodEnd: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type WorkflowExecutionStatusReadModel = {
  workflowExecutionStatusId: string;
  automationRunId: string;
  workflowName: string;
  status: string;
  currentStep: string;
  lastTransitionAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type InvoiceReadModel = {
  invoiceId: string;
  patientId: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string;
  currency: string;
  issuedAt: string;
  dueAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type PaymentReadModel = {
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type CollectionReadModel = {
  collectionId: string;
  invoiceId: string;
  patientId: string;
  status: string;
  outstandingAmount: string;
  attempts: string;
  lastAttemptAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type FinancialKpiReadModel = {
  financialKpiId: string;
  metricName: string;
  metricValue: string;
  metricUnit: string;
  periodStart: string;
  periodEnd: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type ProductReadModel = {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  status: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type ConsumableReadModel = {
  consumableId: string;
  productId: string;
  consumableName: string;
  category: string;
  status: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type StockLevelReadModel = {
  stockLevelId: string;
  productId: string;
  warehouseId: string;
  availableQuantity: string;
  reservedQuantity: string;
  reorderThreshold: string;
  status: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type WarehouseReadModel = {
  warehouseId: string;
  warehouseName: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type SupportCaseReadModel = {
  supportCaseId: string;
  patientId: string;
  caseStatus: string;
  casePriority: string;
  caseCategory: string;
  openedAt: string;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type SupportTicketReadModel = {
  supportTicketId: string;
  supportCaseId: string;
  patientId: string;
  ticketStatus: string;
  ticketHistory: string;
  openedAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type ResolutionMetricReadModel = {
  resolutionMetricId: string;
  supportTicketId: string;
  firstResponseTimeMinutes: string;
  resolutionTimeMinutes: string;
  escalationRate: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type SatisfactionMetricReadModel = {
  satisfactionMetricId: string;
  supportTicketId: string;
  csat: string;
  nps: string;
  surveyResult: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type CrmFolioReadModel = {
  crmFolioId: string;
  folio: string;
  patientId: string;
  leadId: string;
  originSheet: string;
  originRow: string;
  createdAt: string;
  source: string;
  isMock: boolean;
  notes: string;
};

export type WorksheetReadModels = {
  patients: PatientReadModel[];
  identifiers: PatientIdentifierReadModel[];
  contacts: PatientContactReadModel[];
  administrativeProfiles: PatientAdministrativeProfileReadModel[];
  treatmentInterests: TreatmentInterestReadModel[];
  crmFolios: CrmFolioReadModel[];
  billingProfiles: PatientBillingProfileReadModel[];
  treatmentPlans: TreatmentPlanReadModel[];
  treatmentStages: TreatmentStageReadModel[];
  clinicalOutcomes: ClinicalOutcomeReadModel[];
  automationRuns?: AutomationRunReadModel[];
  operationalKpis?: OperationalKpiReadModel[];
  workflowExecutionStatus?: WorkflowExecutionStatusReadModel[];
  invoices?: InvoiceReadModel[];
  payments?: PaymentReadModel[];
  collections?: CollectionReadModel[];
  financialKpis?: FinancialKpiReadModel[];
  products?: ProductReadModel[];
  consumables?: ConsumableReadModel[];
  stockLevels?: StockLevelReadModel[];
  warehouses?: WarehouseReadModel[];
  supportCases?: SupportCaseReadModel[];
  supportTickets?: SupportTicketReadModel[];
  resolutionMetrics?: ResolutionMetricReadModel[];
  satisfactionMetrics?: SatisfactionMetricReadModel[];
};

type RawWorksheetRecord = Record<string, string>;

type SheetReadResult = {
  records: RawWorksheetRecord[];
  available: boolean;
};

function getSheets() {
  return google.sheets({ version: "v4", auth: getGoogleAuth() });
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function toCamelCase(value: string) {
  return normalizeHeader(value).replace(/_([a-z0-9])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function toBoolean(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "si";
}

function normalizeRowValue(value: unknown) {
  return value?.toString().trim() ?? "";
}

function normalizeRecords(rows: unknown[][]): RawWorksheetRecord[] {
  const header = rows[0]?.map((cell) => toCamelCase(normalizeRowValue(cell))) ?? [];
  if (!header.length) return [];

  return rows.slice(1).map((row) => {
    const record: RawWorksheetRecord = {};
    header.forEach((column, index) => {
      if (!column) return;
      record[column] = normalizeRowValue(row[index]);
    });
    return record;
  });
}

async function readSheetRecords(sheetName: string): Promise<SheetReadResult> {
  const config = getServerConfig();
  const sheets = getSheets();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.googleSheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values ?? [];
    if (rows.length < 2) return { records: [], available: false };

    const records = normalizeRecords(rows).filter((record) =>
      Object.values(record).some((value) => value.trim().length > 0),
    );

    return { records, available: records.length > 0 };
  } catch (error) {
    console.warn(
      `Read model sheet ${sheetName} is unavailable; falling back when possible.`,
      error,
    );
    return { records: [], available: false };
  }
}

function mapPatient(record: RawWorksheetRecord): PatientReadModel {
  return {
    patientId: record.patientId ?? "",
    displayName: record.displayName ?? "",
    firstName: record.firstName ?? "",
    lastName: record.lastName ?? "",
    dateOfBirth: record.dateOfBirth ?? "",
    administrativeStatus: record.administrativeStatus ?? "",
    identityStatus: record.identityStatus ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapIdentifier(record: RawWorksheetRecord): PatientIdentifierReadModel {
  return {
    identifierId: record.identifierId ?? "",
    patientId: record.patientId ?? "",
    identifierType: record.identifierType ?? "",
    identifierValue: record.identifierValue ?? "",
    country: record.country ?? "",
    isPrimary: toBoolean(record.isPrimary),
    verificationStatus: record.verificationStatus ?? "",
    issuedAt: record.issuedAt ?? "",
    expiresAt: record.expiresAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapContact(record: RawWorksheetRecord): PatientContactReadModel {
  return {
    contactId: record.contactId ?? "",
    patientId: record.patientId ?? "",
    contactType: record.contactType ?? "",
    contactValue: record.contactValue ?? "",
    isPrimary: toBoolean(record.isPrimary),
    verificationStatus: record.verificationStatus ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapAdministrativeProfile(
  record: RawWorksheetRecord,
): PatientAdministrativeProfileReadModel {
  return {
    profileId: record.profileId ?? "",
    patientId: record.patientId ?? "",
    address: record.address ?? "",
    emergencyContactName: record.emergencyContactName ?? "",
    emergencyContactPhone: record.emergencyContactPhone ?? "",
    preferredContactMethod: record.preferredContactMethod ?? "",
    verificationStatus: record.verificationStatus ?? "",
    verifiedAt: record.verifiedAt ?? "",
    verifiedBy: record.verifiedBy ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapTreatmentInterest(record: RawWorksheetRecord): TreatmentInterestReadModel {
  return {
    treatmentInterestId: record.treatmentInterestId ?? "",
    patientId: record.patientId ?? "",
    leadId: record.leadId ?? "",
    serviceSlug: record.serviceSlug ?? "",
    serviceName: record.serviceName ?? "",
    status: record.status ?? "",
    interestSource: record.interestSource ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapCrmFolio(record: RawWorksheetRecord): CrmFolioReadModel {
  return {
    crmFolioId: record.crmFolioId ?? "",
    folio: record.folio ?? "",
    patientId: record.patientId ?? "",
    leadId: record.leadId ?? "",
    originSheet: record.originSheet ?? "",
    originRow: record.originRow ?? "",
    createdAt: record.createdAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapBillingProfile(record: RawWorksheetRecord): PatientBillingProfileReadModel {
  return {
    billingProfileId: record.billingProfileId ?? record.profileId ?? "",
    patientId: record.patientId ?? "",
    billingType: record.billingType ?? record.profileType ?? "",
    taxIdType: record.taxIdType ?? record.documentType ?? "",
    taxIdValue: record.taxIdValue ?? record.documentValue ?? "",
    ruc: record.ruc ?? "",
    dv: record.dv ?? "",
    legalName: record.legalName ?? record.razonSocial ?? record.businessName ?? "",
    fiscalAddress: record.fiscalAddress ?? record.direccionFiscal ?? record.address ?? "",
    billingEmail: record.billingEmail ?? record.email ?? "",
    billingPhone: record.billingPhone ?? record.phone ?? "",
    country: record.country ?? "",
    billingStatus: record.billingStatus ?? record.status ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapTreatmentPlan(record: RawWorksheetRecord): TreatmentPlanReadModel {
  return {
    treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
    patientId: record.patientId ?? "",
    planName: record.planName ?? record.name ?? "",
    status: record.status ?? "",
    priority: record.priority ?? "",
    startDate: record.startDate ?? "",
    targetEndDate: record.targetEndDate ?? record.endDate ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapTreatmentStage(record: RawWorksheetRecord): TreatmentStageReadModel {
  return {
    treatmentStageId: record.treatmentStageId ?? record.stageId ?? "",
    treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
    patientId: record.patientId ?? "",
    stageName: record.stageName ?? record.name ?? "",
    status: record.status ?? "",
    sequence: record.sequence ?? "",
    startedAt: record.startedAt ?? record.startDate ?? "",
    completedAt: record.completedAt ?? record.completedDate ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapClinicalOutcome(record: RawWorksheetRecord): ClinicalOutcomeReadModel {
  return {
    clinicalOutcomeId: record.clinicalOutcomeId ?? record.outcomeId ?? "",
    treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
    patientId: record.patientId ?? "",
    outcomeType: record.outcomeType ?? record.type ?? "",
    status: record.status ?? "",
    outcomeValue: record.outcomeValue ?? record.value ?? "",
    recordedAt: record.recordedAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapAutomationRun(record: RawWorksheetRecord): AutomationRunReadModel {
  return {
    automationRunId: record.automationRunId ?? record.runId ?? "",
    patientId: record.patientId ?? "",
    leadId: record.leadId ?? "",
    workflowName: record.workflowName ?? record.workflow ?? record.name ?? "",
    status: record.status ?? "",
    startedAt: record.startedAt ?? record.startDate ?? "",
    completedAt: record.completedAt ?? record.completedDate ?? "",
    durationMs: record.durationMs ?? record.duration ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapOperationalKpi(record: RawWorksheetRecord): OperationalKpiReadModel {
  return {
    operationalKpiId: record.operationalKpiId ?? record.kpiId ?? record.metricId ?? "",
    metricName: record.metricName ?? record.name ?? "",
    metricValue: record.metricValue ?? record.value ?? "",
    metricUnit: record.metricUnit ?? record.unit ?? "",
    periodStart: record.periodStart ?? record.startDate ?? "",
    periodEnd: record.periodEnd ?? record.endDate ?? "",
    domain: record.domain ?? "Operations",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapWorkflowExecutionStatus(record: RawWorksheetRecord): WorkflowExecutionStatusReadModel {
  return {
    workflowExecutionStatusId: record.workflowExecutionStatusId ?? record.statusId ?? "",
    automationRunId: record.automationRunId ?? record.runId ?? "",
    workflowName: record.workflowName ?? record.workflow ?? record.name ?? "",
    status: record.status ?? "",
    currentStep: record.currentStep ?? record.step ?? "",
    lastTransitionAt: record.lastTransitionAt ?? record.updatedAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapInvoice(record: RawWorksheetRecord): InvoiceReadModel {
  return {
    invoiceId: record.invoiceId ?? record.id ?? "",
    patientId: record.patientId ?? "",
    invoiceNumber: record.invoiceNumber ?? record.number ?? record.folio ?? "",
    status: record.status ?? record.invoiceStatus ?? "",
    totalAmount: record.totalAmount ?? record.total ?? record.amount ?? "",
    currency: record.currency ?? "",
    issuedAt: record.issuedAt ?? record.issueDate ?? record.createdAt ?? "",
    dueAt: record.dueAt ?? record.dueDate ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapPayment(record: RawWorksheetRecord): PaymentReadModel {
  return {
    paymentId: record.paymentId ?? record.id ?? "",
    invoiceId: record.invoiceId ?? "",
    patientId: record.patientId ?? "",
    amount: record.amount ?? record.paymentAmount ?? "",
    currency: record.currency ?? "",
    method: record.method ?? record.paymentMethod ?? "",
    status: record.status ?? record.paymentStatus ?? "",
    paidAt: record.paidAt ?? record.paymentDate ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapCollection(record: RawWorksheetRecord): CollectionReadModel {
  return {
    collectionId: record.collectionId ?? record.id ?? "",
    invoiceId: record.invoiceId ?? "",
    patientId: record.patientId ?? "",
    status: record.status ?? record.collectionStatus ?? "",
    outstandingAmount: record.outstandingAmount ?? record.balance ?? record.amountDue ?? "",
    attempts: record.attempts ?? record.collectionAttempts ?? "",
    lastAttemptAt: record.lastAttemptAt ?? record.lastContactAt ?? record.updatedAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapProduct(record: RawWorksheetRecord): ProductReadModel {
  return {
    productId: record.productId ?? record.id ?? "",
    sku: record.sku ?? record.code ?? "",
    productName: record.productName ?? record.name ?? "",
    category: record.category ?? "",
    status: record.status ?? "",
    unit: record.unit ?? record.uom ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapConsumable(record: RawWorksheetRecord): ConsumableReadModel {
  return {
    consumableId: record.consumableId ?? record.id ?? "",
    productId: record.productId ?? "",
    consumableName: record.consumableName ?? record.name ?? "",
    category: record.category ?? "",
    status: record.status ?? "",
    unit: record.unit ?? record.uom ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapStockLevel(record: RawWorksheetRecord): StockLevelReadModel {
  return {
    stockLevelId: record.stockLevelId ?? record.id ?? "",
    productId: record.productId ?? "",
    warehouseId: record.warehouseId ?? "",
    availableQuantity: record.availableQuantity ?? record.available ?? record.quantity ?? "",
    reservedQuantity: record.reservedQuantity ?? record.reserved ?? "",
    reorderThreshold: record.reorderThreshold ?? record.threshold ?? "",
    status: record.status ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapWarehouse(record: RawWorksheetRecord): WarehouseReadModel {
  return {
    warehouseId: record.warehouseId ?? record.id ?? "",
    warehouseName: record.warehouseName ?? record.name ?? "",
    location: record.location ?? record.address ?? "",
    status: record.status ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapSupportCase(record: RawWorksheetRecord): SupportCaseReadModel {
  return {
    supportCaseId: record.supportCaseId ?? record.caseId ?? record.id ?? "",
    patientId: record.patientId ?? "",
    caseStatus: record.caseStatus ?? record.status ?? "",
    casePriority: record.casePriority ?? record.priority ?? "",
    caseCategory: record.caseCategory ?? record.category ?? "",
    openedAt: record.openedAt ?? record.createdAt ?? "",
    closedAt: record.closedAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapSupportTicket(record: RawWorksheetRecord): SupportTicketReadModel {
  return {
    supportTicketId: record.supportTicketId ?? record.ticketId ?? record.id ?? "",
    supportCaseId: record.supportCaseId ?? record.caseId ?? "",
    patientId: record.patientId ?? "",
    ticketStatus: record.ticketStatus ?? record.status ?? "",
    ticketHistory: record.ticketHistory ?? record.history ?? "",
    openedAt: record.openedAt ?? record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapResolutionMetric(record: RawWorksheetRecord): ResolutionMetricReadModel {
  return {
    resolutionMetricId: record.resolutionMetricId ?? record.metricId ?? record.id ?? "",
    supportTicketId: record.supportTicketId ?? record.ticketId ?? "",
    firstResponseTimeMinutes:
      record.firstResponseTimeMinutes ?? record.firstResponseTime ?? record.firstResponse ?? "",
    resolutionTimeMinutes: record.resolutionTimeMinutes ?? record.resolutionTime ?? "",
    escalationRate: record.escalationRate ?? record.escalations ?? "",
    periodStart: record.periodStart ?? record.startDate ?? "",
    periodEnd: record.periodEnd ?? record.endDate ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapSatisfactionMetric(record: RawWorksheetRecord): SatisfactionMetricReadModel {
  return {
    satisfactionMetricId: record.satisfactionMetricId ?? record.metricId ?? record.id ?? "",
    supportTicketId: record.supportTicketId ?? record.ticketId ?? "",
    csat: record.csat ?? record.csatScore ?? "",
    nps: record.nps ?? record.npsScore ?? "",
    surveyResult: record.surveyResult ?? record.result ?? "",
    recordedAt: record.recordedAt ?? record.createdAt ?? "",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

function mapFinancialKpi(record: RawWorksheetRecord): FinancialKpiReadModel {
  return {
    financialKpiId: record.financialKpiId ?? record.kpiId ?? record.metricId ?? "",
    metricName: record.metricName ?? record.name ?? "",
    metricValue: record.metricValue ?? record.value ?? "",
    metricUnit: record.metricUnit ?? record.unit ?? "",
    periodStart: record.periodStart ?? record.startDate ?? "",
    periodEnd: record.periodEnd ?? record.endDate ?? "",
    domain: record.domain ?? "Finance",
    createdAt: record.createdAt ?? "",
    updatedAt: record.updatedAt ?? "",
    source: record.source ?? "read-model",
    isMock: toBoolean(record.isMock),
    notes: record.notes ?? "",
  };
}

export async function readWorksheetReadModels(): Promise<WorksheetReadModels | null> {
  const [
    patients,
    identifiers,
    contacts,
    administrativeProfiles,
    treatmentInterests,
    crmFolios,
    billingProfiles,
    treatmentPlans,
    treatmentStages,
    clinicalOutcomes,
    automationRuns,
    operationalKpis,
    workflowExecutionStatus,
    invoices,
    payments,
    collections,
    financialKpis,
    products,
    consumables,
    stockLevels,
    warehouses,
    supportCases,
    supportTickets,
    resolutionMetrics,
    satisfactionMetrics,
  ] = await Promise.all([
    readSheetRecords(READ_MODEL_SHEETS.patients),
    readSheetRecords(READ_MODEL_SHEETS.identifiers),
    readSheetRecords(READ_MODEL_SHEETS.contacts),
    readSheetRecords(READ_MODEL_SHEETS.administrativeProfiles),
    readSheetRecords(READ_MODEL_SHEETS.treatmentInterests),
    readSheetRecords(READ_MODEL_SHEETS.crmFolios),
    readSheetRecords(READ_MODEL_SHEETS.billingProfiles),
    readSheetRecords(READ_MODEL_SHEETS.treatmentPlans),
    readSheetRecords(READ_MODEL_SHEETS.treatmentStages),
    readSheetRecords(READ_MODEL_SHEETS.clinicalOutcomes),
    readSheetRecords(READ_MODEL_SHEETS.automationRuns),
    readSheetRecords(READ_MODEL_SHEETS.operationalKpis),
    readSheetRecords(READ_MODEL_SHEETS.workflowExecutionStatus),
    readSheetRecords(READ_MODEL_SHEETS.invoices),
    readSheetRecords(READ_MODEL_SHEETS.payments),
    readSheetRecords(READ_MODEL_SHEETS.collections),
    readSheetRecords(READ_MODEL_SHEETS.financialKpis),
    readSheetRecords(READ_MODEL_SHEETS.products),
    readSheetRecords(READ_MODEL_SHEETS.consumables),
    readSheetRecords(READ_MODEL_SHEETS.stockLevels),
    readSheetRecords(READ_MODEL_SHEETS.warehouses),
    readSheetRecords(READ_MODEL_SHEETS.supportCases),
    readSheetRecords(READ_MODEL_SHEETS.supportTickets),
    readSheetRecords(READ_MODEL_SHEETS.resolutionMetrics),
    readSheetRecords(READ_MODEL_SHEETS.satisfactionMetrics),
  ]);

  if (!patients.available) return null;

  return {
    patients: patients.records.map(mapPatient).filter((patient) => patient.patientId),
    identifiers: identifiers.records
      .map(mapIdentifier)
      .filter((identifier) => identifier.patientId),
    contacts: contacts.records.map(mapContact).filter((contact) => contact.patientId),
    administrativeProfiles: administrativeProfiles.records
      .map(mapAdministrativeProfile)
      .filter((profile) => profile.patientId),
    treatmentInterests: treatmentInterests.records
      .map(mapTreatmentInterest)
      .filter((interest) => interest.patientId),
    crmFolios: crmFolios.records.map(mapCrmFolio).filter((folio) => folio.patientId),
    billingProfiles: billingProfiles.records
      .map(mapBillingProfile)
      .filter((profile) => profile.patientId),
    treatmentPlans: treatmentPlans.records.map(mapTreatmentPlan).filter((plan) => plan.patientId),
    treatmentStages: treatmentStages.records
      .map(mapTreatmentStage)
      .filter((stage) => stage.patientId),
    clinicalOutcomes: clinicalOutcomes.records
      .map(mapClinicalOutcome)
      .filter((outcome) => outcome.patientId),
    automationRuns: automationRuns.records
      .map(mapAutomationRun)
      .filter((run) => run.automationRunId),
    operationalKpis: operationalKpis.records
      .map(mapOperationalKpi)
      .filter((kpi) => kpi.operationalKpiId),
    workflowExecutionStatus: workflowExecutionStatus.records
      .map(mapWorkflowExecutionStatus)
      .filter((status) => status.workflowExecutionStatusId || status.automationRunId),
    invoices: invoices.records.map(mapInvoice).filter((invoice) => invoice.invoiceId),
    payments: payments.records.map(mapPayment).filter((payment) => payment.paymentId),
    collections: collections.records
      .map(mapCollection)
      .filter((collection) => collection.collectionId),
    financialKpis: financialKpis.records.map(mapFinancialKpi).filter((kpi) => kpi.financialKpiId),
    products: products.records.map(mapProduct).filter((product) => product.productId),
    consumables: consumables.records
      .map(mapConsumable)
      .filter((consumable) => consumable.consumableId),
    stockLevels: stockLevels.records
      .map(mapStockLevel)
      .filter((stockLevel) => stockLevel.stockLevelId),
    warehouses: warehouses.records.map(mapWarehouse).filter((warehouse) => warehouse.warehouseId),
    supportCases: supportCases.records
      .map(mapSupportCase)
      .filter((supportCase) => supportCase.supportCaseId),
    supportTickets: supportTickets.records
      .map(mapSupportTicket)
      .filter((supportTicket) => supportTicket.supportTicketId),
    resolutionMetrics: resolutionMetrics.records
      .map(mapResolutionMetric)
      .filter((metric) => metric.resolutionMetricId),
    satisfactionMetrics: satisfactionMetrics.records
      .map(mapSatisfactionMetric)
      .filter((metric) => metric.satisfactionMetricId),
  };
}

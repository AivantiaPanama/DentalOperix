import { describe, expect, it } from "vitest";
import { buildFinanceReadAggregateFromReadModels } from "./finance-read-aggregate-service";
import type {
  CollectionReadModel,
  FinancialKpiReadModel,
  InvoiceReadModel,
  PaymentReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";

const invoice = (overrides: Partial<InvoiceReadModel>): InvoiceReadModel => ({
  invoiceId: "INV-001",
  patientId: "PAT-001",
  invoiceNumber: "F-001",
  status: "issued",
  totalAmount: "1500.00",
  currency: "USD",
  issuedAt: "2026-01-01T00:00:00.000Z",
  dueAt: "2026-01-15T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const payment = (overrides: Partial<PaymentReadModel>): PaymentReadModel => ({
  paymentId: "PAY-001",
  invoiceId: "INV-001",
  patientId: "PAT-001",
  amount: "500.00",
  currency: "USD",
  method: "card",
  status: "captured",
  paidAt: "2026-01-02T00:00:00.000Z",
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const collection = (overrides: Partial<CollectionReadModel>): CollectionReadModel => ({
  collectionId: "COL-001",
  invoiceId: "INV-001",
  patientId: "PAT-001",
  status: "open",
  outstandingAmount: "1000.00",
  attempts: "1",
  lastAttemptAt: "2026-01-03T00:00:00.000Z",
  createdAt: "2026-01-03T00:00:00.000Z",
  updatedAt: "2026-01-03T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const financialKpi = (overrides: Partial<FinancialKpiReadModel>): FinancialKpiReadModel => ({
  financialKpiId: "FKPI-001",
  metricName: "monthly_revenue",
  metricValue: "1500.00",
  metricUnit: "USD",
  periodStart: "2026-01-01T00:00:00.000Z",
  periodEnd: "2026-01-31T23:59:59.999Z",
  domain: "Finance",
  createdAt: "2026-01-31T00:00:00.000Z",
  updatedAt: "2026-01-31T00:00:00.000Z",
  source: "seed",
  isMock: false,
  notes: "",
  ...overrides,
});

const models = (overrides: Partial<WorksheetReadModels>): WorksheetReadModels => ({
  patients: [],
  identifiers: [],
  contacts: [],
  administrativeProfiles: [],
  treatmentInterests: [],
  crmFolios: [],
  billingProfiles: [],
  treatmentPlans: [],
  treatmentStages: [],
  clinicalOutcomes: [],
  automationRuns: [],
  operationalKpis: [],
  workflowExecutionStatus: [],
  invoices: [],
  payments: [],
  collections: [],
  financialKpis: [],
  ...overrides,
});

describe("finance read aggregate service", () => {
  it("builds an isolated finance aggregate without extending Patient, CRM, Billing, Clinical, or Operations", () => {
    const result = buildFinanceReadAggregateFromReadModels(models({
      invoices: [invoice({ invoiceId: "INV-001" })],
      payments: [payment({ paymentId: "PAY-001" })],
      collections: [collection({ collectionId: "COL-001" })],
      financialKpis: [financialKpi({ financialKpiId: "FKPI-001" })],
    }));

    expect(result.financeAggregate).toEqual({
      invoices: [expect.objectContaining({ invoiceId: "INV-001", invoiceNumber: "F-001" })],
      payments: [expect.objectContaining({ paymentId: "PAY-001", amount: "500.00" })],
      collections: [expect.objectContaining({ collectionId: "COL-001", status: "open" })],
      financialKpis: [expect.objectContaining({ financialKpiId: "FKPI-001", metricName: "monthly_revenue" })],
    });
    expect(result.diagnostics).toMatchObject({
      totalInvoices: 1,
      totalPayments: 1,
      totalCollections: 1,
      totalFinancialKpis: 1,
      usableInvoices: 1,
      usablePayments: 1,
      usableCollections: 1,
      usableFinancialKpis: 1,
    });
  });

  it("filters incomplete finance rows from payloads while keeping diagnostics", () => {
    const result = buildFinanceReadAggregateFromReadModels(models({
      invoices: [invoice({ invoiceId: "", invoiceNumber: "" })],
      payments: [payment({ paymentId: "", amount: "" })],
      collections: [collection({ collectionId: "", status: "" })],
      financialKpis: [financialKpi({ financialKpiId: "", metricName: "" })],
    }));

    expect(result.financeAggregate).toEqual({
      invoices: [],
      payments: [],
      collections: [],
      financialKpis: [],
    });
    expect(result.diagnostics).toMatchObject({
      incompleteInvoices: 1,
      incompletePayments: 1,
      incompleteCollections: 1,
      incompleteFinancialKpis: 1,
    });
  });

  it("sorts finance records by newest timestamp", () => {
    const result = buildFinanceReadAggregateFromReadModels(models({
      invoices: [
        invoice({ invoiceId: "INV-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        invoice({ invoiceId: "INV-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      payments: [
        payment({ paymentId: "PAY-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        payment({ paymentId: "PAY-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      collections: [
        collection({ collectionId: "COL-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        collection({ collectionId: "COL-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
      financialKpis: [
        financialKpi({ financialKpiId: "FKPI-OLD", updatedAt: "2026-01-01T00:00:00.000Z" }),
        financialKpi({ financialKpiId: "FKPI-NEW", updatedAt: "2026-01-03T00:00:00.000Z" }),
      ],
    }));

    expect(result.financeAggregate.invoices.map((item) => item.invoiceId)).toEqual(["INV-NEW", "INV-OLD"]);
    expect(result.financeAggregate.payments.map((item) => item.paymentId)).toEqual(["PAY-NEW", "PAY-OLD"]);
    expect(result.financeAggregate.collections.map((item) => item.collectionId)).toEqual(["COL-NEW", "COL-OLD"]);
    expect(result.financeAggregate.financialKpis.map((item) => item.financialKpiId)).toEqual(["FKPI-NEW", "FKPI-OLD"]);
  });
});

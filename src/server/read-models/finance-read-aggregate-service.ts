import { readCollections, type CollectionReadDto } from "@/server/read-models/collection-read-adapter";
import { readFinancialKpis, type FinancialKpiReadDto } from "@/server/read-models/financial-kpi-read-adapter";
import { readInvoices, type InvoiceReadDto } from "@/server/read-models/invoice-read-adapter";
import { readPayments, type PaymentReadDto } from "@/server/read-models/payment-read-adapter";
import type { WorksheetReadModels } from "@/server/read-models/worksheet-read-models";

export type FinanceReadAggregate = {
  invoices: InvoiceReadDto[];
  payments: PaymentReadDto[];
  collections: CollectionReadDto[];
  financialKpis: FinancialKpiReadDto[];
};

export type FinanceReadAggregateDiagnostics = {
  totalInvoices: number;
  totalPayments: number;
  totalCollections: number;
  totalFinancialKpis: number;
  usableInvoices: number;
  usablePayments: number;
  usableCollections: number;
  usableFinancialKpis: number;
  incompleteInvoices: number;
  incompletePayments: number;
  incompleteCollections: number;
  incompleteFinancialKpis: number;
};

export type FinanceReadAggregateResult = {
  financeAggregate: FinanceReadAggregate;
  diagnostics: FinanceReadAggregateDiagnostics;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function buildFinanceReadAggregateFromReadModels(models: WorksheetReadModels): FinanceReadAggregateResult {
  const invoices = models.invoices ?? [];
  const payments = models.payments ?? [];
  const collections = models.collections ?? [];
  const financialKpis = models.financialKpis ?? [];

  const usableInvoices = readInvoices(invoices);
  const usablePayments = readPayments(payments);
  const usableCollections = readCollections(collections);
  const usableFinancialKpis = readFinancialKpis(financialKpis);

  return {
    financeAggregate: {
      invoices: usableInvoices,
      payments: usablePayments,
      collections: usableCollections,
      financialKpis: usableFinancialKpis,
    },
    diagnostics: {
      totalInvoices: invoices.length,
      totalPayments: payments.length,
      totalCollections: collections.length,
      totalFinancialKpis: financialKpis.length,
      usableInvoices: usableInvoices.length,
      usablePayments: usablePayments.length,
      usableCollections: usableCollections.length,
      usableFinancialKpis: usableFinancialKpis.length,
      incompleteInvoices: invoices.filter((invoice) => !normalize(invoice.invoiceId) || !normalize(invoice.invoiceNumber)).length,
      incompletePayments: payments.filter((payment) => !normalize(payment.paymentId) || !normalize(payment.amount)).length,
      incompleteCollections: collections.filter((collection) => !normalize(collection.collectionId) || !normalize(collection.status)).length,
      incompleteFinancialKpis: financialKpis.filter((kpi) => !normalize(kpi.financialKpiId) || !normalize(kpi.metricName)).length,
    },
  };
}

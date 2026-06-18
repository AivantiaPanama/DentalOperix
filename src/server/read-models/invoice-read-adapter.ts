import type { InvoiceReadModel } from "@/server/read-models/worksheet-read-models";

export type InvoiceReadDto = {
  invoiceId: string;
  patientId?: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string;
  currency?: string;
  issuedAt?: string;
  dueAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(invoice: InvoiceReadModel) {
  const timestamp = Date.parse(invoice.updatedAt || invoice.dueAt || invoice.issuedAt || invoice.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableInvoice(invoice: InvoiceReadModel) {
  return Boolean(normalize(invoice.invoiceId) && normalize(invoice.invoiceNumber));
}

function toInvoiceDto(invoice: InvoiceReadModel): InvoiceReadDto {
  return {
    invoiceId: normalize(invoice.invoiceId),
    ...(normalize(invoice.patientId) ? { patientId: normalize(invoice.patientId) } : {}),
    invoiceNumber: normalize(invoice.invoiceNumber),
    status: normalize(invoice.status),
    totalAmount: normalize(invoice.totalAmount),
    ...(normalize(invoice.currency) ? { currency: normalize(invoice.currency) } : {}),
    ...(normalize(invoice.issuedAt) ? { issuedAt: normalize(invoice.issuedAt) } : {}),
    ...(normalize(invoice.dueAt) ? { dueAt: normalize(invoice.dueAt) } : {}),
    source: normalize(invoice.source) || "read-model",
    isMock: invoice.isMock,
    ...(normalize(invoice.notes) ? { notes: normalize(invoice.notes) } : {}),
  };
}

export function readInvoices(invoices: InvoiceReadModel[]): InvoiceReadDto[] {
  return invoices
    .filter(isUsableInvoice)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toInvoiceDto);
}

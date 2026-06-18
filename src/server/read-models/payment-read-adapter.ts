import type { PaymentReadModel } from "@/server/read-models/worksheet-read-models";

export type PaymentReadDto = {
  paymentId: string;
  invoiceId?: string;
  patientId?: string;
  amount: string;
  currency?: string;
  method?: string;
  status: string;
  paidAt?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(payment: PaymentReadModel) {
  const timestamp = Date.parse(payment.updatedAt || payment.paidAt || payment.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsablePayment(payment: PaymentReadModel) {
  return Boolean(normalize(payment.paymentId) && normalize(payment.amount));
}

function toPaymentDto(payment: PaymentReadModel): PaymentReadDto {
  return {
    paymentId: normalize(payment.paymentId),
    ...(normalize(payment.invoiceId) ? { invoiceId: normalize(payment.invoiceId) } : {}),
    ...(normalize(payment.patientId) ? { patientId: normalize(payment.patientId) } : {}),
    amount: normalize(payment.amount),
    ...(normalize(payment.currency) ? { currency: normalize(payment.currency) } : {}),
    ...(normalize(payment.method) ? { method: normalize(payment.method) } : {}),
    status: normalize(payment.status),
    ...(normalize(payment.paidAt) ? { paidAt: normalize(payment.paidAt) } : {}),
    source: normalize(payment.source) || "read-model",
    isMock: payment.isMock,
    ...(normalize(payment.notes) ? { notes: normalize(payment.notes) } : {}),
  };
}

export function readPayments(payments: PaymentReadModel[]): PaymentReadDto[] {
  return payments
    .filter(isUsablePayment)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toPaymentDto);
}

// src/types/payment.types.ts
export interface PaymentRequest {
  orderId: string;
  orderName: string;
  amount: number;
  userId: string;
}

export interface TossPaymentConfirm {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  version: string;
  paymentKey: string;
  orderId: string;
  orderName: string;
  method: string;
  status: string;
  requestedAt: string;
  approvedAt: string;
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  currency: string;
}

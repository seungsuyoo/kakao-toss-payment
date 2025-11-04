// frontend/src/components/PaymentButton.tsx
'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { api } from '@/lib/api';

interface PaymentButtonProps {
  userId: string;
  orderName: string;
  amount: number;
}

export default function PaymentButton({ userId, orderName, amount }: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const orderResponse = await api.post<{ order: { orderId: string } }>('/api/payments/orders', {
        userId,
        orderName,
        amount,
      });

      const { orderId } = orderResponse.order;

      const tossPayments = await loadTossPayments(clientKey);

      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerName: '고객',
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('결제 요청에 실패했습니다');
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? '결제 처리 중...' : `${amount.toLocaleString()}원 결제하기`}
    </button>
  );
}

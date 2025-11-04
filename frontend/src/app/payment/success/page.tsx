// frontend/src/app/payment/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setStatus('error');
        return;
      }

      try {
        const response = await api.post('/api/payments/confirm', {
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        setPaymentInfo(response);
        setStatus('success');
      } catch (error) {
        console.error('Payment confirmation failed:', error);
        setStatus('error');
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">결제를 승인하는 중...</p>
          </div>
        )}

        {status === 'success' && paymentInfo && (
          <div className="text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">결제 완료</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-medium">{paymentInfo.payment.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주문명</span>
                  <span className="font-medium">{paymentInfo.payment.orderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="font-bold text-blue-600">
                    {paymentInfo.payment.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">결제 실패</h2>
            <p className="text-gray-600 mb-6">결제 승인에 실패했습니다</p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

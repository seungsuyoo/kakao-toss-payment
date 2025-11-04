// frontend/src/app/payment/fail/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentFail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || '결제에 실패했습니다';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-600 text-6xl mb-4">✗</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">결제 실패</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

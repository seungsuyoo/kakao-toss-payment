// src/app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');

    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      return;
    }

    localStorage.setItem('userId', userId);
    if (name) {
      localStorage.setItem('userName', name);
    }

    setStatus('success');

    setTimeout(() => {
      router.push('/');
    }, 1500);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로그인 처리 중...</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-gray-800 text-lg font-semibold">로그인 성공</p>
            <p className="text-gray-600 mt-2">잠시 후 메인 페이지로 이동합니다</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <p className="text-gray-800 text-lg font-semibold">로그인 실패</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              메인으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

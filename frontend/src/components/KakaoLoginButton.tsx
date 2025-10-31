// src/components/KakaoLoginButton.tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ url: string }>('/api/auth/kakao');
      window.location.href = response.url;
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#FEE500] text-[#000000] rounded-lg font-semibold hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
          </svg>
          <span>카카오 로그인</span>
        </>
      )}
    </button>
  );
}

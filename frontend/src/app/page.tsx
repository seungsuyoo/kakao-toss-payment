// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import KakaoLoginButton from '@/components/KakaoLoginButton';
import { api } from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  profileImage: string | null;
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.get<UserProfile>(`/api/auth/profile?userId=${userId}`);
        setUser(profile);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('userId');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          카카오 로그인 & 토스페이먼츠 데모
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {user ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                {user.profileImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profileImage} alt="Profile" className="w-16 h-16 rounded-full" />
                )}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {user.name || '사용자'}님, 환영합니다
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">로그인이 필요합니다</h2>
              <KakaoLoginButton />
            </div>
          )}
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">결제 테스트</h2>
            <p className="text-gray-600 mb-4">로그인 완료 후 결제 기능을 사용할 수 있습니다</p>
            <button
              onClick={() => {
                /* 다음 섹션에서 구현 */
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              결제하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

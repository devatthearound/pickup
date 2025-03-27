'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StoreLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 여기에 로그인 로직이 들어갑니다
    router.push('/store');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 로고 영역 */}
      <div className="bg-[#FF7355] px-4 py-8 flex flex-col items-center">
        <h1 className="text-white text-2xl font-bold mb-2">도넛캠프</h1>
        <p className="text-white/80 text-sm">매장 관리자 로그인</p>
      </div>

      {/* 로그인 폼 */}
      <div className="flex-1 px-4 py-8">
        <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]" />
              <span className="ml-2 text-sm text-gray-600">로그인 유지</span>
            </label>
            <button type="button" className="text-sm text-gray-600 hover:text-[#FF7355]">
              비밀번호 찾기
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
          >
            로그인
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">아직 계정이 없으신가요?</span>
            <button
              type="button"
              onClick={() => router.push('/customer/store-register')}
              className="ml-2 text-sm text-[#FF7355] hover:text-[#FF6344]"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
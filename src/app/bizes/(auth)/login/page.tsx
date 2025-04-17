'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { setCookie } from '@/lib/useCookie';
import { useAxios } from '@/hooks/useAxios';
export default function LoginPage() {
  const axiosInstance = useAxios();
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.status !== 201) {
        const errorData = response.data;
        if (response.status === 401) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
        } else if (response.status === 403) {
          setError('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
        } else if (response.status === 404) {
          setError('존재하지 않는 계정입니다. 회원가입을 먼저 진행해주세요.');
        } else if (response.status === 500) {
          setError('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(errorData.message || '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        return;
      }

      // 토큰 저장
      const { accessToken, refreshToken } = response.data.data;
      // 토큰 저장
      setAccessToken(accessToken);
      // 리프레시 토큰 저장
      setCookie("refreshToken", refreshToken, {
        expires: new Date(new Date().setDate(new Date().getDate() + 14)),
      });
      
      // React Native 앱에서 토큰 저장
      if (typeof window !== 'undefined' && window.ReactNativeWebView) {
        console.log('refreshToken', refreshToken);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'TOKEN_UPDATE',
          token: refreshToken
        }));
      }

      // 로그인 성공 시 스토어 목록 페이지로 이동
      router.push('/bizes');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-xl font-medium">사장님 로그인</h1>
          <p className="text-white/80 text-sm mt-1">
            스토어 관리를 위한 사장님 계정으로 로그인하세요
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="max-w-md mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                placeholder="이메일 주소"
                disabled={loading}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                placeholder="비밀번호"
                disabled={loading}
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className={`w-full py-4 px-4 rounded-lg text-white font-medium ${
              loading ? 'bg-[#FF7355]/50 cursor-not-allowed' : 'bg-[#FF7355] hover:bg-[#FF6344]'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                또는
              </span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/bizes/register"
              className="w-full flex justify-center py-4 px-4 border-2 border-[#FF7355] rounded-lg font-medium text-[#FF7355] hover:bg-[#FF7355] hover:text-white transition-colors"
            >
              사장님 계정 만들기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
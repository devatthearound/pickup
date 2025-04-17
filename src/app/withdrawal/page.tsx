'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAxios } from '@/hooks/useAxios';

export default function WithdrawalPage() {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuth();
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWithdrawal = async () => {
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('정말로 탈퇴하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete('/users/me');
      
      // 로그아웃 처리
      setAccessToken(null);
      router.push('/bizes/login');
    } catch (err) {
      console.error('탈퇴 실패:', err);
      setError('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">계정 탈퇴</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              계정을 탈퇴하면 모든 데이터가 삭제되며, 복구가 불가능합니다.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h2 className="text-red-800 font-medium mb-2">주의사항</h2>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• 모든 개인 정보가 삭제됩니다.</li>
                <li>• 작성한 모든 게시물이 삭제됩니다.</li>
                <li>• 진행 중인 주문이 있다면 취소됩니다.</li>
                <li>• 탈퇴 후에는 계정을 복구할 수 없습니다.</li>
              </ul>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              onClick={handleWithdrawal}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isLoading ? '처리 중...' : '계정 탈퇴하기'}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

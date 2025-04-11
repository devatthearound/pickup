'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAxios } from '@/hooks/useAxios';

interface Benefit {
  id: number;
  storeId: number;
  title: string;
  description: string;
  condition?: string;
  isActive: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function BenefitsPage() {
  const { storeId } = useParams();
  const axiosInstance = useAxios();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newBenefit, setNewBenefit] = useState<Partial<Benefit>>({
    title: '',
    description: '',
    condition: '',
    isActive: true,
    displayOrder: 0,
    storeId: Number(storeId)
  });

  // 혜택 목록 조회
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axiosInstance.get(`/stores/${storeId}/benefits`);
        if (response.status !== 200) {
          throw new Error('혜택 목록을 불러오는데 실패했습니다');
        }
        const apiResponse: ApiResponse<PaginatedResponse<Benefit>> = await response.data;
        setBenefits(apiResponse.data.data || []);
      } catch (error) {
        console.error('혜택 목록 로딩 실패:', error);
        toast.error('혜택 목록을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenefits();
  }, [storeId]);

  // 혜택 추가
  const addBenefit = async () => {
    if (!newBenefit.title) {
      toast.error('혜택 제목을 입력해주세요');
      return;
    }
    if (!newBenefit.description) {
      toast.error('혜택 설명을 입력해주세요');
      return;
    }

    try {
      const response = await axiosInstance.post(`/stores/${storeId}/benefits`, newBenefit);

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '혜택 추가에 실패했습니다');
      }

      const apiResponse: ApiResponse<Benefit> = await response.data;
      setBenefits([...benefits, apiResponse.data]);
      setNewBenefit({
        title: '',
        description: '',
        condition: '',
        isActive: true,
        displayOrder: 0,
        storeId: Number(storeId)
      });
      toast.success('혜택이 추가되었습니다');
    } catch (error) {
      console.error('혜택 추가 실패:', error);
      toast.error(error instanceof Error ? error.message : '혜택 추가에 실패했습니다');
    }
  };

  // 혜택 삭제
  const deleteBenefit = async (benefitId: number) => {
    try {
      const response = await axiosInstance.delete(`/stores/benefits/${benefitId}`);

      if (response.status !== 200) {
        throw new Error('혜택 삭제에 실패했습니다');
      }

      const apiResponse: ApiResponse<{ id: number; deleted: boolean }> = await response.data;
      if (apiResponse.data.deleted) {
        setBenefits(benefits.filter(benefit => benefit.id !== benefitId));
        toast.success('혜택이 삭제되었습니다');
      }
    } catch (error) {
      console.error('혜택 삭제 실패:', error);
      toast.error('혜택 삭제에 실패했습니다');
    }
  };

  // 혜택 수정
  const updateBenefit = async (benefitId: number, updatedBenefit: Partial<Benefit>) => {
    try {
      const response = await axiosInstance.patch(`/stores/benefits/${benefitId}`, updatedBenefit);

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '혜택 수정에 실패했습니다');
      }
      
      setBenefits(benefits.map(benefit => 
        benefit.id === benefitId 
          ? { ...benefit, isActive: !benefit.isActive } 
          : benefit
      ));
      
      toast.success(`혜택이 ${updatedBenefit.isActive ? '활성화' : '비활성화'}되었습니다`);
    } catch (error) {
      console.error('혜택 수정 실패:', error);
      toast.error(error instanceof Error ? error.message : '혜택 수정에 실패했습니다');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">혜택 관리</h1>
      </div>

      {/* 혜택 관리 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">새로운 혜택 추가</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">혜택 제목 *</label>
              <input
                type="text"
                value={newBenefit.title}
                onChange={(e) => setNewBenefit({ ...newBenefit, title: e.target.value })}
                placeholder="혜택 제목을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">혜택 설명 *</label>
              <input
                type="text"
                value={newBenefit.description}
                onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                placeholder="혜택 내용을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">적용 조건 (선택사항)</label>
              <input
                type="text"
                value={newBenefit.condition || ''}
                onChange={(e) => setNewBenefit({ ...newBenefit, condition: e.target.value })}
                placeholder="예: 15,000원 이상 구매 시"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              />
            </div>
            <button
              onClick={addBenefit}
              className="w-full py-2 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
            >
              혜택 추가
            </button>
          </div>
        </div>

        {/* 혜택 목록 */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">혜택 목록</h2>
          <div className="space-y-4">
            {benefits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                등록된 혜택이 없습니다.
              </div>
            ) : (
              benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{benefit.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{benefit.description}</div>
                      {benefit.condition && (
                        <div className="text-sm text-gray-500 mt-1">조건: {benefit.condition}</div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        상태: {benefit.isActive ? '활성' : '비활성'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBenefit(benefit.id, { isActive: !benefit.isActive })}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          benefit.isActive 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {benefit.isActive ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => deleteBenefit(benefit.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
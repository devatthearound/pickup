'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Benefit {
  id: string;
  description: string;
  condition?: string;
}

export default function BenefitsPage() {
  const router = useRouter();
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', description: '도넛 1개 추가 증정', condition: '15,000원 이상' },
    { id: '2', description: '음료 사이즈업 무료', condition: '' },
    { id: '3', description: '포장 박스 무료 제공', condition: '' },
  ]);

  const [newBenefit, setNewBenefit] = useState<Benefit>({
    id: '',
    description: '',
    condition: '',
  });

  const addBenefit = () => {
    if (newBenefit.description) {
      setBenefits([...benefits, { ...newBenefit, id: Date.now().toString() }]);
      setNewBenefit({ id: '', description: '', condition: '' });
    }
  };

  const handleSave = () => {
    console.log({ benefits });
    router.push('/store');
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">도넛캠프 - 혜택 관리</h1>
      </div>

      {/* 혜택 관리 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">새로운 혜택 추가</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">혜택 설명</label>
              <input
                type="text"
                value={newBenefit.description}
                onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })}
                placeholder="혜택 내용을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
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
                  <div className="font-medium">{benefit.description}</div>
                  {benefit.condition && (
                    <div className="text-sm text-gray-500 mt-1">조건: {benefit.condition}</div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const updatedBenefits = benefits.filter(b => b.id !== benefit.id);
                        setBenefits(updatedBenefits);
                      }}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
        >
          저장하기
        </button>
      </div>
    </div>
  );
} 
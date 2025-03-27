'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export default function StoreSetupPage() {
  const router = useRouter();
  
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: '월', open: '09:00', close: '18:00', isOpen: true },
    { day: '화', open: '09:00', close: '18:00', isOpen: true },
    { day: '수', open: '09:00', close: '18:00', isOpen: true },
    { day: '목', open: '09:00', close: '18:00', isOpen: true },
    { day: '금', open: '09:00', close: '18:00', isOpen: true },
    { day: '토', open: '09:00', close: '18:00', isOpen: true },
    { day: '일', open: '09:00', close: '18:00', isOpen: false },
  ]);

  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setBusinessHours(updatedHours);
  };

  const handleSave = () => {
    // 여기에 저장 로직이 들어갑니다
    console.log({ businessHours });
    router.push('/store');
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">도넛캠프 - 스토어 설정</h1>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6 pb-24">
        {/* 영업시간 관리 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">영업시간 설정</h2>
          <div className="space-y-4">
            {businessHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center space-x-4">
                <div className="w-10 font-medium">{hours.day}</div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => updateBusinessHours(index, 'isOpen', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
                  />
                  <span className="text-sm text-gray-600">영업</span>
                </label>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => updateBusinessHours(index, 'open', e.target.value)}
                  disabled={!hours.isOpen}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => updateBusinessHours(index, 'close', e.target.value)}
                  disabled={!hours.isOpen}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            ))}
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
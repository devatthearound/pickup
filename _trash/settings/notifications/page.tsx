'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NotificationSettings {
  orderStatus: boolean;
  marketing: boolean;
  pickup: boolean;
  review: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    orderStatus: true,
    marketing: false,
    pickup: true,
    review: true
  });

  useEffect(() => {
    // localStorage에서 알림 설정 가져오기
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-[140px]">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-4 flex items-center relative">
        <button 
          onClick={() => router.back()} 
          className="absolute left-4"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium w-full text-center">알림 설정</h1>
      </div>

      {/* 알림 설정 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">주문 상태 알림</h3>
              <p className="text-sm text-gray-500 mt-1">주문 접수, 준비 완료 등 상태 변경 알림</p>
            </div>
            <button
              onClick={() => handleToggle('orderStatus')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.orderStatus ? 'bg-[#FF7355]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.orderStatus ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">픽업 알림</h3>
              <p className="text-sm text-gray-500 mt-1">픽업 시간 안내 및 리마인드 알림</p>
            </div>
            <button
              onClick={() => handleToggle('pickup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pickup ? 'bg-[#FF7355]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pickup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">리뷰 알림</h3>
              <p className="text-sm text-gray-500 mt-1">리뷰 작성 요청 및 답변 알림</p>
            </div>
            <button
              onClick={() => handleToggle('review')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.review ? 'bg-[#FF7355]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.review ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">마케팅 알림</h3>
              <p className="text-sm text-gray-500 mt-1">이벤트, 프로모션 등 혜택 알림</p>
            </div>
            <button
              onClick={() => handleToggle('marketing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.marketing ? 'bg-[#FF7355]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.marketing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
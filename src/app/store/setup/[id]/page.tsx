'use client';

import { useState, useRef } from 'react';
import StoreProfileImage from '@/components/StoreProfileImage';
import { useStoreProfile } from '@/store/useStoreProfile';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface StoreProfile {
  name: string;
  description: string;
  address: string;
  businessHours: string;
  businessHoursDetail: BusinessHours[];
}

export default function StoreSetupPage({ params }: { params: { id: string } }) {
  const { imageUrl, setImageUrl } = useStoreProfile();
  const [profile, setProfile] = useState<StoreProfile>({
    name: '도넛캠프',
    description: '매일 구워내는 따뜻한 도넛',
    address: '서울시 마포구 연남로 123길 34',
    businessHours: '10:00-20:00',
    businessHoursDetail: [
      { day: '월', open: '10:00', close: '20:00', isOpen: true },
      { day: '화', open: '10:00', close: '20:00', isOpen: true },
      { day: '수', open: '10:00', close: '20:00', isOpen: true },
      { day: '목', open: '10:00', close: '20:00', isOpen: true },
      { day: '금', open: '10:00', close: '20:00', isOpen: true },
      { day: '토', open: '10:00', close: '20:00', isOpen: true },
      { day: '일', open: '10:00', close: '20:00', isOpen: false },
    ]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBusinessHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const updatedHours = [...profile.businessHoursDetail];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setProfile(prev => ({
      ...prev,
      businessHoursDetail: updatedHours
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출하여 프로필 업데이트
    console.log('Updated profile:', profile);
  };

  const [aboutText, setAboutText] = useState(`도넛캠프는 매일 아침 신선한 재료로 정성스럽게 만드는 수제 도넛 전문점입니다. 클래식한 도넛부터 시즌 한정 도넛까지, 다양한 맛을 경험해보세요.

• 최소 30분 전 예약 필수

• 당일 픽업 가능

• 대량 주문 문의 (카카오톡: @donutcamp)`);

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAboutText(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">스토어 설정</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-4">
          <StoreProfileImage
            name={profile.name}
            imageUrl={imageUrl || undefined}
            size="lg"
            onClick={handleImageClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 스토어 정보 폼 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              스토어 이름
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소개글
            </label>
            <input
              type="text"
              value={profile.description}
              onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대표 영업시간
            </label>
            <input
              type="text"
              value={profile.businessHours}
              onChange={(e) => setProfile(prev => ({ ...prev, businessHours: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            />
          </div>
        </div>

        {/* 요일별 영업시간 설정 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">요일별 영업시간 설정</h2>
          <div className="space-y-3">
            {profile.businessHoursDetail.map((hours, index) => (
              <div key={hours.day} className="flex items-center gap-4">
                <div className="w-8 font-medium text-gray-700">{hours.day}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleBusinessHoursChange(index, 'isOpen', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
                  />
                  <span className="text-sm text-gray-600">영업</span>
                </label>
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                  disabled={!hours.isOpen}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                  disabled={!hours.isOpen}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">소개글</h2>
          <textarea
            value={aboutText}
            onChange={handleAboutChange}
            className="w-full h-40 p-2 border rounded-lg"
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF7355]/90 transition-colors"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
} 
'use client';

import { useState, useRef, useEffect } from 'react';
import StoreProfileImage from '@/components/StoreProfileImage';
import { useStoreProfile } from '@/store/useStoreProfile';
import { useParams } from 'next/navigation';

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

interface ApiResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  businessHours: string;
  businessHoursDetail: BusinessHours[];
}

// API 응답 타입 정의 수정
interface StoreDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    ownerId: number;
    owner: {
      id: number;
      firstName: string;
      lastName: string;
      profileImage: string | null;
    };
    name: string;
    englishName: string;
    businessRegistrationNumber: string;
    businessRegistrationFile: string;
    categoryId: number;
    address: string;
    addressDetail: string;
    phone: string;
    businessHours: string;
    description: string;
    logoImage: string | null;
    bannerImage: string | null;
    isVerified: boolean;
    isActive: boolean;
  };
}

// 영업시간 API 응답 타입 정의 수정
interface OperatingHoursResponse {
  success: boolean;
  message: string;
  data: {
    operatingHours: Array<{
      id: number;
      dayOfWeek: string;
      openingTime: string;
      closingTime: string;
      isDayOff: boolean;
    }>;
    operatingHoursByDay: Record<string, {
      id: number;
      dayOfWeek: string;
      openingTime: string;
      closingTime: string;
      isDayOff: boolean;
    }>;
  };
}

export default function StoreSetupPage({ params }: { params: { storeId: string } }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const { storeId } = useParams();


  // 영업시간 데이터 로딩
  const fetchOperatingHours = async (storeId: number) => {
    setIsLoadingHours(true);
    try {
      const response = await fetch(`http://localhost:3001/api/stores/${storeId}/operating-hours`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('영업시간 정보를 불러오는데 실패했습니다.');
      }

      const responseData: OperatingHoursResponse = await response.json();
      
      // 기본 영업시간 설정
      const defaultHours: BusinessHours[] = [
        { day: '월', open: '10:00', close: '20:00', isOpen: true },
        { day: '화', open: '10:00', close: '20:00', isOpen: true },
        { day: '수', open: '10:00', close: '20:00', isOpen: true },
        { day: '목', open: '10:00', close: '20:00', isOpen: true },
        { day: '금', open: '10:00', close: '20:00', isOpen: true },
        { day: '토', open: '10:00', close: '20:00', isOpen: true },
        { day: '일', open: '10:00', close: '20:00', isOpen: false },
      ];

      // API 데이터가 있는 경우 해당 데이터로 업데이트
      if (responseData.data.operatingHours.length > 0) {
        responseData.data.operatingHours.forEach(hour => {
          const dayIndex = getDayIndex(hour.dayOfWeek);
          if (dayIndex !== -1) {
            defaultHours[dayIndex] = {
              day: convertDayOfWeek(hour.dayOfWeek),
              open: hour.openingTime,
              close: hour.closingTime,
              isOpen: !hour.isDayOff,
            };
          }
        });
      }

      setProfile(prev => ({
        ...prev,
        businessHoursDetail: defaultHours
      }));
    } catch (error) {
      console.error('영업시간 로딩 실패:', error);
    } finally {
      setIsLoadingHours(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;
      
      await fetchStoreData(Number(storeId));
      await fetchOperatingHours(Number(storeId));
    };

    fetchData();
  }, [storeId]);

  // 요일 변환 유틸리티 함수
  const convertDayOfWeek = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      'monday': '월',
      'tuesday': '화',
      'wednesday': '수',
      'thursday': '목',
      'friday': '금',
      'saturday': '토',
      'sunday': '일'
    };
    return dayMap[day.toLowerCase()] || day;
  };

  // 요일 인덱스 찾기 유틸리티 함수
  const getDayIndex = (day: string): number => {
    const dayMap: { [key: string]: number } = {
      'monday': 0,
      'tuesday': 1,
      'wednesday': 2,
      'thursday': 3,
      'friday': 4,
      'saturday': 5,
      'sunday': 6
    };
    return dayMap[day.toLowerCase()] ?? -1;
  };

  // 한글 요일을 영어로 변환하는 유틸리티 함수
  const convertDayToEnglish = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      '월': 'monday',
      '화': 'tuesday',
      '수': 'wednesday',
      '목': 'thursday',
      '금': 'friday',
      '토': 'saturday',
      '일': 'sunday'
    };
    return dayMap[day] || day;
  };

  // 영업시간 일괄 업데이트 함수 수정
  const updateOperatingHours = async (businessHoursDetail: BusinessHours[]) => {
    if (!storeId) return;

    try {
      const operatingHours = businessHoursDetail.map(hour => ({
        dayOfWeek: convertDayToEnglish(hour.day),
        openingTime: hour.open,
        closingTime: hour.close,
        isDayOff: !hour.isOpen
      }));

      const response = await fetch(`http://localhost:3001/api/stores/${storeId}/operating-hours/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operatingHours)
      });

      if (!response.ok) {
        throw new Error('영업시간 업데이트 실패');
      }
    } catch (error) {
      console.error('영업시간 업데이트 실패:', error);
      throw error;
    }
  };

  // fetchStoreData 함수도 수정
  const fetchStoreData = async (storeId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/stores/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('매장을 찾을 수 없습니다.');
        }
        throw new Error('매장 정보를 불러오는데 실패했습니다.');
      }

      const responseData: StoreDetailResponse = await response.json();
      const { data } = responseData;

      // 이미지 URL 설정
      if (data.logoImage) {
        setImageUrl(data.logoImage);
      }

      // 기본 정보 설정
      setProfile(prev => ({
        ...prev,
        name: data.name,
        description: data.description,
        address: `${data.address} ${data.addressDetail}`.trim(),
        businessHours: data.businessHours,
      }));

      // 상세 소개글 설정
      setAboutText(data.description);

    } catch (error) {
      console.error('매장 정보 로딩 실패:', error);
      alert(error instanceof Error ? error.message : '매장 정보를 불러오는데 실패했습니다.');
    }
  };

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
    setIsLoading(true);

    try {
      // 1. 기본 정보 업데이트
      const storeResponse = await fetch(`http://localhost:3001/api/stores/${storeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          description: profile.description,
          address: profile.address,
          businessHours: profile.businessHours,
        })
      });

      if (!storeResponse.ok) throw new Error('매장 정보 업데이트 실패');

      // 2. 영업시간 업데이트
      await updateOperatingHours(profile.businessHoursDetail);

      // TODO: 성공 메시지 표시
      alert('매장 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('매장 정보 업데이트 실패:', error);
      alert('매장 정보 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
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

        {/* 요일별 영업시간 설정 - 로딩 상태 추가 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">요일별 영업시간 설정</h2>
          {isLoadingHours ? (
            <div className="text-center py-4">영업시간을 불러오는 중...</div>
          ) : (
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
          )}
        </div>        {/* 저장 버튼 업데이트 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-[#FF7355] text-white rounded-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF7355]/90'
            }`}
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
} 
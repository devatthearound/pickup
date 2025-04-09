'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import StoreProfileImage from '@/components/StoreProfileImage';
import { useStoreProfile } from '@/store/useStoreProfile';
import axiosInstance from '@/lib/axios-interceptor';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface SpecialDay {
  id?: number;
  date: string;
  isClosed: boolean;
  openingTime?: string;
  closingTime?: string;
  reason?: string;
}

interface StoreInfo {
  id: number;
  name: string;
  englishName: string;
  description: string;
  address: string;
  addressDetail: string;
  phone: string;
  businessHours: string;
  logoImage: string | null;
  bannerImage?: string;
}

// 스토어 업데이트 응답 타입
interface UpdateStoreResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    englishName: string;
    description: string;
    address: string;
    addressDetail: string;
    phone: string;
    businessHours: string;
    logoImage: string | null;
  };
}

export default function StoreSetupPage() {
  const { storeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isHoursLoading, setIsHoursLoading] = useState(true);
  const [isSpecialDaysLoading, setIsSpecialDaysLoading] = useState(true);
  const [hasOperatingHoursData, setHasOperatingHoursData] = useState(false);
  const { imageUrl, setImageUrl } = useStoreProfile();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    id: Number(storeId),
    name: '',
    englishName: '',
    description: '',
    address: '',
    addressDetail: '',
    phone: '',
    businessHours: '',
    logoImage: null
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: '월', open: '', close: '', isOpen: false },
    { day: '화', open: '', close: '', isOpen: false },
    { day: '수', open: '', close: '', isOpen: false },
    { day: '목', open: '', close: '', isOpen: false },
    { day: '금', open: '', close: '', isOpen: false },
    { day: '토', open: '', close: '', isOpen: false },
    { day: '일', open: '', close: '', isOpen: false },
  ]);
  
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [newSpecialDay, setNewSpecialDay] = useState<SpecialDay>({
    date: '',
    isClosed: true,
    reason: ''
  });

  useEffect(() => {
    if (storeId) {
      fetchStoreInfo();
      fetchOperatingHours();
      fetchSpecialDays();
    }
  }, [storeId]);

  // 매장 기본 정보 조회
  const fetchStoreInfo = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`http://localhost:3001/api/stores/${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.status !== 200) {
        throw new Error('매장 정보를 불러오는데 실패했습니다');
      }

      const data = await response.data;
      
      if (data.success && data.data) {
        const storeData = data.data;
        setStoreInfo({
          id: storeData.id,
          name: storeData.name || '',
          englishName: storeData.englishName || '',
          description: storeData.description || '',
          address: storeData.address || '',
          addressDetail: storeData.addressDetail || '',
          phone: storeData.phone || '',
          businessHours: storeData.businessHours || '',
          logoImage: storeData.logoImage,
          bannerImage: storeData.bannerImage
        });

        if (storeData.logoImage) {
          setImageUrl(storeData.logoImage);
        }
      }
    } catch (error) {
      console.error('매장 정보 로딩 실패:', error);
      toast.error('매장 정보를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 영업시간 조회
  const fetchOperatingHours = async () => {
    setIsHoursLoading(true);
    setHasOperatingHoursData(false);
    try {
      const response = await axiosInstance.get(`http://localhost:3001/api/stores/${storeId}/operating-hours`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.status !== 200) {
        throw new Error('영업시간 정보를 불러오는데 실패했습니다');
      }

      const data = await response.data;

      if (data.success && data.data && data.data.operatingHours && data.data.operatingHours.length > 0) {
        const updatedHours = [...businessHours];
        let dataFound = false;

        data.data.operatingHours.forEach((hour: any) => {
          const dayIndex = getDayIndex(hour.dayOfWeek);
          if (dayIndex !== -1) {
            updatedHours[dayIndex] = {
              day: convertDayOfWeek(hour.dayOfWeek),
              open: hour.openingTime,
              close: hour.closingTime,
              isOpen: !hour.isDayOff
            };
            dataFound = true;
          }
        });

        setBusinessHours(updatedHours);
        setHasOperatingHoursData(dataFound);
      } else {
        setHasOperatingHoursData(false);
      }
    } catch (error) {
      console.error('영업시간 로딩 실패:', error);
      toast.error('영업시간 정보를 불러오는데 실패했습니다');
      setHasOperatingHoursData(false);
    } finally {
      setIsHoursLoading(false);
    }
  };

  // 스토어 정보 업데이트
  const updateStoreInfo = async () => {
    try {
      const formData = new FormData();
      
      // JSON 데이터 추가
      const jsonData = {
        name: storeInfo.name,
        englishName: storeInfo.englishName,
        description: storeInfo.description,
        address: storeInfo.address,
        addressDetail: storeInfo.addressDetail,
        phone: storeInfo.phone,
        businessHours: storeInfo.businessHours
      };
      
      // FormData에 JSON 데이터 추가
      formData.append('data', JSON.stringify(jsonData));
      
      // 로고 이미지가 있으면 추가
      if (logoFile) {
        formData.append('logoImage', logoFile);
      }

      // 배너 이미지가 있으면 추가
      if (bannerFile) {
        formData.append('bannerImage', bannerFile);
      }

      const response = await axiosInstance.patch(`http://localhost:3001/api/stores/${storeId}`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '스토어 정보 업데이트에 실패했습니다');
      }

      const responseData: UpdateStoreResponse = await response.data;
      
      if (responseData.success) {
        // 업데이트된 데이터로 상태 갱신
        setStoreInfo(responseData.data);
        
        // 로고 이미지 URL 업데이트
        if (responseData.data.logoImage) {
          setImageUrl(responseData.data.logoImage);
        }
        
        toast.success('스토어 정보가 성공적으로 업데이트되었습니다');
      } else {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (error) {
      console.error('스토어 정보 업데이트 실패:', error);
      toast.error(error instanceof Error ? error.message : '스토어 정보 업데이트에 실패했습니다');
      throw error;
    }
  };

  // 영업시간 업데이트
  const updateOperatingHours = async () => {
    try {
      const operatingHoursData = businessHours.map(hour => ({
        dayOfWeek: convertDayToEnglish(hour.day),
        openingTime: hour.isOpen ? hour.open : null,
        closingTime: hour.isOpen ? hour.close : null,
        isDayOff: !hour.isOpen
      }));

      const response = await axiosInstance.post(`http://localhost:3001/api/stores/${storeId}/operating-hours/bulk`, operatingHoursData);

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '영업시간 업데이트에 실패했습니다');
      }

      const responseData = await response.data;

      if (responseData.success !== false) {
        toast.success('영업시간이 성공적으로 업데이트되었습니다.');
        fetchOperatingHours();
        return responseData;
      } else {
        throw new Error(responseData.message || '영업시간 업데이트 응답 실패');
      }
    } catch (error) {
      console.error('영업시간 업데이트 실패:', error);
      toast.error(error instanceof Error ? error.message : '영업시간 업데이트 중 오류가 발생했습니다.');
      throw error;
    }
  };

  // 특별 영업일/휴무일 조회
  const fetchSpecialDays = async () => {
    setIsSpecialDaysLoading(true);
    try {
      const response = await axiosInstance.get(`http://localhost:3001/api/stores/${storeId}/special-days`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.status !== 200) {
        throw new Error('특별 영업일/휴무일 정보를 불러오는데 실패했습니다');
      }

      const data = await response.data;
      
      if (data.success && data.data) {
        setSpecialDays(data.data.map((item: any) => ({
          id: item.id,
          date: item.date.split('T')[0], // ISO 형식에서 날짜만 추출
          isClosed: item.isClosed,
          openingTime: item.openingTime,
          closingTime: item.closingTime,
          reason: item.reason
        })));
      }
    } catch (error) {
      console.error('특별 영업일/휴무일 로딩 실패:', error);
      toast.error('특별 영업일/휴무일 정보를 불러오는데 실패했습니다');
    } finally {
      setIsSpecialDaysLoading(false);
    }
  };

  // 새 특별 영업일/휴무일 추가
  const addSpecialDay = async () => {
    if (!newSpecialDay.date) {
      toast.error('날짜를 선택해주세요');
      return;
    }

    try {
      const payload = {
        date: newSpecialDay.date,
        isClosed: newSpecialDay.isClosed
      };

      // 영업일인 경우 시간 정보 추가
      if (!newSpecialDay.isClosed) {
        if (!newSpecialDay.openingTime || !newSpecialDay.closingTime) {
          toast.error('영업 시간을 입력해주세요');
          return;
        }
        Object.assign(payload, {
          openingTime: newSpecialDay.openingTime,
          closingTime: newSpecialDay.closingTime
        });
      }

      // 사유가 있는 경우 추가
      if (newSpecialDay.reason) {
        Object.assign(payload, { reason: newSpecialDay.reason });
      }

      const response = await axiosInstance.post(`http://localhost:3001/api/stores/${storeId}/special-days`, payload);

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '특별 영업일/휴무일 추가에 실패했습니다');
      }

      const data = await response.data;
      
      if (data.success) {
        toast.success('특별 영업일/휴무일이 추가되었습니다');
        setNewSpecialDay({
          date: '',
          isClosed: true,
          reason: ''
        });
        fetchSpecialDays(); // 목록 새로고침
      }
    } catch (error) {
      console.error('특별 영업일/휴무일 추가 실패:', error);
      toast.error('특별 영업일/휴무일 추가에 실패했습니다');
    }
  };

  // 특별 영업일/휴무일 삭제
  const deleteSpecialDay = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`http://localhost:3001/api/stores/${storeId}/special-days/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '특별 영업일/휴무일 삭제에 실패했습니다');
      }

      const data = await response.data;
      
      if (data.success) {
        toast.success('특별 영업일/휴무일이 삭제되었습니다');
        setSpecialDays(specialDays.filter(day => day.id !== id));
      }
    } catch (error) {
      console.error('특별 영업일/휴무일 삭제 실패:', error);
      toast.error('특별 영업일/휴무일 삭제에 실패했습니다');
    }
  };

  // 기본 정보만 저장하는 함수
  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 필수 필드 검증
      if (!storeInfo.name || !storeInfo.address || !storeInfo.phone || !storeInfo.businessHours) {
        toast.error('필수 정보를 모두 입력해주세요');
        return;
      }

      // 스토어 정보 업데이트
      await updateStoreInfo();
      toast.success('기본 정보가 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('저장 실패:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 영업시간만 저장하는 함수
  const handleOperatingHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 영업시간 업데이트
      await updateOperatingHours();
      toast.success('영업시간이 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('영업시간 저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  // 스토어 정보 입력 변경 처리
  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 영업시간 변경 처리
  const handleBusinessHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setBusinessHours(updatedHours);
  };

  // 로고 이미지 변경 처리
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 이름이 없는 경우 현재 시간을 사용
      const fileName = file.name || `logo-${Date.now()}.${file.type.split('/')[1]}`;
      const renamedFile = new File([file], fileName, { type: file.type });
      setLogoFile(renamedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 배너 이미지 변경 처리
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name || `banner-${Date.now()}.${file.type.split('/')[1]}`;
      const renamedFile = new File([file], fileName, { type: file.type });
      setBannerFile(renamedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreInfo(prev => ({
          ...prev,
          bannerImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 유틸리티 함수: 요일 변환
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

  // 유틸리티 함수: 요일 인덱스 찾기
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

  // 유틸리티 함수: 한글 요일을 영어로 변환
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">스토어 설정</h1>
      
      {/* 기본 정보 폼 */}
      <form onSubmit={handleBasicInfoSubmit} className="space-y-8">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-4">
          <StoreProfileImage
            name={storeInfo.name}
            imageUrl={imageUrl || undefined}
            size="lg"
            onClick={() => document.getElementById('logoInput')?.click()}
          />
          <input
            type="file"
            id="logoInput"
            onChange={handleLogoChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-gray-500">이미지를 클릭하여 로고 변경</p>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">기본 정보</h2>

          {/* 배너 이미지 표시 및 변경 */}
          {storeInfo.bannerImage && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                배너 이미지
              </label>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden relative group">
                <img
                  src={storeInfo.bannerImage}
                  alt={`${storeInfo.name} 배너 이미지`}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => document.getElementById('bannerInput')?.click()}
                    className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    배너 이미지 변경
                  </button>
                </div>
              </div>
              <input
                type="file"
                id="bannerInput"
                onChange={handleBannerChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                스토어 이름 (한글) *
              </label>
              <input
                type="text"
                name="name"
                value={storeInfo.name}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                스토어 이름 (영문)
              </label>
              <input
                type="text"
                name="englishName"
                value={storeInfo.englishName}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소 *
              </label>
              <input
                type="text"
                name="address"
                value={storeInfo.address}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상세 주소
              </label>
              <input
                type="text"
                name="addressDetail"
                value={storeInfo.addressDetail}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호 *
              </label>
              <input
                type="text"
                name="phone"
                value={storeInfo.phone}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대표 영업시간 *
              </label>
              <input
                type="text"
                name="businessHours"
                value={storeInfo.businessHours}
                onChange={handleStoreInfoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                placeholder="예: 10:00-20:00"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매장 소개
              </label>
              <textarea
                name="description"
                value={storeInfo.description}
                onChange={handleStoreInfoChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              ></textarea>
            </div>
          </div>
          
          {/* 기본 정보 저장 버튼 */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 bg-[#FF7355] text-white rounded-lg transition-colors ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF7355]/90'
              }`}
            >
              {isSaving ? '저장 중...' : '기본 정보 저장'}
            </button>
          </div>
        </div>
      </form>

      {/* 영업시간 폼 */}
      <form onSubmit={handleOperatingHoursSubmit} className="space-y-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">요일별 영업시간 설정</h2>

          {isHoursLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF7355]"></div>
            </div>
          ) : !hasOperatingHoursData ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-sm text-yellow-700">
                설정된 영업시간 정보가 없습니다.
                <br/>
                영업시간을 설정하고 '영업시간 저장' 버튼을 눌러주세요.
              </p>
            </div>
          ) : null}

          {(!isHoursLoading) && (
            <div className="space-y-4">
              {businessHours.map((hours, index) => (
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
                    value={hours.open || ''}
                    onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                    disabled={!hours.isOpen}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                  />
                  <span className="text-gray-400">~</span>
                  <input
                    type="time"
                    value={hours.close || ''}
                    onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                    disabled={!hours.isOpen}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSaving || isHoursLoading}
              className={`px-6 py-3 bg-[#FF7355] text-white rounded-lg transition-colors ${
                (isSaving || isHoursLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF7355]/90'
              }`}
            >
              {isSaving ? '저장 중...' : '영업시간 저장'}
            </button>
          </div>
        </div>
      </form>

      {/* 특별 영업일/휴무일 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-lg font-medium mb-4">특별 영업일/휴무일 설정</h2>
        
        {/* 새 특별일 추가 폼 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-medium mb-3">새 특별일 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜 *</label>
              <input
                type="date"
                value={newSpecialDay.date}
                onChange={(e) => setNewSpecialDay({...newSpecialDay, date: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종류</label>
              <div className="flex items-center gap-4 h-10">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={newSpecialDay.isClosed}
                    onChange={() => setNewSpecialDay({...newSpecialDay, isClosed: true})}
                    className="w-4 h-4 text-[#FF7355] focus:ring-[#FF7355]"
                  />
                  <span className="text-sm">휴무일</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!newSpecialDay.isClosed}
                    onChange={() => setNewSpecialDay({...newSpecialDay, isClosed: false})}
                    className="w-4 h-4 text-[#FF7355] focus:ring-[#FF7355]"
                  />
                  <span className="text-sm">특별 영업일</span>
                </label>
              </div>
            </div>
            
            {!newSpecialDay.isClosed && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">오픈 시간 *</label>
                  <input
                    type="time"
                    value={newSpecialDay.openingTime || ''}
                    onChange={(e) => setNewSpecialDay({...newSpecialDay, openingTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    required={!newSpecialDay.isClosed}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">마감 시간 *</label>
                  <input
                    type="time"
                    value={newSpecialDay.closingTime || ''}
                    onChange={(e) => setNewSpecialDay({...newSpecialDay, closingTime: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    required={!newSpecialDay.isClosed}
                  />
                </div>
              </>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
              <input
                type="text"
                value={newSpecialDay.reason || ''}
                onChange={(e) => setNewSpecialDay({...newSpecialDay, reason: e.target.value})}
                placeholder={newSpecialDay.isClosed ? "예: 명절 휴무" : "예: 연장 영업"}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={addSpecialDay}
                className="w-full py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF7355]/90 transition-colors"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
        
        {/* 특별일 목록 */}
        <div>
          <h3 className="text-md font-medium mb-3">등록된 특별 영업일/휴무일</h3>
          
          {isSpecialDaysLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF7355]"></div>
            </div>
          ) : specialDays.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              등록된 특별 영업일/휴무일이 없습니다
            </div>
          ) : (
            <div className="space-y-2">
              {specialDays.map((day) => (
                <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{day.date}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        day.isClosed 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {day.isClosed ? '휴무일' : '특별 영업일'}
                      </span>
                    </div>
                    {!day.isClosed && (
                      <div className="text-sm text-gray-600">
                        {day.openingTime} ~ {day.closingTime}
                      </div>
                    )}
                    {day.reason && (
                      <div className="text-sm text-gray-600">
                        사유: {day.reason}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => day.id && deleteSpecialDay(day.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
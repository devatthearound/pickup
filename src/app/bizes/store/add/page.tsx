'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAxios } from '@/hooks/useAxios';

interface StoreFormData {
  name: string;
  englishName: string;
  businessRegistrationNumber: string;
  businessRegistrationFile: File | null;
  categoryId: string;
  address: string;
  addressDetail: string;
  phone: string;
  businessHours: string;
  description: string;
  logoImage: File | null;
  bannerImage: File | null;
}

export default function StoreRegisterPage() {
  const router = useRouter();
  const axiosInstance = useAxios();

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    englishName: '',
    businessRegistrationNumber: '',
    businessRegistrationFile: null,
    categoryId: '',
    address: '',
    addressDetail: '',
    phone: '',
    businessHours: '',
    description: '',
    logoImage: null,
    bannerImage: null
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // FormData 객체 생성
      const formDataToSend = new FormData();

      // 파일이 아닌 데이터 추가
      const jsonData = {
        name: formData.name,
        englishName: formData.englishName,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        categoryId: parseInt(formData.categoryId),
        address: formData.address,
        addressDetail: formData.addressDetail,
        phone: formData.phone,
        businessHours: formData.businessHours,
        description: formData.description,
        isVerified: false,
        isActive: true
      };

      // JSON 데이터를 FormData에 추가
      formDataToSend.append('data', JSON.stringify(jsonData));

      // 파일 데이터 추가
      if (formData.businessRegistrationFile) {
        formDataToSend.append('businessRegistrationFile', formData.businessRegistrationFile);
      }
      if (formData.logoImage) {
        formDataToSend.append('logoImage', formData.logoImage);
      }
      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }

      const response = await axiosInstance.post('/stores', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status !== 201) {
        const errorData = await response.data;
        
        switch (response.status) {
          case 400:
            throw new Error('입력하신 정보를 다시 확인해주세요.');
          case 401:
            router.push('/login');
            return;
          case 403:
            throw new Error('스토어 등록 권한이 없습니다.');
          case 409:
            throw new Error('이미 등록된 사업자 등록 번호입니다.');
          default:
            throw new Error(errorData.message || '스토어 등록 중 오류가 발생했습니다.');
        }
      }

      // 성공 시 스토어 목록 페이지로 이동
      router.push('/bizes');
    } catch (error) {
      console.error('스토어 등록 실패:', error);
      setError(error instanceof Error ? error.message : '스토어 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#FF7355] py-4 w-full">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={() => router.back()} 
            className="p-2"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-medium ml-2">스토어 등록</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto pb-20">
        {error && (
          <div className="mx-4 mt-4">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 bg-white mt-4 rounded-lg">
          {/* 기본 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">기본 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">매장명 (한글)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">매장명 (영문)</label>
                <input
                  type="text"
                  name="englishName"
                  value={formData.englishName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">업종 분류</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                >
                  <option value="">업종을 선택해주세요</option>
                  <option value="1">한식</option>
                  <option value="2">중식</option>
                  <option value="3">일식</option>
                  <option value="4">카페</option>
                </select>
              </div>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">사업자 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
                <input
                  type="text"
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  placeholder="000-00-00000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록증</label>
                <input
                  type="file"
                  name="businessRegistrationFile"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* 매장 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">매장 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 주소</label>
                <input
                  type="text"
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  placeholder="02-0000-0000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">영업시간</label>
                <input
                  type="text"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  placeholder="예: 09:00-18:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">매장 설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* 이미지 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">매장 이미지</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지</label>
                <input
                  type="file"
                  name="logoImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지</label>
                <input
                  type="file"
                  name="bannerImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors text-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                스토어 등록 중...
              </span>
            ) : (
              '스토어 등록하기'
            )}
          </button>
        </form>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="flex justify-around">
          <Link href="/customer" className="flex flex-col items-center py-3 px-6">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="mt-1 text-xs text-gray-500">홈</span>
          </Link>
          <Link href="/customer/pickup-time" className="flex flex-col items-center py-3 px-6">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="mt-1 text-xs text-gray-500">픽업정보</span>
          </Link>
          <Link href="/customer/profile" className="flex flex-col items-center py-3 px-6">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="mt-1 text-xs text-gray-500">마이페이지</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 
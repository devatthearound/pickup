'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function StoreRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    businessNumber: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 여기에 회원가입 로직이 들어갑니다
    router.push('/store/setup/1');
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
        {/* 등록 폼 */}
        <div className="p-4 bg-white mt-4 rounded-lg">
          {/* 섹션 1: 기본 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">기본 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">매장명</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="매장 이름을 입력해주세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대표자명</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="대표자 이름을 입력해주세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 섹션 2: 계정 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">계정 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* 섹션 3: 사업자 정보 */}
          <div className="mb-8">
            <h2 className="font-medium mb-3">사업자 정보</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
                <input
                  type="text"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="000-00-00000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">매장 주소</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors text-gray-900"
                  placeholder="매장 주소를 입력해주세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 등록하기 버튼 */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors text-lg"
          >
            등록하기
          </button>
        </div>
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
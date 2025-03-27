'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
        <h1 className="text-white text-lg font-medium w-full text-center">스토어 등록</h1>
      </div>

      {/* 등록 폼 */}
      <div className="flex-1 px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">매장명</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="매장 이름을 입력해주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">대표자명</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="대표자 이름을 입력해주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="010-0000-0000"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
            <input
              type="text"
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="000-00-00000"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">매장 주소</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF7355] focus:ring-1 focus:ring-[#FF7355] outline-none transition-colors"
              placeholder="매장 주소를 입력해주세요"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors mt-8"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
} 
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PersonalInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URL 파라미터 가져오기
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  // 로그인 상태 확인
  useEffect(() => {
    // 실제로는 로그인 상태를 확인하는 로직이 필요합니다
    const checkLoginStatus = async () => {
      try {
        // localStorage에서 사용자 정보 확인
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const { name: savedName, phone: savedPhone } = JSON.parse(userInfo);
          // 저장된 정보가 있으면 예약 확인 페이지로 이동
          router.push(`/customer/reservation-success?date=${date}&time=${time}&name=${savedName}&phone=${savedPhone}`);
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [router, date, time]);

  // 전화번호 형식 검증
  const validatePhone = (phone: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  // 전화번호 자동 하이픈 추가
  const formatPhone = (value: string) => {
    const numbers = value.replace(/-/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return numbers.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return numbers.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
  };

  // 전화번호 입력 처리
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedPhone = formatPhone(value);
    setPhone(formattedPhone);
    validateForm(name, formattedPhone);
  };

  // 이름 입력 처리
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateForm(value, phone);
  };

  // 폼 유효성 검사
  const validateForm = (name: string, phone: string) => {
    setIsValid(
      name.length >= 2 && 
      validatePhone(phone) && 
      termsAgreed && 
      privacyAgreed
    );
  };

  // 약관 동의 처리
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    switch (name) {
      case 'terms':
        setTermsAgreed(checked);
        break;
      case 'privacy':
        setPrivacyAgreed(checked);
        break;
      case 'marketing':
        setMarketingAgreed(checked);
        break;
    }
    validateForm(name, phone);
  };

  // 전체 약관 동의
  const handleAllTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
    setMarketingAgreed(checked);
    validateForm(name, phone);
  };

  // 확인 버튼 처리
  const handleConfirm = () => {
    if (isValid) {
      // 전화번호를 기반으로 userId 생성 (하이픈 제거 후 사용)
      const cleanPhone = phone.replace(/-/g, '');
      const userId = `USER_${cleanPhone}`;
      
      // 사용자 정보 저장
      const userInfo = {
        userId,
        name,
        phone,
        marketingAgreed,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // 예약 확인 페이지로 이동
      router.push(`/customer/reservation-success?date=${date}&time=${time}&name=${name}&phone=${phone}`);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>;
  }

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
        <h1 className="text-white text-lg font-medium w-full text-center">회원 정보 입력</h1>
      </div>

      {/* 입력 폼 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              이름 (닉네임)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium mb-2">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="전화번호를 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]"
            />
            <p className="mt-2 text-sm text-gray-500">
              * 픽업 관련 안내를 받으실 연락처를 입력해주세요
            </p>
          </div>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allTerms"
              onChange={handleAllTermsChange}
              checked={termsAgreed && privacyAgreed && marketingAgreed}
              className="w-5 h-5 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
            />
            <label htmlFor="allTerms" className="ml-2 block font-medium">
              전체 약관 동의
            </label>
          </div>
          <div className="space-y-2 pl-7">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                onChange={handleTermsChange}
                checked={termsAgreed}
                className="w-4 h-4 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                이용약관 동의 (필수)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privacy"
                name="privacy"
                onChange={handleTermsChange}
                checked={privacyAgreed}
                className="w-4 h-4 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
              />
              <label htmlFor="privacy" className="ml-2 block text-sm">
                개인정보 수집 및 이용 동의 (필수)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketing"
                name="marketing"
                onChange={handleTermsChange}
                checked={marketingAgreed}
                className="w-4 h-4 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
              />
              <label htmlFor="marketing" className="ml-2 block text-sm">
                마케팅 정보 수신 동의 (선택)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 확인 버튼 */}
      <div className="fixed bottom-[72px] left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <button
          onClick={handleConfirm}
          disabled={!isValid}
          className={`w-full py-4 rounded-lg font-medium transition-colors ${
            isValid
              ? 'bg-[#FF7355] text-white hover:bg-[#FF6344]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
} 
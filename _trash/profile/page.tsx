'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserInfo {
  userId: string;
  name: string;
  phone: string;
  marketingAgreed: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setUserInfo(parsedUserInfo);
      setName(parsedUserInfo.name);
      setPhone(parsedUserInfo.phone);
      setMarketingAgreed(parsedUserInfo.marketingAgreed);
    }
  }, []);

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
  };

  // 전화번호 변경 시작
  const handlePhoneChangeStart = () => {
    setShowVerificationInput(true);
    setIsVerifying(true);
    // TODO: 실제 SMS 인증번호 발송 로직 구현
    // 임시로 123456으로 설정
    const tempCode = '123456';
    localStorage.setItem('tempVerificationCode', tempCode);
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    const savedCode = localStorage.getItem('tempVerificationCode');
    if (verificationCode === savedCode) {
      setIsVerified(true);
      setVerificationError('');
      // 인증 성공 시 전화번호 변경 허용
      setPhone(phone);
    } else {
      setVerificationError('인증번호가 일치하지 않습니다.');
    }
  };

  // 저장 버튼 처리
  const handleSave = () => {
    if (userInfo && name.length >= 2 && validatePhone(phone)) {
      const updatedUserInfo: UserInfo = {
        ...userInfo,
        name,
        phone: isVerified ? phone : userInfo.phone, // 인증된 경우에만 전화번호 변경
        marketingAgreed
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      setIsEditing(false);
      setIsVerifying(false);
      setIsVerified(false);
      setShowVerificationInput(false);
      setVerificationCode('');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('userInfo');
      router.push('/');
    }
  };

  // 회원 탈퇴
  const handleWithdraw = () => {
    if (confirm('정말 탈퇴하시겠습니까?')) {
      localStorage.removeItem('userInfo');
      router.push('/');
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          <p>로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/customer/personal-info')}
            className="mt-4 px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
          >
            회원가입 하기
          </button>
        </div>
      </div>
    );
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
        <h1 className="text-white text-lg font-medium w-full text-center">프로필</h1>
      </div>

      {/* 프로필 섹션 */}
      <div className="bg-white p-4 mt-4 mx-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-[#FF7355] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {userInfo.name[0]}
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">{userInfo.name}</h2>
            <p className="text-sm text-gray-600">{userInfo.phone}</p>
          </div>
        </div>
      </div>

      {/* 회원 정보 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">회원 정보</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#FF7355] hover:text-[#FF6344]"
          >
            {isEditing ? '취소' : '수정'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">이름 (닉네임)</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]"
              />
            ) : (
              <p className="px-4 py-3">{userInfo.name}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-2">전화번호</label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]"
                    disabled={!isVerified}
                  />
                  {!isVerified && (
                    <button
                      onClick={handlePhoneChangeStart}
                      className="px-4 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                    >
                      인증하기
                    </button>
                  )}
                </div>
                {showVerificationInput && !isVerified && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증번호 6자리 입력"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]"
                      />
                      <button
                        onClick={handleVerifyCode}
                        className="px-4 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                      >
                        확인
                      </button>
                    </div>
                    {verificationError && (
                      <p className="text-red-500 text-sm">{verificationError}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      * 테스트용 인증번호: 123456
                    </p>
                  </div>
                )}
                {isVerified && (
                  <p className="text-sm text-green-600">
                    ✓ 전화번호가 인증되었습니다
                  </p>
                )}
              </div>
            ) : (
              <p className="px-4 py-3">{userInfo.phone}</p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="marketing"
              checked={marketingAgreed}
              onChange={(e) => setMarketingAgreed(e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 rounded border-gray-300 text-[#FF7355] focus:ring-[#FF7355]"
            />
            <label htmlFor="marketing" className="ml-2 text-sm">
              마케팅 정보 수신 동의
            </label>
          </div>
          <div className="text-sm text-gray-500">
            가입일: {new Date(userInfo.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 설정 메뉴 */}
      <div className="bg-white mt-4 mx-4 rounded-lg divide-y">
        <button 
          onClick={() => router.push('/customer/settings/notifications')}
          className="w-full p-4 text-left flex items-center justify-between"
        >
          <span>알림 설정</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button 
          onClick={() => router.push('/customer/settings/support')}
          className="w-full p-4 text-left flex items-center justify-between"
        >
          <span>고객센터</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button 
          onClick={() => router.push('/customer/settings/terms')}
          className="w-full p-4 text-left flex items-center justify-between"
        >
          <span>약관 및 정책</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full p-4 text-left text-[#FF7355]"
        >
          로그아웃
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div className="p-4">
        <button
          onClick={handleWithdraw}
          className="w-full text-gray-500 hover:text-gray-700"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 수정 확인 버튼 */}
      {isEditing && (
        <div className="fixed bottom-[72px] left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
          <button
            onClick={handleSave}
            disabled={!name || !validatePhone(phone)}
            className={`w-full py-4 rounded-lg font-medium transition-colors ${
              name && validatePhone(phone)
                ? 'bg-[#FF7355] text-white hover:bg-[#FF6344]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            저장하기
          </button>
        </div>
      )}

      <div className="p-4 text-center text-sm text-gray-500">
        버전 1.0.0
      </div>
    </div>
  );
} 
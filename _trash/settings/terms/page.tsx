'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TermsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('service');

  const terms = {
    service: `서비스 이용약관

1. 총칙
본 약관은 픽업 서비스(이하 "서비스")의 이용에 관한 기본적인 사항을 규정합니다.

2. 서비스의 이용
- 회원은 본 약관에 따라 서비스를 이용할 수 있습니다.
- 서비스 이용 시간은 연중무휴 1일 24시간을 원칙으로 합니다.

3. 서비스의 변경 및 중지
- 운영상 필요한 경우 서비스 내용을 변경할 수 있습니다.
- 기술상의 필요나 서비스 운영상 필요한 경우 서비스를 중지할 수 있습니다.

4. 회원의 의무
- 회원은 서비스 이용과 관련하여 관련 법령을 준수해야 합니다.
- 회원은 본인의 계정 정보를 안전하게 관리해야 합니다.`,

    privacy: `개인정보 처리방침

1. 개인정보의 수집 및 이용 목적
- 서비스 제공 및 계약의 이행
- 회원 관리
- 마케팅 및 광고에의 활용

2. 수집하는 개인정보의 항목
- 필수항목: 이름, 전화번호
- 선택항목: 마케팅 수신 동의

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 시까지
- 관계 법령에 따른 보존 기간

4. 개인정보의 파기
회원 탈퇴 시 즉시 파기하며, 법령에 따라 보존이 필요한 경우 별도 보관 후 파기`,

    location: `위치기반 서비스 이용약관

1. 목적
본 약관은 위치기반 서비스 제공과 관련하여 필요한 사항을 규정합니다.

2. 서비스의 내용
- 매장 위치 정보 제공
- 사용자 위치 기반 매장 검색
- 픽업 예약 서비스

3. 위치정보의 이용
- 위치정보는 서비스 제공을 위해서만 이용됩니다.
- 위치정보는 사용자의 동의 없이 제3자에게 제공되지 않습니다.`,

    marketing: `마케팅 정보 수신 동의

1. 마케팅 정보 수신 동의 내용
- 이벤트 및 프로모션 정보
- 신규 서비스 안내
- 혜택 및 할인 쿠폰

2. 마케팅 정보 전송 방법
- 문자 메시지
- 앱 푸시 알림

3. 수신 동의 철회
- 언제든지 수신 동의를 철회할 수 있습니다.
- 설정 메뉴에서 수신 여부를 변경할 수 있습니다.`
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
        <h1 className="text-white text-lg font-medium w-full text-center">약관 및 정책</h1>
      </div>

      {/* 약관 목록 */}
      <div className="p-4 bg-white">
        <div className="flex overflow-x-auto space-x-4 pb-4">
          <button
            onClick={() => setActiveSection('service')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeSection === 'service'
                ? 'bg-[#FF7355] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            서비스 이용약관
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeSection === 'privacy'
                ? 'bg-[#FF7355] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            개인정보 처리방침
          </button>
          <button
            onClick={() => setActiveSection('location')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeSection === 'location'
                ? 'bg-[#FF7355] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            위치기반 서비스
          </button>
          <button
            onClick={() => setActiveSection('marketing')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeSection === 'marketing'
                ? 'bg-[#FF7355] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            마케팅 정보 수신
          </button>
        </div>
      </div>

      {/* 약관 내용 */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {terms[activeSection as keyof typeof terms]}
          </pre>
        </div>
      </div>
    </div>
  );
} 
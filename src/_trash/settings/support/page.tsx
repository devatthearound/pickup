'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');

  const faqs = [
    {
      question: '픽업은 어떻게 하나요?',
      answer: '예약하신 시간에 매장을 방문하시면 됩니다. 매장 직원에게 예약번호나 이름을 알려주시면 상품을 전달해 드립니다.'
    },
    {
      question: '주문 취소는 어떻게 하나요?',
      answer: '픽업 예정 시간 1시간 전까지 취소가 가능합니다. 주문 내역에서 취소 버튼을 눌러 진행해 주세요.'
    },
    {
      question: '결제 수단은 어떤 것이 있나요?',
      answer: '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등을 지원합니다.'
    },
    {
      question: '영수증 발급은 어떻게 하나요?',
      answer: '주문 내역에서 영수증 발급 버튼을 통해 발급 받으실 수 있습니다. 현금영수증은 결제 시 요청하실 수 있습니다.'
    }
  ];

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
        <h1 className="text-white text-lg font-medium w-full text-center">고객센터</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === 'faq'
              ? 'text-[#FF7355] border-b-2 border-[#FF7355]'
              : 'text-gray-500'
          }`}
        >
          자주 묻는 질문
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === 'contact'
              ? 'text-[#FF7355] border-b-2 border-[#FF7355]'
              : 'text-gray-500'
          }`}
        >
          1:1 문의
        </button>
      </div>

      {/* FAQ 목록 */}
      {activeTab === 'faq' && (
        <div className="p-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1:1 문의 */}
      {activeTab === 'contact' && (
        <div className="p-4">
          <div className="bg-white rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">문의 유형</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355]">
                  <option value="">문의 유형을 선택해주세요</option>
                  <option value="order">주문/결제</option>
                  <option value="pickup">픽업</option>
                  <option value="cancel">취소/환불</option>
                  <option value="etc">기타</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">문의 내용</label>
                <textarea
                  className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF7355] resize-none"
                  placeholder="문의하실 내용을 입력해주세요"
                ></textarea>
              </div>
              <button className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors">
                문의하기
              </button>
            </div>
          </div>

          {/* 고객센터 정보 */}
          <div className="mt-6 bg-white rounded-lg p-4">
            <h3 className="font-medium mb-3">고객센터 운영 안내</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>평일 09:00 - 18:00</p>
              <p>점심시간 12:00 - 13:00</p>
              <p>주말 및 공휴일 휴무</p>
              <p className="text-[#FF7355] mt-4">
                * 문의하신 내용은 영업일 기준 24시간 이내에 답변드립니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('카카오페이');

  return (
    <div className="flex flex-col min-h-full bg-gray-50 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-[#FF7355] text-white px-4 py-3 w-full">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#FF7355]/80 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">결제하기</h1>
        <div className="w-10" /> {/* 우측 여백 맞추기 */}
      </div>

      {/* 주문 내역 */}
      <div className="bg-white p-4 w-full">
        <h2 className="text-lg font-medium mb-4">주문 내역</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>소보로빵 (2개)</span>
            <span>5,000원</span>
          </div>
          <div className="flex justify-between">
            <span>크림치즈 베이글 (1개)</span>
            <span>3,800원</span>
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <span>총 결제 금액</span>
              <span>8,800원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 픽업 정보 */}
      <div className="mt-2 bg-white p-4 w-full">
        <h2 className="text-lg font-medium mb-4">픽업 정보</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">매장</span>
            <span>달콤한 베이커리</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">픽업 시간</span>
            <span>오늘 (3/25) 16:30</span>
          </div>
        </div>
      </div>

      {/* 결제 수단 선택 */}
      <div className="mt-2 bg-white p-4 w-full">
        <h2 className="text-lg font-medium mb-4">결제 수단 선택</h2>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer">
            <input 
              type="radio" 
              name="payment" 
              className="w-5 h-5 text-[#FF7355]" 
              checked={selectedPayment === '카카오페이'}
              onChange={() => setSelectedPayment('카카오페이')}
            />
            <span className="ml-3">카카오페이</span>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer">
            <input 
              type="radio" 
              name="payment" 
              className="w-5 h-5 text-[#FF7355]"
              checked={selectedPayment === '신용/체크카드'}
              onChange={() => setSelectedPayment('신용/체크카드')}
            />
            <span className="ml-3">신용/체크카드</span>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer">
            <input 
              type="radio" 
              name="payment" 
              className="w-5 h-5 text-[#FF7355]"
              checked={selectedPayment === '네이버페이'}
              onChange={() => setSelectedPayment('네이버페이')}
            />
            <span className="ml-3">네이버페이</span>
          </label>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t p-4">
        <Link href="/customer/reservation-success" className="block">
          <button className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium">
            8,800원 결제하기
          </button>
        </Link>
        <div className="mt-4 text-center text-sm text-gray-500">
          픽업예약 앱 - 5/6 결제하기 화면
        </div>
      </div>
    </div>
  );
} 
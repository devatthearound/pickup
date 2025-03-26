'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-[#FF7355] text-white px-4 py-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#FF7355]/80 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">장바구니</h1>
        <div className="w-10" /> {/* 우측 여백 맞추기 */}
      </div>

      {/* 매장 정보 */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div>
          <h2 className="font-medium">달콤한 베이커리</h2>
          <p className="text-sm text-gray-500">픽업 주문</p>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="bg-white mt-2 p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">소보로빵</h3>
              <p className="text-[#FF7355]">2,500원</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">-</button>
              <span className="w-8 text-center">2</span>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#FF7355]">+</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">크림치즈 베이글</h3>
              <p className="text-[#FF7355]">3,800원</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">-</button>
              <span className="w-8 text-center">1</span>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#FF7355]">+</button>
            </div>
          </div>
        </div>

        {/* 요청사항 */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-600 mb-2">요청사항</h3>
          <textarea 
            className="w-full p-3 border rounded-lg text-sm" 
            rows={3}
            placeholder="픽업 시 요청사항을 입력해주세요.&#13;&#10;예) 소보로빵은 포장 따로 해주세요."
          ></textarea>
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="mt-auto">
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">총 주문금액</span>
            <span className="font-medium">8,800원</span>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 bg-white border-t">
          <Link href="/customer/pickup-time" className="block">
            <button className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium">
              예약하기
            </button>
          </Link>
          <div className="mt-4 text-center text-sm text-gray-500">
            픽업예약 앱 - 3/6 장바구니 화면
          </div>
        </div>
      </div>
    </div>
  );
} 
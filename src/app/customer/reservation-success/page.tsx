'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReservationSuccessPage() {
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
        <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">예약 완료</h1>
        <div className="w-10" /> {/* 우측 여백 맞추기 */}
      </div>

      {/* 성공 메시지 */}
      <div className="flex flex-col items-center justify-center px-4 py-8 bg-white">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">예약이 완료되었습니다!</h2>
        <p className="text-gray-600 text-center mb-6">픽업 시간에 맞춰 방문해주세요.</p>
      </div>

      {/* 예약 정보 */}
      <div className="bg-[#FF7355]/5 p-4 mx-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">예약 정보</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">예약번호</span>
            <span className="font-medium">202503250001</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">매장</span>
            <Link href="/customer/store/1" className="font-medium hover:text-[#FF7355]">
              달콤한 베이커리
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">픽업 일시</span>
            <span className="font-medium">3/25 16:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">주문 금액</span>
            <span className="font-medium">8,800원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">결제 방법</span>
            <span className="font-medium">카카오페이</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-auto p-4 bg-white border-t">
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-3 border border-[#FF7355] text-[#FF7355] rounded-lg text-sm font-medium">
            예약 취소
          </button>
          <Link href="/customer" className="flex-1">
            <button className="w-full px-4 py-3 bg-[#FF7355] text-white rounded-lg text-sm font-medium">
              홈으로 돌아가기
            </button>
          </Link>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          픽업예약 앱 - 6/6 예약 완료 화면
        </div>
      </div>
    </div>
  );
} 
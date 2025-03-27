'use client';

import { useRouter } from 'next/navigation';

export default function ReservationSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-4 flex items-center relative">
        <h1 className="text-white text-lg font-medium w-full text-center">예약 완료</h1>
      </div>

      {/* 성공 메시지 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-[#FF7355] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-medium mb-2">예약이 완료되었습니다</h2>
        <p className="text-gray-500 mb-2">
          예약하신 시간에 맞춰서 도넛을 준비해드리겠습니다
        </p>
        <div className="bg-yellow-50 p-4 rounded-lg mb-8 w-full max-w-sm">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span className="text-yellow-700 font-medium">알림 발송 완료</span>
          </div>
          <p className="text-sm text-yellow-600">
            예약 확정 정보를 카카오톡으로 발송해드렸습니다
          </p>
        </div>
        <div className="p-8">
          <button
            onClick={() => router.push('/customer/orders')}
            className="w-full py-4 px-8 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344]"
          >
            주문내역으로 가기
          </button>
        </div>
      </div>
    </div>
  );
} 
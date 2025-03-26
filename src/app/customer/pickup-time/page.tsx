'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PickupTimePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('3/25');
  const [selectedTime, setSelectedTime] = useState('16:30');

  const dates = [
    { date: '3/25', day: '오늘' },
    { date: '3/26', day: '내일' },
    { date: '3/27', day: '모레' }
  ];

  const times = [
    '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative pb-24">
      {/* 헤더 */}
      <div className="bg-[#FF7355] text-white w-full">
        <div className="flex items-center h-14 px-4">
          <button onClick={() => router.back()} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">픽업 시간 선택</h1>
        </div>
      </div>

      {/* 매장 정보 */}
      <div className="p-4 border-b w-full">
        <h2 className="text-lg font-medium">달콤한 베이커리</h2>
        <p className="text-gray-600 text-sm mt-1">영업: 07:00-20:00</p>
      </div>

      {/* 픽업 날짜 선택 */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-2">픽업 날짜</h3>
        <div className="grid grid-cols-3 gap-2">
          {dates.map((item) => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`py-3 rounded-lg text-center ${
                selectedDate === item.date
                  ? 'bg-[#FF7355] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm">{item.day}</div>
              <div className="text-xs mt-1">{item.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 픽업 시간 선택 */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-2">픽업 시간</h3>
        <div className="grid grid-cols-2 gap-2">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-3 rounded-lg text-center ${
                selectedTime === time
                  ? 'bg-[#FF7355] text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
          <span className="text-gray-800">소보로빵 외 1건</span>
          <span className="font-medium">8,800원</span>
        </div>
        <button
          onClick={() => router.push('/customer/payment')}
          className="w-full bg-[#FF7355] text-white py-4 rounded-lg font-medium"
        >
          예약 확인
        </button>
      </div>
    </div>
  );
} 
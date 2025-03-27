'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PickupTimePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // 오늘부터 7일간의 날짜 생성
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      display: `${date.getMonth() + 1}/${date.getDate()} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`
    };
  });

  // 10:00부터 20:00까지 30분 간격의 시간 생성
  const times = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 10;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      // 선택된 날짜와 시간을 다음 페이지로 전달
      router.push(`/customer/reservation-confirm?date=${selectedDate}&time=${selectedTime}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
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
        <h1 className="text-white text-lg font-medium w-full text-center">픽업 시간 선택</h1>
      </div>

      {/* 날짜 선택 */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-3">날짜 선택</h2>
        <div className="grid grid-cols-3 gap-2">
          {dates.map((date) => (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedDate === date.value
                  ? 'bg-[#FF7355] text-white font-medium'
                  : 'bg-white border border-gray-200 hover:border-[#FF7355]'
              }`}
            >
              {date.display}
            </button>
          ))}
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-3">시간 선택</h2>
        <div className="grid grid-cols-3 gap-2">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedTime === time
                  ? 'bg-[#FF7355] text-white font-medium'
                  : 'bg-white border border-gray-200 hover:border-[#FF7355]'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 고정 영역 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t">
        {/* 선택된 시간 표시 */}
        {(selectedDate || selectedTime) && (
          <div className="px-4 pt-4">
            <div className="text-center text-xl">
              <span className="font-medium text-[#FF7355]">
                {selectedDate && dates.find(d => d.value === selectedDate)?.display}
                {selectedDate && selectedTime && ' '}
                {selectedTime}
              </span>
            </div>
          </div>
        )}

        {/* 다음 버튼 */}
        <div className="p-4">
          <button
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-lg font-medium transition-colors ${
              selectedDate && selectedTime
                ? 'bg-[#FF7355] text-white hover:bg-[#FF6344]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
} 
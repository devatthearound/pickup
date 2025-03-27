'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ReservationConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  // 장바구니 아이템 가져오기 (실제로는 상태 관리 라이브러리나 localStorage에서 가져와야 함)
  useEffect(() => {
    // 예시 데이터
    setCartItems([
      { id: '1', name: '클래식 도넛 세트', price: 12000, quantity: 1 },
      { id: '2', name: '초코 도넛', price: 3500, quantity: 2 },
    ]);
  }, []);

  // 총 금액 계산
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleConfirm = () => {
    router.push('/customer/reservation-success');
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
        <h1 className="text-white text-lg font-medium w-full text-center">예약 확인</h1>
      </div>

      {/* 가게 정보 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <h2 className="font-medium mb-3">픽업 매장</h2>
        <div className="space-y-2">
          <div className="flex items-start">
            <h3 className="text-lg font-medium">도넛캠프</h3>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              서울시 마포구 연남로 123길 34
            </p>
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              매일 10:00 - 20:00
            </p>
            <p className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              02-1234-5678
            </p>
          </div>
        </div>
      </div>

      {/* 픽업 시간 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <h2 className="font-medium mb-3">픽업 시간</h2>
        <div className="text-lg font-medium text-[#FF7355]">
          {date && formatDate(date)} {time}
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <h2 className="font-medium mb-3">주문 상품</h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.quantity}개</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="p-4 bg-white mt-4 mx-4 rounded-lg">
        <h2 className="font-medium mb-3">결제 정보</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">상품 금액</span>
            <span className="font-medium">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="font-medium">총 결제금액</span>
            <span className="font-medium text-[#FF7355]">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 예약 확정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
        >
          예약 확정
        </button>
      </div>
    </div>
  );
} 
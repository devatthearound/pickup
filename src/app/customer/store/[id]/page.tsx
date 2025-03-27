'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export default function StorePage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const addToCart = (name: string, price: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.name === name);
      if (existingItem) {
        return prev.map(item =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { name, price, quantity: 1 }];
    });
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="max-w-md mx-auto pb-[140px]">
      {/* 매장 로고 및 정보 */}
      <div className="bg-white w-full px-4 py-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src="/images/donutcamp-logo.jpg"
              alt="도넛캠프"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">도넛캠프</h1>
        <p className="text-gray-600 mb-1">매일 구워내는 따뜻한 도넛</p>
        <p className="text-sm text-gray-500">서울시 마포구 연남로 123길 34</p>
        <p className="text-sm text-gray-500">영업시간: 10:00-20:00</p>
      </div>

      {/* 메뉴 카테고리 */}
      <div className="p-4 space-y-3">

        <button 
          onClick={() => router.push('https://pf.kakao.com')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          카카오톡 채널
        </button>
        <button 
          onClick={() => router.push('https://instagram.com')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          인스타그램
        </button>
      </div>

      {/* 메뉴 이미지 그리드 */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div 
              key={num} 
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => addToCart(`도넛 ${num}`, 3500)}
            >
              <Image
                src={`/images/donut${num}.jpg`}
                alt={`도넛 ${num}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 매장 소개 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">About 도넛캠프</h2>
          <p className="text-gray-600 mb-4">
            도넛캠프는 매일 아침 신선한 재료로 정성스럽게 만드는 수제 도넛 전문점입니다.
            클래식한 도넛부터 시즌 한정 도넛까지, 다양한 맛을 경험해보세요.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• 최소 30분 전 예약 필수</p>
            <p>• 당일 픽업 가능</p>
            <p>• 대량 주문 문의 (카카오톡: @donutcamp)</p>
          </div>
        </div>
      </div>

      {/* 픽업 예약 버튼 */}
      <div className="fixed bottom-[72px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 bg-white pb-4">
        <button 
          onClick={() => router.push('/customer/cart')}
          className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium shadow-lg text-lg hover:bg-[#FF6344] transition-colors"
        >
          픽업 예약하기 {cartItems.length > 0 && `(${getTotalQuantity()})`}
        </button>
      </div>

      {/* 알림 팝업 */}
      {showPopup && (
        <div className="fixed bottom-[140px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg">
          픽업 예약 목록에 추가되었습니다
        </div>
      )}
    </div>
  );
} 
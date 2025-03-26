'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    
    // 팝업 표시
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-32 max-w-md mx-auto relative">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white w-full">
        <button onClick={() => router.back()} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 매장 정보 */}
      <div className="px-4 pb-4 bg-white w-full">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl">🍞</span>
        </div>
        <h1 className="text-xl font-bold text-center mb-2">달콤한 베이커리</h1>
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-yellow-400">★</span>
          <span>4.8 (162) • 빵, 케이크, 디저트</span>
        </div>
        <p className="text-sm text-gray-600 text-center">서울시 마포구 연남로 123길 34</p>
        <p className="text-sm text-gray-600 text-center">영업시간: 07:00-20:00</p>
        <p className="text-xs text-[#FF7355] text-center mt-1">지금 예약 가능 • 최소 30분 전 예약</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex border-b bg-white w-full">
        <button className="flex-1 py-2 text-[#FF7355] border-b-2 border-[#FF7355] font-medium">빵</button>
        <button className="flex-1 py-2 text-gray-400">케이크</button>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex-1 p-4 space-y-4">
        <div 
          className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer active:bg-gray-50"
          onClick={() => addToCart('소보로빵', 2500)}
        >
          <div className="relative h-48 w-full">
            <Image
              src="/images/bread.jpg"
              alt="소보로빵"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">소보로빵</h3>
                <p className="text-sm text-gray-500 mb-1">부드러운 빵에 달콤한 소보로 토핑</p>
                <p className="text-lg">2,500원</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF7355] text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer active:bg-gray-50"
          onClick={() => addToCart('크림치즈 베이글', 3800)}
        >
          <div className="relative h-48 w-full">
            <Image
              src="/images/bagel.jpg"
              alt="크림치즈 베이글"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">크림치즈 베이글</h3>
                <p className="text-sm text-gray-500 mb-1">풍긋한 베이글에 풍부한 크림치즈</p>
                <p className="text-lg">3,800원</p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF7355] text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 버튼 */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <button 
          onClick={() => router.push('/customer/cart')}
          className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium shadow-lg"
        >
          장바구니 {cartItems.length > 0 && `(${getTotalQuantity()})`}
        </button>
      </div>

      {/* 알림 팝업 */}
      {showPopup && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg">
          장바구니에 담았습니다
        </div>
      )}

      <div className="text-center text-sm text-gray-500 py-2">
        픽업예약 앱 - 2/6 매장 상세 화면
      </div>
    </div>
  );
} 
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: '클래식 도넛 세트', price: 12000, quantity: 1, image: '/images/donut1.jpg' },
    { id: '2', name: '초코 도넛', price: 3500, quantity: 2, image: '/images/donut2.jpg' },
  ]);

  // 총 금액 계산
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 수량 증가
  const increaseQuantity = (itemId: string) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // 수량 감소
  const decreaseQuantity = (itemId: string) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // 아이템 삭제
  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // 메뉴 추가하기 버튼 클릭
  const handleAddMore = () => {
    router.push('/customer/store/1');
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
        <h1 className="text-white text-lg font-medium w-full text-center">장바구니</h1>
      </div>

      {/* 픽업 혜택 배너 */}
      <div className="bg-[#FF7355] mx-4 mt-4 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4m8-8v16" />
          </svg>
          <h2 className="text-white font-medium">픽업 시 혜택</h2>
        </div>
        <ul className="text-white text-sm space-y-1.5">
          <li className="flex items-center">
            <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
            도넛 1개 추가 증정 (15,000원 이상)
          </li>
          <li className="flex items-center">
            <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
            음료 사이즈업 무료
          </li>
          <li className="flex items-center">
            <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
            포장 박스 무료 제공
          </li>
        </ul>
      </div>

      {/* 장바구니 아이템 */}
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 flex items-center space-x-4">
            {item.image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{item.name}</h3>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#FF7355] hover:text-[#FF7355]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#FF7355] hover:text-[#FF7355]"
                  >
                    +
                  </button>
                </div>
                <p className="font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
              </div>
            </div>
          </div>
        ))}

        {/* 메뉴 추가하기 버튼 */}
        <button
          onClick={handleAddMore}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#FF7355] hover:text-[#FF7355] transition-colors"
        >
          + 메뉴 추가하기
        </button>
      </div>

      {/* 결제 정보 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">총 주문금액</span>
            <span className="font-medium text-lg">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
        <button
          onClick={() => router.push('/customer/pickup-time')}
          className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
        >
          픽업 시간 선택
        </button>
      </div>
    </div>
  );
} 
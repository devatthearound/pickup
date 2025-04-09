'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  discountedPrice: string;
  description: string | null;
  imageUrl: string;
  categoryId: number;
  preparationTime: number | null;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isRecommended: boolean;
  stockQuantity: number | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadCartData = () => {
      if (typeof window !== 'undefined') {
        // 현재 주문 중인 가게 ID 가져오기
        const currentStoreId = localStorage.getItem('activeStoreId');
        console.log('activeStoreId:', currentStoreId); // 디버깅용 로그
        
        if (currentStoreId) {
          setStoreId(currentStoreId);
          // 해당 가게의 장바구니 아이템 가져오기
          const savedCart = localStorage.getItem(`cart_${currentStoreId}`);
          console.log('savedCart:', savedCart); // 디버깅용 로그
          
          if (savedCart) {
            const items = JSON.parse(savedCart);
            setCartItems(items);
            
            // 총 금액 계산
            const total = items.reduce((sum: number, item: CartItem) => {
              const price = item.discountedPrice !== item.price 
                ? parseInt(item.discountedPrice) 
                : parseInt(item.price);
              return sum + (price * item.quantity);
            }, 0);
            setTotalAmount(total);
          }
        } else {
          // 가게 ID가 없는 경우 이전 페이지로 리다이렉트
          console.log('No activeStoreId found in localStorage'); // 디버깅용 로그
          setTimeout(() => {
            router.back();
          }, 100); // 100ms 후에 리다이렉트
        }
      }
    };

    loadCartData();
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      if (storeId) {
        localStorage.setItem(`cart_${storeId}`, JSON.stringify(updatedItems));
      }
      
      // 총 금액 업데이트
      const total = updatedItems.reduce((sum: number, item: CartItem) => {
        const price = item.discountedPrice !== item.price 
          ? parseInt(item.discountedPrice) 
          : parseInt(item.price);
        return sum + (price * item.quantity);
      }, 0);
      setTotalAmount(total);
      
      return updatedItems;
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== itemId);
      if (storeId) {
        localStorage.setItem(`cart_${storeId}`, JSON.stringify(updatedItems));
      }
      
      // 총 금액 업데이트
      const total = updatedItems.reduce((sum: number, item: CartItem) => {
        const price = item.discountedPrice !== item.price 
          ? parseInt(item.discountedPrice) 
          : parseInt(item.price);
        return sum + (price * item.quantity);
      }, 0);
      setTotalAmount(total);
      
      return updatedItems;
    });
  };

  const handleCheckout = () => {
    // 주문자 정보 입력 페이지로 이동
    router.push('/u/personal-info');
  };

  if (!storeId) {
    return <div className="flex justify-center items-center h-screen">로딩중...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">장바구니가 비어있습니다</h2>
          <p className="text-gray-500 mt-2">메뉴를 추가해주세요</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
          >
            메뉴 선택하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-32">
      <h1 className="text-2xl font-bold mb-6">픽업 예약 목록</h1>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="relative w-20 h-20">
              <Image
                src={item.imageUrl || '/images/default-menu.png'}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {item.discountedPrice !== item.price ? (
                  <>
                    <p className="text-[#FF7355] font-medium">
                      {parseInt(item.discountedPrice).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      {parseInt(item.price).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                    </p>
                  </>
                ) : (
                  <p className="text-[#FF7355] font-medium">
                    {parseInt(item.price).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pb-4">
        <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">총 금액</span>
            <span className="text-[#FF7355] font-bold">
              {totalAmount.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
            </span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium shadow-lg text-lg hover:bg-[#FF6344] transition-colors"
        >
          주문하기
        </button>
      </div>
    </div>
  );
} 
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
        const currentStoreId = localStorage.getItem('currentStoreId');
        if (currentStoreId) {
          setStoreId(currentStoreId);
          const savedCart = localStorage.getItem(`cart_${currentStoreId}`);
          if (savedCart) {
            const items = JSON.parse(savedCart);
            setCartItems(items);
            
            const total = items.reduce((sum: number, item: CartItem) => {
              const price = item.discountedPrice !== item.price 
                ? parseInt(item.discountedPrice) 
                : parseInt(item.price);
              return sum + (price * item.quantity);
            }, 0);
            setTotalAmount(total);
          }
        } else {
          setTimeout(() => {
            router.back();
          }, 100);
        }
      }
    };

    loadCartData();
  }, []);

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
    router.push('/personal-info');
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
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">장바구니</h1>
          </div>
        </div>
      </div>

      {/* 장바구니 아이템 목록 */}
      <div className="pb-24">
        {cartItems.map(item => (
          <div key={item.id} className="px-4 py-4 flex gap-4 border-b border-gray-100">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.imageUrl || '/images/default-menu.png'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium text-base truncate">{item.name}</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-medium">
                  {item.discountedPrice !== item.price
                    ? parseInt(item.discountedPrice).toLocaleString('ko-KR')
                    : parseInt(item.price).toLocaleString('ko-KR')}원
                </p>
                {item.discountedPrice !== item.price && (
                  <p className="text-sm text-gray-400 line-through">
                    {parseInt(item.price).toLocaleString('ko-KR')}원
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 주문 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between max-w-md mx-auto mb-4">
          <span className="text-gray-600">총 금액</span>
          <span className="text-lg font-bold">
            {totalAmount.toLocaleString('ko-KR')}원
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full py-3.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#FF6344] transition-colors"
        >
          주문하기
        </button>
      </div>
    </div>
  );
} 
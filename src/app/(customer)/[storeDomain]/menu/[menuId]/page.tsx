'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';

interface MenuItem {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  price: string;
  discountedPrice: string;
  imageUrl: string | null;
  preparationTime: number | null;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isRecommended: boolean;
  stockQuantity: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeDomain = params.storeDomain as string;
  const menuId = params.menuId as string;
  const axiosInstance = useAxios();

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${storeDomain}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axiosInstance.get(`/menu-items/${menuId}`);
        const data = await response.data.data;
        setMenuItem(data);
      } catch (error) {
        console.error('메뉴 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchMenuItem();
  }, [menuId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${storeDomain}`, JSON.stringify(cartItems));
    }
  }, [cartItems, storeDomain]);

  const addToCart = () => {
    if (!menuItem) return;

    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === menuItem.id);
      const updatedItems = existingItem
        ? prev.map(cartItem =>
            cartItem.id === menuItem.id 
              ? { ...cartItem, quantity: cartItem.quantity + quantity } 
              : cartItem
          )
        : [...prev, { ...menuItem, quantity }];
      
      localStorage.setItem(`cart_${storeDomain}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (menuItem?.stockQuantity && newQuantity > menuItem.stockQuantity) return;
    setQuantity(newQuantity);
  };

  if (!menuItem) {
    return <div className="flex justify-center items-center h-screen">로딩중...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between p-2">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메뉴 이미지 */}
      <div className="relative w-full h-64">
        <Image
          src={menuItem.imageUrl || '/images/default-menu.png'}
          alt={menuItem.name}
          fill
          className="object-cover"
        />
      </div>

      {/* 메뉴 정보 */}
      <div className="p-4 pb-24">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-bold">{menuItem.name}</h1>
          {!menuItem.isAvailable && (
            <span className="text-sm text-red-500">품절</span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{menuItem.description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          <p className="text-lg font-bold">
            {menuItem.discountedPrice !== menuItem.price
              ? parseInt(menuItem.discountedPrice).toLocaleString('ko-KR')
              : parseInt(menuItem.price).toLocaleString('ko-KR')}원
          </p>
          {menuItem.discountedPrice !== menuItem.price && (
            <p className="text-sm text-gray-400 line-through">
              {parseInt(menuItem.price).toLocaleString('ko-KR')}원
            </p>
          )}
        </div>

        {/* 수량 조절 */}
        {menuItem.isAvailable && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 담기 버튼 */}
      {menuItem.isAvailable && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">수량</span>
              <span className="font-medium">{quantity}개</span>
            </div>
            <button
              onClick={addToCart}
              className="px-6 py-3 bg-[#FF7355] text-white text-lg rounded-lg hover:bg-[#FF6347]"
            >
              {quantity}개 담기
            </button>
          </div>
        </div>
      )}

      {/* 알림 팝업 */}
      {showPopup && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
          장바구니에 추가되었습니다
        </div>
      )}
    </div>
  );
} 
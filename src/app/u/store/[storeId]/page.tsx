'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStoreProfile } from '@/store/useStoreProfile';
import StoreProfileImage from '@/components/StoreProfileImage';
import { useParams } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';

interface StoreInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  logoImageUrl: string;
}

interface MenuCategory {
  id: number;
  name: string;
  description: string;
}

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

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  const axiosInstance = useAxios();

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${storeId}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [showPopup, setShowPopup] = useState(false);
  const { imageUrl, setImageUrl } = useStoreProfile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${storeId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, storeId]);

  // 가게 정보 가져오기
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await axiosInstance.get(`/stores/${storeId}`);
        const data = await response.data;
        setStoreInfo(data);
        setImageUrl(data.logoImageUrl);
      } catch (error) {
        console.error('가게 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchStoreInfo();
  }, [storeId, setImageUrl]);

  // 메뉴 카테고리 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/menu-categories/store/${storeId}`);
        const data = await response.data;
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
          setSelectedCategory(data.data[0].id);
        } else {
          setCategories([]);
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('카테고리를 불러오는데 실패했습니다:', error);
        setCategories([]);
        setSelectedCategory(null);
      }
    };

    fetchCategories();
  }, [storeId]);

  // 선택된 카테고리의 메뉴 가져오기
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!selectedCategory) return;
      
      try {
        const response = await axiosInstance.get(`/menu-items/category/${selectedCategory}`);
        const data = await response.data;
        if (data.success) {
          setMenuItems(data.data || []);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('메뉴를 불러오는데 실패했습니다:', error);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      const updatedItems = existingItem
        ? prev.map(cartItem =>
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity + 1 } 
              : cartItem
          )
        : [...prev, { ...item, quantity: 1 }];
      
      // 현재 가게 ID를 로컬 스토리지에 저장
      localStorage.setItem('currentStoreId', storeId);
      // 장바구니 아이템도 로컬 스토리지에 저장
      localStorage.setItem(`cart_${storeId}`, JSON.stringify(updatedItems));
      
      return updatedItems;
    });
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };


  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push(`/u/cart`);
  };

  if (!storeInfo) {
    return <div className="flex justify-center items-center h-screen">로딩중...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-32 overflow-y-auto">
      {/* 가게 프로필 */}
      <div className="flex justify-center mb-8">
        <StoreProfileImage
          name={storeInfo?.name || '가게'}
          imageUrl={imageUrl || undefined}
          size="lg"
        />
      </div>

      {/* 가게 정보 */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium">{storeInfo?.name || '가게'}</h2>
        <p className="text-sm text-gray-600">{storeInfo?.description || '설명이 없습니다.'}</p>
        <p className="text-sm text-gray-500">{storeInfo?.address || '주소가 없습니다.'}</p>
      </div>

      {/* 메뉴 카테고리 */}
      {categories.length > 0 ? (
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-[#FF7355] text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mb-6">
          등록된 메뉴 카테고리가 없습니다.
        </div>
      )}

      {/* 메뉴 목록 */}
      {menuItems.length > 0 ? (
        <div className="space-y-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.imageUrl || '/images/default-menu.png'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
                {/* 메뉴 상태 뱃지 */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.isPopular && (
                    <span className="bg-[#FF7355] text-white text-xs px-2 py-1 rounded-full">
                      인기
                    </span>
                  )}
                  {item.isNew && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      신메뉴
                    </span>
                  )}
                  {item.isRecommended && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      추천
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.name}</h3>
                  {!item.isAvailable && (
                    <span className="text-xs text-red-500">품절</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
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
                {item.preparationTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    준비시간: 약 {item.preparationTime}분
                  </p>
                )}
              </div>
              <button
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
                className={`px-4 py-2 rounded-lg ${
                  item.isAvailable
                    ? 'bg-[#FF7355] text-white hover:bg-[#FF6344]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {item.isAvailable ? '담기' : '품절'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {selectedCategory ? '등록된 메뉴가 없습니다.' : '카테고리를 선택해주세요.'}
        </div>
      )}

      {/* 장바구니 버튼 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pb-4 bg-white">
        <button 
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className={`w-full py-4 rounded-lg font-medium shadow-lg text-lg transition-colors ${
            cartItems.length > 0
              ? 'bg-[#FF7355] text-white hover:bg-[#FF6344]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          픽업 예약하기 {cartItems.length > 0 && `(${getTotalQuantity()})`}
        </button>
      </div>

      {/* 알림 팝업 */}
      {showPopup && (
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg">
          픽업 예약 목록에 추가되었습니다
        </div>
      )}
    </div>
  );
} 
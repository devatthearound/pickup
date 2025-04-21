'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStoreProfile } from '@/store/useStoreProfile';
import StoreProfileImage from '@/components/StoreProfileImage';
import { useParams } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';
import type { SVGProps } from 'react';

interface StoreInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  logoImageUrl: string;
}

interface MenuCategory {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  menuItemCategories?: Array<{
    id: number;
    menuItemId: number;
    categoryId: number;
    displayOrder: number;
  }>;
}

interface MenuItemCategory {
  id: number;
  menuItemId: number;
  categoryId: number;
  displayOrder: number;
  menuItem: MenuItem;
  category: MenuCategory;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const storeDomain = params.storeDomain as string;
  const axiosInstance = useAxios();

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${storeDomain}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [showPopup, setShowPopup] = useState(false);
  const { imageUrl, setImageUrl } = useStoreProfile();
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const categoryElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showMenuDetail, setShowMenuDetail] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${storeDomain}`, JSON.stringify(cartItems));
    }
  }, [cartItems, storeDomain]);

  // 가게 정보 가져오기
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/stores/${storeDomain}?type=domain`, {
          validateStatus: (status) => true // 모든 상태 코드를 에러로 간주하지 않고 처리
        });
        
        // 상태 코드에 따른 처리
        if (response.status !== 200) {
          // 400, 404 등 오류 응답 처리
          const errorData = response.data;
          
          if (response.status === 400 && errorData.message === '상점이 운영시간이 아닙니다.') {
            setIsStoreOpen(false);
            setError('지금은 운영시간이 아닙니다.');
          } else {
            setIsStoreOpen(false);
            setError(errorData.message || '가게 정보를 불러오는데 실패했습니다.');
          }
          return;
        }
        
        // 성공 응답 처리
        const { success, data, message } = response.data;
        
        if (!success) {
          setIsStoreOpen(false);
          setError(message || '가게 정보를 불러오는데 실패했습니다.');
          return;
        }
        
        setStoreInfo(data);
        setImageUrl(data.logoImageUrl);
        setIsStoreOpen(true);
      } catch (error: any) {
        console.error('가게 정보를 불러오는데 실패했습니다:', error);
        setIsStoreOpen(false);
        setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeDomain, setImageUrl]);

  // 메뉴 카테고리 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/menu-categories/store/${storeDomain}?type=domain`);
        const data = await response.data.data;
        if (data.length > 0) {
          // displayOrder로 정렬
          const sortedCategories = data.sort((a: MenuCategory, b: MenuCategory) => a.displayOrder - b.displayOrder);
          setCategories(sortedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [storeDomain]);

  // 모든 메뉴 아이템 가져오기
  useEffect(() => {
    const fetchAllMenuItems = async () => {
      try {
        const response = await axiosInstance.get(`/menu-item-categories/${storeDomain}?type=domain`);
        const data = await response.data.data;
        if (data) {
          // 중복 제거된 메뉴 아이템 목록 생성 및 menuItemCategories 추가
          const uniqueMenuItems = Array.from(
            new Map(
              data.map((item: MenuItemCategory) => [
                item.menuItem.id,
                {
                  ...item.menuItem,
                  menuItemCategories: data
                    .filter((mic: MenuItemCategory) => mic.menuItem.id === item.menuItem.id)
                    .map((mic: MenuItemCategory) => ({
                      id: mic.id,
                      menuItemId: mic.menuItemId,
                      categoryId: mic.categoryId,
                      displayOrder: mic.displayOrder,
                    })),
                },
              ])
            ).values()
          ) as MenuItem[];
          setMenuItems(uniqueMenuItems);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('메뉴를 불러오는데 실패했습니다:', error);
        setMenuItems([]);
      }
    };

    fetchAllMenuItems();
  }, [storeDomain]);

  // 카테고리 요소 참조 설정
  useEffect(() => {
    categories.forEach(category => {
      const element = document.getElementById(`category-${category.id}`);
      if (element) {
        categoryElementsRef.current.set(category.id, element);
      }
    });
  }, [categories]);

  // 카테고리로 스크롤하는 함수
  const scrollToCategory = (categoryId: number) => {
    const element = categoryElementsRef.current.get(categoryId);
    if (element) {
      const headerHeight = 120;
      const elementTop = element.offsetTop;
      const scrollPosition = elementTop - headerHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });

      // 스크롤 애니메이션 완료 후 isScrolling 해제
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }
  };


  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 카테고리별 메뉴 그룹화
  const menuItemsByCategory = categories.reduce((acc, category) => {
    // 해당 카테고리에 속한 메뉴 아이템들을 찾아서 displayOrder로 정렬
    const categoryMenuItems = menuItems.filter(menuItem => {
      return menuItem.menuItemCategories?.some(mic => mic.categoryId === category.id);
    }).sort((a, b) => {
      const aDisplayOrder = a.menuItemCategories?.find(mic => mic.categoryId === category.id)?.displayOrder || 0;
      const bDisplayOrder = b.menuItemCategories?.find(mic => mic.categoryId === category.id)?.displayOrder || 0;
      return aDisplayOrder - bDisplayOrder;
    });
    
    acc[category.id] = categoryMenuItems;
    return acc;
  }, {} as Record<number, MenuItem[]>);

  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setQuantity(1);
    setShowMenuDetail(true);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (selectedMenuItem?.stockQuantity && newQuantity > selectedMenuItem.stockQuantity) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedMenuItem) return;

    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === selectedMenuItem.id);
      const updatedItems = existingItem
        ? prev.map(cartItem =>
            cartItem.id === selectedMenuItem.id 
              ? { ...cartItem, quantity: cartItem.quantity + quantity } 
              : cartItem
          )
        : [...prev, { ...selectedMenuItem, quantity }];
      
      localStorage.setItem(`cart_${storeDomain}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
    setShowMenuDetail(false);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push(`/cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  // 가게가 운영시간이 아닐 때의 화면
  if (!isStoreOpen) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="sticky top-0 z-20 bg-white">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold">가게 정보</h1>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
          <div className="w-32 h-32 mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">지금은 운영시간이 아닙니다</h2>
          <p className="text-gray-600 text-center mb-8">{error}</p>
          
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344] transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!storeInfo) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="sticky top-0 z-20 bg-white">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold">가게 정보</h1>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
          <div className="w-32 h-32 mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">가게 정보를 불러올 수 없습니다</h2>
          <p className="text-gray-600 text-center mb-8">{error || '잠시 후 다시 시도해주세요.'}</p>
          
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344] transition-colors"
          >
            돌아가기
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
            <h1 className="text-lg font-bold">{storeInfo?.name || '가게'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 relative" onClick={handleCheckout}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF7355] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {getTotalQuantity()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div ref={categoryFilterRef} className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-gray-100 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 메뉴 목록 */}
      <div className="pb-24">
        {categories.map((category, index) => {
          const items = menuItemsByCategory[category.id] || [];
          return (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-40">
              <div className="px-4 py-3 bg-gray-50">
                <h3 className="font-bold">{category.name}</h3>
              </div>
              {items.length > 0 ? (
                <div>
                  {items.map((item, itemIndex) => {
                    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                    const quantity = cartItem?.quantity || 0;

                    return (
                      <div
                        key={item.id}
                        className={`px-4 py-4 flex gap-4 ${
                          itemIndex !== items.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleMenuItemClick(item)}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <h3 className="font-medium text-base truncate">
                              {item.name}
                              {itemIndex < 3 && index === 0 && (
                                <span className="text-[#5773FF] text-sm ml-2">인기 {itemIndex + 1}위</span>
                              )}
                            </h3>
                            {!item.isAvailable && (
                              <span className="text-xs text-red-500 shrink-0">품절</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
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
                          </div>
                        </div>
                        <div 
                          className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => handleMenuItemClick(item)}
                        >
                          <Image
                            src={item.imageUrl || '/images/default-menu.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  등록된 메뉴가 없습니다.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 메뉴 상세 팝업 */}
      {showMenuDetail && selectedMenuItem && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="fixed inset-0 bg-white overflow-y-auto">
            <div className="relative w-full h-64">
              <Image
                src={selectedMenuItem.imageUrl || '/images/default-menu.png'}
                alt={selectedMenuItem.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setShowMenuDetail(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 h-full">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-xl font-bold">{selectedMenuItem.name}</h1>
                {!selectedMenuItem.isAvailable && (
                  <span className="text-sm text-red-500">품절</span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{selectedMenuItem.description}</p>
              
              <div className="flex items-center gap-2 mb-6">
                <p className="text-lg font-bold">
                  {selectedMenuItem.discountedPrice !== selectedMenuItem.price
                    ? parseInt(selectedMenuItem.discountedPrice).toLocaleString('ko-KR')
                    : parseInt(selectedMenuItem.price).toLocaleString('ko-KR')}원
                </p>
                {selectedMenuItem.discountedPrice !== selectedMenuItem.price && (
                  <p className="text-sm text-gray-400 line-through">
                    {parseInt(selectedMenuItem.price).toLocaleString('ko-KR')}원
                  </p>
                )}
              </div>

              {/* 수량 조절 */}
              {selectedMenuItem.isAvailable && (
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
            {selectedMenuItem.isAvailable && (
              <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">수량</span>
                    <span className="font-medium">{quantity}개</span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-[#FF7355] text-white text-lg rounded-lg hover:bg-[#FF6347] transition-colors"
                  >
                    {quantity}개 담기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 장바구니 버튼 */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button 
            onClick={handleCheckout}
            className="w-full py-3.5 bg-[#FF7355] text-white font-medium rounded-lg"
          >
            {getTotalQuantity()}개 {cartItems.reduce((sum, item) => sum + (parseInt(item.discountedPrice || item.price) * item.quantity), 0).toLocaleString('ko-KR')}원 주문하기
          </button>
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
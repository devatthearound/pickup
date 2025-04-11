'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';

export default function PersonalInfoPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    // 현재 활성화된 가게 ID 가져오기
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (!currentStoreId) {
      setError('가게 정보를 찾을 수 없습니다.');
      return;
    }

    const storeIdNum = parseInt(currentStoreId);
    if (isNaN(storeIdNum)) {
      setError('잘못된 가게 정보입니다.');
      return;
    }

    setStoreId(storeIdNum);
    
    // 해당 가게의 장바구니 데이터 가져오기
    const savedCart = localStorage.getItem(`cart_${currentStoreId}`);
    if (!savedCart) {
      setError('장바구니가 비어있습니다.');
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart);
      if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
        setError('장바구니가 비어있습니다.');
        return;
      }
      setCartItems(parsedCart);
    } catch (e) {
      setError('장바구니 데이터가 손상되었습니다.');
    }
  }, []);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameValid = name.trim().length > 0;
    const phoneValid = validatePhone(phone);
    
    setIsNameValid(nameValid);
    setIsPhoneValid(phoneValid);
    
    if (!nameValid || !phoneValid || !storeId || cartItems.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        specialInstructions: ''
      }));

      const response = await axiosInstance.post('/orders',{
        storeId: storeId,
        items: orderItems,
        paymentMethod: 'cash',
        guestInfo: {
          name: name,
          phone: phone
        }
      });

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문 생성에 실패했습니다.');
      }

      const result = await response.data;
      console.log('주문 응답:', result);
      
      if (!result.success || !result.data) {
        throw new Error('주문 응답이 올바르지 않습니다.');
      }
      
      // 주문 성공 시 장바구니 비우기
      localStorage.removeItem(`cart_${storeId}`);
      
      // 주문 ID 저장하고 팝업 표시
      router.push(`/u/order/${result.data.orderNumber}`);

    } catch (error) {
      console.error('주문 에러:', error);
      setError('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">주문자 정보</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] ${
                !isNameValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="이름을 입력해주세요"
            />
            {!isNameValid && (
              <p className="mt-1 text-sm text-red-500">이름을 입력해주세요</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] ${
                !isPhoneValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="전화번호를 입력해주세요 (예: 01012345678)"
            />
            {!isPhoneValid && (
              <p className="mt-1 text-sm text-red-500">올바른 전화번호를 입력해주세요</p>
            )}
          </div>
          
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pb-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium shadow-lg text-lg hover:bg-[#FF6344] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '주문 처리 중...' : '주문 완료'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 
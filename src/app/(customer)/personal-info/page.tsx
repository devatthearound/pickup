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
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (!currentStoreId) {
      setError('가게 정보를 찾을 수 없습니다.');
      return;
    }

    setStoreId(currentStoreId);
  }, []);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleSugarRequest = (request: string) => {
    setSpecialInstructions(request);
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    } else if (phone.length === 10) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleOrderClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameValid = name.trim().length > 0;
    const phoneValid = validatePhone(phone);
    
    setIsNameValid(nameValid);
    setIsPhoneValid(phoneValid);
    
    if (!nameValid || !phoneValid || !storeId) {
      return;
    }

    // 전화번호 확인 팝업 표시
    setShowPhoneConfirm(true);
  };

  const handleSubmit = async () => {
    setShowPhoneConfirm(false);
    setIsLoading(true);
    setError(null);

    try {
      const savedCart = localStorage.getItem(`cart_${storeId}`);
      if (!savedCart) {
        throw new Error('장바구니가 비어있습니다.');
      }

      const cartItems = JSON.parse(savedCart);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('장바구니가 비어있습니다.');
      }

      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        specialInstructions: specialInstructions
      }));

      const response = await axiosInstance.post('/orders',{
        storeDomain: storeId,
        items: orderItems,
        paymentMethod: 'cash',
        guestInfo: {
          name: name,
          phone: phone,
          marketingConsent: marketingConsent
        }
      });

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문 생성에 실패했습니다.');
      }

      const result = await response.data;
      
      if (!result.success || !result.data) {
        throw new Error('주문 응답이 올바르지 않습니다.');
      }
      
      localStorage.removeItem(`cart_${storeId}`);
      router.push(`/order/${result.data.orderNumber}`);

    } catch (error) {
      console.error('주문 에러:', error);
      setError('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-lg font-bold">주문자 정보</h1>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* 안내 메시지 */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>• 주문은 가게 운영 상황에 따라 거절될 수 있습니다.</p>
          <p>• 주문 및 픽업 관련 알림은 알림톡으로 발송됩니다.</p>
        </div>

        <form onSubmit={handleOrderClick} className="space-y-6">
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
              전화번호(알림톡 발송)
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              id="phone"
              value={phone}
              maxLength={11}
              minLength={11}
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

          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              요청사항
            </label>
            <textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              placeholder="요청사항을 입력해주세요"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSugarRequest('설탕 많이')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                설탕 많이
              </button>
              <button
                type="button"
                onClick={() => handleSugarRequest('설탕 X')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                설탕 X
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* 전화번호 확인 모달 */}
      {showPhoneConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center mb-4">전화번호 확인</h3>
              <p className="text-center mb-6">
                아래 전화번호로 알림톡이 발송됩니다.<br />
                전화번호가 정확한지 확인해주세요.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-center text-lg font-bold text-[#FF7355]">{formatPhoneNumber(phone)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPhoneConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  수정하기
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-[#FF7355] text-white font-medium rounded-lg hover:bg-[#FF6344]"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 주문 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-center mb-3">
          <label className="relative flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="marketingConsent"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="sr-only"
            />
            <div className="relative w-5 h-5">
              <div className={`absolute inset-0 border-2 rounded-md transition-colors ${
                marketingConsent ? 'border-[#FF7355] bg-[#FF7355]' : 'border-gray-300'
              }`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className={`w-3 h-3 text-white transition-opacity ${
                    marketingConsent ? 'opacity-100' : 'opacity-0'
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7"></path>
                </svg>
              </div>
            </div>
            <span className="ml-2 text-sm text-gray-600">
              마케팅 정보 수신에 동의합니다 (선택)
            </span>
          </label>
        </div>
        <button
          type="submit"
          onClick={handleOrderClick}
          disabled={isLoading}
          className={`w-full py-3.5 bg-[#FF7355] text-white font-medium rounded-lg hover:bg-[#FF6344] transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? '주문 처리 중...' : '주문 완료'}
        </button>
      </div>
    </div>
  );
} 
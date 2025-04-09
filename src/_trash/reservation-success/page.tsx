'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReservationSuccessPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    // 로컬 스토리지에서 주문 정보 가져오기
    const savedOrderInfo = localStorage.getItem('orderInfo');
    if (savedOrderInfo) {
      const info = JSON.parse(savedOrderInfo);
      setOrderInfo(info);
      
      // 주문 코드 생성 (예: 현재 시간을 기반으로 한 6자리 코드)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderCode(code);
      
      // 주문 정보에 코드 추가
      const updatedOrderInfo = {
        ...info,
        orderCode: code,
      };
      localStorage.setItem('orderInfo', JSON.stringify(updatedOrderInfo));
      
      // 3초 후 주문 코드 페이지로 이동
      const timer = setTimeout(() => {
        router.push(`/u/order-code/${code}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // 주문 정보가 없는 경우 장바구니 페이지로 이동
      router.push('/u/cart');
    }
  }, [router]);

  if (!orderInfo) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">주문이 완료되었습니다!</h2>
        <p className="text-gray-600 mb-4">
          {orderInfo.customerName}님의 주문이 접수되었습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500 mb-1">주문 코드</p>
          <p className="text-2xl font-bold text-[#FF7355]">{orderCode}</p>
        </div>
        <p className="text-sm text-gray-500">
          잠시 후 주문 코드 페이지로 이동합니다...
        </p>
      </div>
    </div>
  );
} 
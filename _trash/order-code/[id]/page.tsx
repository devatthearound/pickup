'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface OrderInfo {
  storeId: string;
  customerName: string;
  customerPhone: string;
  orderCode: string;
  timestamp: string;
}

export default function OrderCodePage() {
  const router = useRouter();
  const params = useParams();
  const orderCode = params.id as string;
  
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const savedOrderInfo = localStorage.getItem('orderInfo');
    if (savedOrderInfo) {
      const info = JSON.parse(savedOrderInfo);
      if (info.orderCode === orderCode) {
        setOrderInfo(info);
      }
    }
  }, [orderCode]);

  if (!orderInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">주문 정보를 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/store/orders')}
            className="mt-4 px-6 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
          >
            주문 내역으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">주문 코드</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">주문 코드</p>
          <p className="text-3xl font-bold text-[#FF7355]">{orderInfo.orderCode}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">주문자</p>
            <p className="font-medium">{orderInfo.customerName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">연락처</p>
            <p className="font-medium">{orderInfo.customerPhone}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">주문 시간</p>
            <p className="font-medium">
              {new Date(orderInfo.timestamp).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pb-4">
        <button
          onClick={() => router.push('/store/orders')}
          className="w-full py-4 bg-[#FF7355] text-white rounded-lg font-medium shadow-lg text-lg hover:bg-[#FF6344] transition-colors"
        >
          주문 내역으로 가기
        </button>
      </div>
    </div>
  );
} 
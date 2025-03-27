'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';

interface OrderInfo {
  id: string;
  storeName: string;
  date: string;
  status: 'pending' | 'preparing' | 'completed';
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
}

export default function OrderCodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const { id } = use(params);

  useEffect(() => {
    // 주문 정보 가져오기 (실제로는 API 호출)
    const orderData: OrderInfo = {
      id,
      storeName: '도넛캠프',
      date: '2024-03-20 14:30',
      status: 'pending',
      items: [
        { name: '클래식 도넛', price: 3500, quantity: 2 },
        { name: '초코 도넛', price: 3500, quantity: 1 }
      ],
      total: 10500,
      customerName: '홍길동',
      customerPhone: '010-1234-5678'
    };
    setOrderInfo(orderData);
  }, [id]);

  if (!orderInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
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
          <h1 className="text-white text-lg font-medium w-full text-center">주문코드</h1>
        </div>

        {/* 주문 정보 */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-medium mb-4">주문 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">픽업 날짜</span>
                <span className="font-medium">{orderInfo.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">상점명</span>
                <span className="font-medium">{orderInfo.storeName}</span>
              </div>
            </div>
          </div>

          {/* 주문코드 */}
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-[#FF7355]">
            <h2 className="text-lg font-medium mb-4">픽업 코드</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF7355] mb-2">{orderInfo.id}</div>
              <p className="text-sm text-gray-500">픽업 시 이 코드를 보여주세요</p>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">고객 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">이름</span>
                <span className="font-medium">{orderInfo.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">전화번호</span>
                <span className="font-medium">{orderInfo.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
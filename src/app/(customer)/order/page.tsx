'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderInfo {
  storeId: string;
  customerName: string;
  customerPhone: string;
  orderCode: string;
  timestamp: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderInfo[]>([]);

  useEffect(() => {
    const savedOrderInfo = localStorage.getItem('orderInfo');
    if (savedOrderInfo) {
      const orderInfo = JSON.parse(savedOrderInfo);
      setOrders([orderInfo]);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold ml-2">주문 내역</h1>
          </div>
        </div>
      </div>

      <div className="p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-600">주문 내역이 없습니다</h2>
            <p className="text-sm text-gray-500 mt-2">새로운 주문을 해보세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderCode}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                onClick={() => router.push(`/order/${order.orderCode}`)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">주문번호</span>
                        <span className="text-base font-bold text-gray-900">{order.orderCode}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">주문자</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600">{order.customerPhone}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/order/${order.orderCode}`);
                      }}
                      className="text-[#FF7355] hover:text-[#FF6344] text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      상세보기
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
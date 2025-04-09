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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">주문 내역이 없습니다</h2>
          <p className="text-gray-500 mt-2">새로운 주문을 해보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderCode}
              className="bg-white rounded-lg shadow-sm p-4"
              onClick={() => router.push(`/store/order-code/${order.orderCode}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">주문 코드: {order.orderCode}</p>
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
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/store/order-code/${order.orderCode}`);
                  }}
                  className="text-[#FF7355] hover:text-[#FF6344]"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
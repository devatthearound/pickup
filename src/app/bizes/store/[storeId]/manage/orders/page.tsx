'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  pickupTime: string;
  createdAt: string;
}

export default function StoreOrdersPage() {
  const params = useParams();
  const storeId = params.storeId;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/stores/${storeId}/orders`);
      if (!response.ok) {
        throw new Error('주문 목록을 불러오는데 실패했습니다.');
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('주문 데이터가 올바르지 않습니다.');
      }
      setOrders(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchOrders();
      // 30초마다 주문 목록 갱신
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [storeId]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '주문 대기';
      case 'accepted':
        return '주문 수락';
      case 'preparing':
        return '준비 중';
      case 'ready':
        return '준비 완료';
      case 'rejected':
        return '주문 거절';
      default:
        return '완료';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-lg text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-6 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4 sm:p-6">
        {/* 필터 버튼 */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === 'all' ? 'bg-[#FF7355] text-white' : 'bg-white text-gray-600'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === 'pending' ? 'bg-[#FF7355] text-white' : 'bg-white text-gray-600'
            }`}
          >
            주문 대기
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === 'accepted' ? 'bg-[#FF7355] text-white' : 'bg-white text-gray-600'
            }`}
          >
            주문 수락
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === 'preparing' ? 'bg-[#FF7355] text-white' : 'bg-white text-gray-600'
            }`}
          >
            준비 중
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              filter === 'ready' ? 'bg-[#FF7355] text-white' : 'bg-white text-gray-600'
            }`}
          >
            준비 완료
          </button>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/bizes/store/${storeId}/manage/orders/${order.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">주문 #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>고객: {order.customerName}</p>
                    <p>전화: {order.customerPhone}</p>
                    <p>픽업 예정: {new Date(order.pickupTime).toLocaleString()}</p>
                    <p className="font-medium text-[#FF7355]">
                      총 금액: {order.totalAmount.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">해당 상태의 주문이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
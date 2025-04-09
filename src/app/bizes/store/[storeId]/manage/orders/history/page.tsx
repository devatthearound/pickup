'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import axiosInstance from '@/lib/axios-interceptor';
import { OrderStatus,Order } from '@/types/order';


interface OrderQueryParams {
  page?: number;
  limit?: number;
  storeId?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export default function StoreOrdersHistoryPage() {
  const params = useParams();
  const storeId = params.storeId;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [queryParams, setQueryParams] = useState<OrderQueryParams>({
    page: 1,
    limit: 10,
    storeId: Number(storeId)
  });

  const fetchOrders = async () => {
    try {
      const queryString = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryString.append(key, String(value));
        }
      });

      const response = await axiosInstance.get(`http://13.124.138.71:3001/api/orders?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('주문 목록을 불러오는데 실패했습니다.');
      }

      const result = await response.data;
      setOrders(result.data.data);
      setTotalCount(result.data.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchOrders();
    }
  }, [storeId, queryParams, fetchOrders]);

  const handleStatusFilterChange = (status: OrderStatus | '') => {
    setSelectedStatus(status);
    setQueryParams(prev => ({
      ...prev,
      status: status || undefined,
      page: 1
    }));
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSearch = () => {
    setQueryParams(prev => ({
      ...prev,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      page: 1
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.ACCEPTED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PREPARING:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case OrderStatus.CANCELED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '주문 대기';
      case OrderStatus.ACCEPTED:
        return '주문 수락';
      case OrderStatus.PREPARING:
        return '준비 중';
      case OrderStatus.READY:
        return '준비 완료';
      case OrderStatus.REJECTED:
        return '주문 거절';
      case OrderStatus.CANCELED:
        return '주문 취소';
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* 필터 섹션 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="space-y-4">
            {/* 날짜 범위 선택 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleDateSearch}
                  className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                >
                  검색
                </button>
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilterChange('')}
                className={`px-4 py-2 rounded-lg ${
                  selectedStatus === ''
                    ? 'bg-[#FF7355] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {Object.values(OrderStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === status
                      ? 'bg-[#FF7355] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">주문 #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>고객: {order.customerName}</p>
                  <p>전화: {order.customerPhone}</p>
                  <p>픽업 예정: {format(new Date(order.pickupTime), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}</p>
                  <div className="mt-2">
                    <p className="font-medium">주문 내역:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {order.orderItems.map((item) => (
                        <li key={item.id}>
                          {item.menuItem.name} x {item.quantity}
                          {item.specialInstructions && ` (${item.specialInstructions})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-[#FF7355]">
                      총 금액: {Number(order.finalAmount).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">해당 조건의 주문이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalCount > 0 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(totalCount / (queryParams.limit || 10)) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[#FF7355] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAxios } from '@/hooks/useAxios';
import { OrderStatus, Order, PaymentStatus } from '@/types/order';
import { useParams } from 'next/navigation';

interface OrderQueryParams {
  page?: number;
  limit?: number;
  storeId?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export default function OrdersList() {
  const {storeId} = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>(OrderStatus.PENDING);
  const [changingStatus, setChangingStatus] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const axiosInstance = useAxios();

  // 오늘 날짜 설정
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString().split('T')[0];

  const [queryParams, setQueryParams] = useState<OrderQueryParams>({
    page: 1,
    limit: 10,
    storeId: Number(storeId),
    status: OrderStatus.PENDING,
    startDate: startOfDay,
    endDate: endOfDay
  });

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const queryString = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryString.append(key, String(value));
        }
      });

      const response = await axiosInstance.get(`/orders?${queryString}`);

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchOrders();
      // 30초마다 주문 목록 갱신
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [storeId, queryParams]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    if (changingStatus !== null || isRefreshing) return;
    
    try {
      setChangingStatus(orderId);
      
      // 거부 상태일 경우 거부 사유 입력 모달 표시
      if (newStatus === OrderStatus.REJECTED) {
        const reason = window.prompt('거부 사유를 입력해주세요:');
        if (!reason) {
          setChangingStatus(null);
          return;
        }
        
        const response = await axiosInstance.patch(`/orders/${orderId}/status`, { 
          status: newStatus,
          rejectionReason: reason
        });

        if (response.status !== 200) {
          const errorData = await response.data;
          throw new Error(errorData.message || '주문 상태 변경에 실패했습니다.');
        }

        await fetchOrders();
        return;
      }

      // 일반 상태 변경
      const response = await axiosInstance.patch(`/orders/${orderId}/status`,{
        status: newStatus
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문 상태 변경에 실패했습니다.');
      }

      await fetchOrders();
    } catch (err) {
      console.error('주문 상태 변경 실패:', err);
      alert(err instanceof Error ? err.message : '주문 상태 변경에 실패했습니다.');
    } finally {
      setChangingStatus(null);
    }
  };

  const handleStatusFilterChange = (status: OrderStatus | '') => {
    setSelectedStatus(status);
    setQueryParams(prev => ({
      ...prev,
      status: status || undefined,
      page: 1
    }));
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '주문 접수';
      // case OrderStatus.ACCEPTED:
      //   return '주문 접수';
      case OrderStatus.PREPARING:
        return '처리중';
      case OrderStatus.READY:
        return '픽업 대기';
      case OrderStatus.COMPLETED:
        return '픽업 완료';
      // case OrderStatus.REJECTED:
      // case OrderStatus.CANCELED:
      //   return '주문조회';
      default:
        return '완료';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
      // case OrderStatus.ACCEPTED:
        return 'bg-[#FFF5EE] text-[#FF6B00]';
      case OrderStatus.PREPARING:
        return 'bg-[#E6F7FF] text-[#1890FF]';
      case OrderStatus.READY:
      case OrderStatus.COMPLETED:
        return 'bg-[#F6FFED] text-[#52C41A]';
      case OrderStatus.REJECTED:
      // case OrderStatus.CANCELED:
        return 'bg-[#FFF1F0] text-[#FF4D4F]';
      default:
        return 'bg-[#F6FFED] text-[#52C41A]';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQueryParams(prev => ({
      ...prev,
      page
    }));
  };

  const handleRejectClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedOrderId || !rejectReason.trim()) return;
    
    try {
      setChangingStatus(selectedOrderId);
      const response = await axiosInstance.patch(`/orders/${selectedOrderId}/status`, { 
        status: OrderStatus.REJECTED,
        rejectionReason: rejectReason.trim()
      });

      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문 상태 변경에 실패했습니다.');
      }

      await fetchOrders();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedOrderId(null);
    } catch (err) {
      console.error('주문 거절 실패:', err);
      alert(err instanceof Error ? err.message : '주문 거절에 실패했습니다.');
    } finally {
      setChangingStatus(null);
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
    <div className="min-h-screen bg-[#F7F7F7] p-4">
      <div className="max-w-6xl mx-auto">
        {/* 로딩 인디케이터 */}
        {(changingStatus !== null || isRefreshing) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white px-8 py-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-base font-medium text-gray-800">처리하는 중</span>
            </div>
          </div>
        )}

        {/* 거절 사유 입력 모달 */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">주문 거절 사유</h3>
                
                {/* 빠른 선택 버튼 */}
                <div className="flex flex-col gap-2 mb-4">
                  <button
                    onClick={() => setRejectReason('반죽/재료 소진으로 인해 조기 마감되었습니다.')}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    반죽/재료 소진으로 인해 조기 마감되었습니다.
                  </button>
                </div>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="거절 사유를 입력해주세요"
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] resize-none"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setSelectedOrderId(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectReason.trim() || changingStatus !== null}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] rounded-lg hover:bg-[#FF8A3D] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingStatus === selectedOrderId ? '처리 중...' : '거절하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{format(new Date(), 'M월 d일', { locale: ko })} 주문내역</h1>
          <Link
            href={`/bizes/store/${storeId}/manage/orders/history`}
            className="px-4 py-2 text-sm bg-white text-[#FF6B00] rounded-full border border-[#FF6B00] hover:bg-[#FFF5EE] transition-colors"
          >
            주문 내역
          </Link>
        </div>

        {/* 상태 필터 */}
        <div className="grid grid-cols-4 gap-0 mb-6">
          <button
            onClick={() => handleStatusFilterChange(OrderStatus.PENDING)}
            className={`p-4 text-center font-bold ${
              selectedStatus === OrderStatus.PENDING
                ? 'bg-[#FF6B00] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="block">주문</span>
            <span className="block">접수</span>
          </button>
          <button
            onClick={() => handleStatusFilterChange(OrderStatus.PREPARING)}
            className={`p-4 text-center font-bold ${
              selectedStatus === OrderStatus.PREPARING
                ? 'bg-[#FF6B00] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="block">처리중</span>
          </button>
          <button
            onClick={() => handleStatusFilterChange(OrderStatus.READY)}
            className={`p-4 text-center font-bold ${
              selectedStatus === OrderStatus.READY
                ? 'bg-[#FF6B00] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="block">완료</span>
          </button>
          <button
            onClick={() => handleStatusFilterChange(OrderStatus.COMPLETED)}
            className={`p-4 text-center font-bold ${
              selectedStatus === OrderStatus.COMPLETED
                ? 'bg-[#FF6B00] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="block">주문</span>
            <span className="block">조회</span>
          </button>
        </div>

        {/* 주문 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* 주문 헤더 */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">주문번호 : {order.orderNumber}</span>
                      <span className="text-sm text-gray-500">
                        주문일시: {format(new Date(order.createdAt), 'MM/dd HH:mm', { locale: ko })}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* 주문 메뉴 */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-base font-bold mb-3 text-gray-800">
                    주문 내역
                  </h4>
                  <ul className="space-y-3">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900">
                            {item.menuItem.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-800">
                          <span className="text-base">{item.quantity}개</span>
                          <span className="text-base font-medium">{Number(Number(item.menuItem.price) * item.quantity).toLocaleString()}원</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.orderItems[0].specialInstructions && (
                    <p className="mt-3 text-sm bg-[#FFF5EE] text-[#FF6B00] border border-[#FFE2D3] px-4 py-3 rounded-lg">
                      <span className="font-bold">요청사항:</span> {order.orderItems[0].specialInstructions}
                    </p>
                  )}
                </div>

                {/* 고객 정보 */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="text-base font-bold mb-3 text-gray-800">
                    고객 정보
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">주문자:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">연락처:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* 총 금액과 액션 버튼 */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">총 금액</span>
                    <p className="text-lg font-bold text-[#FF6B00]">
                      {Number(order.finalAmount).toLocaleString()}원
                    </p>
                  </div>

                  <div className="flex justify-end">
                    {order.status === OrderStatus.PENDING && (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleRejectClick(order.id)}
                          disabled={changingStatus !== null || isRefreshing}
                          className={`w-full px-4 py-2 text-sm font-medium bg-gray-400 text-white rounded-lg transition-colors ${
                            changingStatus !== null || isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'
                          }`}
                        >
                          주문거절
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, OrderStatus.PREPARING)}
                          disabled={changingStatus !== null || isRefreshing}
                          className={`w-full px-4 py-2 text-sm font-medium bg-[#FF6B00] text-white rounded-lg transition-colors ${
                            changingStatus !== null || isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF8A3D]'
                          }`}
                        >
                          수락하기
                        </button>
                      </div>
                    )}
                    {order.status === OrderStatus.PREPARING && (
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.READY)}
                        disabled={changingStatus !== null || isRefreshing}
                        className={`w-full px-4 py-2 text-sm font-medium bg-[#FF6B00] text-white rounded-lg transition-colors ${
                          changingStatus !== null || isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF8A3D]'
                        }`}
                      >
                        완료
                      </button>
                    )}
                    {order.status === OrderStatus.READY && (
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                        disabled={changingStatus !== null || isRefreshing}
                        className={`w-full px-4 py-2 text-sm font-medium bg-[#FF6B00] text-white rounded-lg transition-colors ${
                          changingStatus !== null || isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF8A3D]'
                        }`}
                      >
                        픽업완료
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl shadow-sm">
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
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm rounded-full ${
                    currentPage === page
                      ? 'bg-[#FF6B00] text-white'
                      : 'bg-white text-gray-600 hover:bg-[#FFF5EE]'
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
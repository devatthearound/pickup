'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axiosInstance from '@/lib/axios-interceptor';

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specialInstructions: string | null;
  menuItem: {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
  };
  options: any[];
}

interface Order {
  id: number;
  orderNumber: string;
  store?: {
    name: string;
    address: string;
    phone: string;
  };
  status: string;
  totalAmount: number;
  finalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  statusHistory?: {
    id: number;
    previousStatus: string | null;
    newStatus: string;
    changedAt: string;
    reason: string | null;
  }[];
  payments?: {
    id: number;
    amount: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string | null;
    paymentDetails: any | null;
    paidAt: string | null;
    refundedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStatusNotification, setShowStatusNotification] = useState(false);
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState('');

  const fetchOrder = async (phone: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`http://13.124.138.71:3001/api/orders/by-number-and-phone/${orderNumber}/${phone}`);
      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문을 찾을 수 없습니다.');
      }
      const result = await response.data;
      if (!result.success || !result.data) {
        throw new Error('주문 데이터가 올바르지 않습니다.');
      }

      // 상태가 변경되었는지 확인
      if (order && order.status !== result.data.status) {
        setLastStatus(order.status);
        setShowStatusNotification(true);
        setTimeout(() => setShowStatusNotification(false), 5000);
      }

      setOrder(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주문 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone) {
      setError('전화번호를 입력해주세요.');
      return;
    }

    await fetchOrder(searchPhone);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        {/* <p className="text-lg text-gray-600 mb-4">{error || '주문 정보를 찾을 수 없습니다.'}</p> */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4">주문 검색</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600">주문 번호: {orderNumber}</p>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="전화번호 입력"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
              >
                검색
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return '가게에서 주문을 확인 중입니다.';
      case 'accepted':
        return '가게에서 주문을 수락했습니다.';
      case 'rejected':
        return '가게에서 주문을 거절했습니다.';
      case 'preparing':
        return '가게에서 음식을 준비 중입니다.';
      case 'ready':
        return '음식이 준비되었습니다. 픽업해주세요!';
      case 'completed':
        return '주문이 완료되었습니다.';
      default:
        return '주문 상태가 변경되었습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-md mx-auto p-4 sm:p-6">
        {/* 상태 변경 알림 */}
        {showStatusNotification && lastStatus && order && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-[#FF7355]">
              <p className="text-sm sm:text-base font-medium text-gray-800">{getStatusMessage(order.status)}</p>
            </div>
          </div>
        )}

        {/* 주문 번호 및 상태 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">주문 번호</h1>
              <span className="text-base sm:text-lg font-medium text-gray-600">{order.orderNumber}</span>
            </div>
            <button
              onClick={() => fetchOrder(order.customerPhone)}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              title="새로고침"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">주문 상태</span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                order.status === 'ready' ? 'bg-green-100 text-green-800' :
                order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'pending' ? '주문 대기' :
                 order.status === 'accepted' ? '주문 수락' :
                 order.status === 'preparing' ? '준비 중' :
                 order.status === 'ready' ? '준비 완료' :
                 order.status === 'rejected' ? '주문 거절' :
                 '완료'}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 sm:p-3 rounded-lg">
              {getStatusMessage(order.status)}
            </div>
          </div>
        </div>

        {/* 가게 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">가게 정보</h2>
          <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600">
            {order.store ? (
              <>
                <p className="font-medium">{order.store.name}</p>
                <p className="break-words">{order.store.address}</p>
                <p>{order.store.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">가게 정보를 불러오는 중입니다...</p>
            )}
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">주문 상품</h2>
          <div className="space-y-3 sm:space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    {item.menuItem?.imageUrl ? (
                      <Image
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs sm:text-sm text-gray-400">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium truncate">{item.menuItem?.name || '알 수 없는 메뉴'}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{item.quantity}개</p>
                    <p className="text-sm sm:text-base text-[#FF7355] font-medium">
                      {parseInt(item.unitPrice).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-500">주문 상품이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 주문자 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">주문자 정보</h2>
          <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600">
            <p>이름: {order.customerName}</p>
            <p>전화번호: {order.customerPhone}</p>
          </div>
        </div>

        {/* 주문 상태 이력 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">주문 상태 이력</h2>
          <div className="space-y-2">
            {order.statusHistory && order.statusHistory.length > 0 ? (
              order.statusHistory.map((history, index) => (
                <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b last:border-b-0">
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {history.newStatus === 'pending' ? '주문 대기' :
                       history.newStatus === 'accepted' ? '주문 수락' :
                       history.newStatus === 'preparing' ? '준비 중' :
                       history.newStatus === 'ready' ? '준비 완료' :
                       history.newStatus === 'rejected' ? '주문 거절' :
                       '완료'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(history.changedAt).toLocaleString()}
                    </p>
                  </div>
                  {history.reason && (
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-full">
                      {history.reason}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-gray-500">주문 상태 이력이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">결제 정보</h2>
          <div className="space-y-2">
            {order.payments && order.payments.length > 0 ? (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm sm:text-base text-gray-600">결제 방법</span>
                  <span className="text-sm sm:text-base">{order.payments[0].paymentMethod === 'cash' ? '현금' : '카드'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm sm:text-base text-gray-600">결제 상태</span>
                  <span className={`text-sm sm:text-base ${
                    order.payments[0].paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.payments[0].paymentStatus === 'completed' ? '결제 완료' : '결제 대기'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg mt-4">
                  <span>총 결제 금액</span>
                  <span className="text-[#FF7355]">
                    {parseInt(order.payments[0].amount).toLocaleString()}원
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">결제 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
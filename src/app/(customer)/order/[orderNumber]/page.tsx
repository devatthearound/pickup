'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAxios } from '@/hooks/useAxios';

interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  menuItem: {
    id: number;
    storeId: number;
    name: string;
    description: string | null;
    price: string;
    discountedPrice: string;
    imageUrl: string;
    preparationTime: number | null;
    isAvailable: boolean;
    isPopular: boolean;
    isNew: boolean;
    isRecommended: boolean;
    stockQuantity: number | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specialInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  options: any[];
}

interface Store {
  id: number;
  ownerId: number;
  name: string;
  domain: string;
  englishName: string;
  businessRegistrationNumber: string;
  businessRegistrationFile: string;
  categoryId: number;
  address: string;
  addressDetail: string;
  phone: string;
  businessHours: string;
  description: string;
  logoImage: string;
  bannerImage: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  customerId: number | null;
  customerName: string;
  customerPhone: string;
  isGuestOrder: boolean;
  storeId: number;
  store: Store;
  status: string;
  totalAmount: string;
  discountAmount: string;
  finalAmount: string;
  paymentStatus: string;
  paymentMethod: string;
  pickupTime: string;
  actualPickupTime: string | null;
  customerNote: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  statusHistory: any[];
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
  const axiosInstance = useAxios();

  const fetchOrder = async (phone: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/orders/by-number-and-phone/${orderNumber}/${phone}`);
      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문을 찾을 수 없습니다.');
      }
      const result = await response.data;
      if (!result.success || !result.data) {
        throw new Error('주문 데이터가 올바르지 않습니다.');
      }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="sticky top-0 z-20 bg-white">
          <div className="flex items-center justify-between p-2">
            <button onClick={() => router.back()} className="p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">주문 검색</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">주문 번호</h2>
              <p className="text-gray-600">{orderNumber}</p>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344] transition-colors"
                >
                  검색
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between p-2">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">주문 상세</h1>
          <button
            onClick={() => fetchOrder(order.customerPhone)}
            className="p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 상태 변경 알림 */}
      {showStatusNotification && lastStatus && order && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-[#FF7355]">
            <p className="text-sm font-medium text-gray-800">{getStatusMessage(order.status)}</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* 주문 상태 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-sm font-medium text-gray-500">주문 번호</h2>
              <p className="text-lg font-bold">{order.orderNumber}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {getStatusMessage(order.status)}
          </p>
        </div>

        {/* 가게 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">가게 정보</h2>
          <div className="space-y-2 text-sm text-gray-600">
            {order.store ? (
              <>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-medium">{order.store.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="break-words">{order.store.address} {order.store.addressDetail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p>{order.store.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>영업시간: {order.store.businessHours}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">가게 정보를 불러오는 중입니다...</p>
            )}
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">주문 상품</h2>
          <div className="space-y-3">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium">{item.menuItem?.name || '알 수 없는 메뉴'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.quantity}개</p>
                    </div>
                    <p className="text-base font-medium text-[#FF7355]">
                      {parseInt(item.totalPrice).toLocaleString()}원
                    </p>
                  </div>
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500 mt-2">요청사항: {item.specialInstructions}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">주문 상품이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 주문자 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">주문자 정보</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p>{order.customerName}</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p>{order.customerPhone}</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>픽업 예정 시간: {new Date(order.pickupTime).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">결제 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">결제 방법</span>
              <span className="text-sm">{order.paymentMethod === 'cash' ? '현금' : '카드'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">결제 상태</span>
              <span className={`text-sm ${
                order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {order.paymentStatus === 'completed' ? '결제 완료' : '결제 대기'}
              </span>
            </div>
            {/* <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-600">할인 금액</span>
              <span className="text-sm text-[#FF7355]">
                -{parseInt(order.discountAmount).toLocaleString()}원
              </span>
            </div> */}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>총 결제 금액</span>
              <span className="text-[#FF7355]">
                {parseInt(order.finalAmount).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
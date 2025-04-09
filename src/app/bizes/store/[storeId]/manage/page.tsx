'use client';

import { useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  pickupTime: string;
  status: 'pending' | 'preparing' | 'ready';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

interface Benefit {
  id: string;
  name: string;
  description: string;
  icon: string;
  minAmount?: number;
  isAlways: boolean;
}

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');
  
  // 예시 주문 데이터
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      customerName: '홍길동',
      customerPhone: '010-1234-5678',
      createdAt: '2024-03-20 14:30',
      pickupTime: '15:00',
      status: 'pending',
      items: [
        { name: '클래식 도넛', quantity: 2, price: 3500 },
        { name: '초코 도넛', quantity: 1, price: 3500 }
      ],
      total: 10500
    },
    {
      id: 'ORD-2024-002',
      customerName: '김철수',
      customerPhone: '010-8765-4321',
      createdAt: '2024-03-20 14:35',
      pickupTime: '15:30',
      status: 'preparing',
      items: [
        { name: '바닐라 도넛', quantity: 3, price: 3500 }
      ],
      total: 10500
    },
    {
      id: 'ORD-2024-003',
      customerName: '이영희',
      customerPhone: '010-2468-1357',
      createdAt: '2024-03-20 14:40',
      pickupTime: '16:00',
      status: 'ready',
      items: [
        { name: '딸기 도넛', quantity: 2, price: 3500 },
        { name: '커피', quantity: 2, price: 4500 }
      ],
      total: 16000
    }
  ]);

  // 혜택 정보
  const benefits: Benefit[] = [
    {
      id: 'donut',
      name: '도넛 추가 증정',
      description: '도넛 1개 추가 증정',
      icon: '🍩',
      minAmount: 15000,
      isAlways: false
    },
    {
      id: 'drink',
      name: '음료 사이즈업',
      description: '음료 사이즈업 무료',
      icon: '🥤',
      minAmount: 15000,
      isAlways: false
    },
    {
      id: 'box',
      name: '포장 박스',
      description: '포장 박스 무료 제공',
      icon: '📦',
      isAlways: true
    }
  ];

  // 주문에 적용되는 혜택 필터링
  const getApplicableBenefits = (orderTotal: number) => {
    return benefits.filter(benefit => 
      benefit.isAlways || (benefit.minAmount && orderTotal >= benefit.minAmount)
    );
  };

  // 주문 상태 변경
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // 상태별 주문 필터링
  const filteredOrders = orders.filter(order => order.status === activeTab);

  // 상태별 주문 수 계산
  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  // 다음 상태로 변경
  const getNextStatus = (currentStatus: Order['status']): Order['status'] => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'ready'
    };
    return statusFlow[currentStatus] as Order['status'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-4">
        <h1 className="text-white text-lg font-medium text-center">도넛캠프 - 주문 관리</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-6 relative border-b-2 ${
            activeTab === 'pending' 
              ? 'text-[#FF7355] border-[#FF7355] bg-white' 
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-lg font-medium">접수대기</div>
        </button>
        <button
          onClick={() => setActiveTab('preparing')}
          className={`flex-1 py-6 relative border-b-2 ${
            activeTab === 'preparing' 
              ? 'text-[#FF7355] border-[#FF7355] bg-white' 
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-lg font-medium">
            준비중
            {orderCounts.preparing > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-[#FF7355] text-white rounded-full w-6 h-6 text-sm">
                {orderCounts.preparing}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ready')}
          className={`flex-1 py-6 relative border-b-2 ${
            activeTab === 'ready' 
              ? 'text-[#FF7355] border-[#FF7355] bg-white' 
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-lg font-medium">
            준비완료
            {orderCounts.ready > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-[#FF7355] text-white rounded-full w-6 h-6 text-sm">
                {orderCounts.ready}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 주문 목록 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border-b last:border-b-0">
              <div className="p-4 flex gap-4">
                {/* 주문 정보 */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">주문 정보</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'pending' ? '준비 전' :
                         order.status === 'preparing' ? '준비 중' : '준비 완료'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">주문번호</span>
                        <span className="font-medium">{order.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">픽업 시간</span>
                        <span className="font-medium">{order.pickupTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">고객명</span>
                        <span className="font-medium">{order.customerName} ({order.customerPhone})</span>
                      </div>
                    </div>
                  </div>

                  {/* 주문 메뉴 */}
                  <div className="bg-white rounded-lg p-4 mb-4 border-2 border-[#FF7355]">
                    <h2 className="text-lg font-medium mb-4">주문 메뉴</h2>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-3xl font-bold">{item.name}</span>
                          <span className="text-3xl font-bold text-[#FF7355]">{item.quantity}개</span>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-medium">총 결제금액</span>
                          <span className="text-3xl font-bold text-[#FF7355]">{order.total.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* 이벤트 혜택 */}
                    {getApplicableBenefits(order.total).length > 0 && (
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-medium mb-3">🎁 픽업 시 혜택</h3>
                        <div className="space-y-2">
                          {getApplicableBenefits(order.total).map(benefit => (
                            <div key={benefit.id} className="flex items-center gap-2">
                              <span className="text-2xl">{benefit.icon}</span>
                              <span className="text-lg">{benefit.description}</span>
                              {benefit.minAmount && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({benefit.minAmount.toLocaleString()}원 이상)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 버튼 */}
                {order.status !== 'ready' && (
                  <div className="flex items-center w-48">
                    <button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                      className={`w-full h-full text-white rounded-xl text-2xl font-medium transition-colors py-6 flex flex-col items-center justify-center ${
                        order.status === 'pending' 
                          ? 'bg-[#FF7355] hover:bg-[#FF6344]' 
                          : 'bg-[#4A90E2] hover:bg-[#357ABD]'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-1">
                        {order.status === 'pending' && '준비 시작'}
                        {order.status === 'preparing' && '준비 완료'}
                      </div>
                      <div className="text-xl opacity-90">{order.id}</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              {activeTab === 'pending' && '새로운 주문이 없습니다'}
              {activeTab === 'preparing' && '준비중인 주문이 없습니다'}
              {activeTab === 'ready' && '준비완료된 주문이 없습니다'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
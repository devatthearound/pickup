'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  pickupTime: string;
  items: {
    name: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}

export default function StorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');
  
  // 예시 주문 데이터
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: '김철수',
      pickupTime: '15:30',
      items: [
        { name: '클래식 도넛 세트', quantity: 1 },
        { name: '초코 도넛', quantity: 2 },
      ],
      totalAmount: 19000,
      status: 'pending',
      createdAt: '14:20'
    },
    {
      id: '2',
      customerName: '이영희',
      pickupTime: '16:00',
      items: [
        { name: '클래식 도넛 세트', quantity: 2 },
      ],
      totalAmount: 24000,
      status: 'preparing',
      createdAt: '14:25'
    },
    {
      id: '3',
      customerName: '박지민',
      pickupTime: '15:00',
      items: [
        { name: '초코 도넛', quantity: 3 },
      ],
      totalAmount: 10500,
      status: 'ready',
      createdAt: '13:50'
    }
  ]);

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
    completed: orders.filter(o => o.status === 'completed').length,
  };

  // 다음 상태로 변경
  const getNextStatus = (currentStatus: Order['status']): Order['status'] => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: 'completed'
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
          className={`flex-1 py-3 relative ${activeTab === 'pending' ? 'text-[#FF7355]' : 'text-gray-500'}`}
        >
          <div className="text-sm font-medium">접수대기</div>
          {orderCounts.pending > 0 && (
            <div className="absolute top-2 -right-1 bg-[#FF7355] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {orderCounts.pending}
            </div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('preparing')}
          className={`flex-1 py-3 relative ${activeTab === 'preparing' ? 'text-[#FF7355]' : 'text-gray-500'}`}
        >
          <div className="text-sm font-medium">준비중</div>
          {orderCounts.preparing > 0 && (
            <div className="absolute top-2 -right-1 bg-[#FF7355] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {orderCounts.preparing}
            </div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('ready')}
          className={`flex-1 py-3 relative ${activeTab === 'ready' ? 'text-[#FF7355]' : 'text-gray-500'}`}
        >
          <div className="text-sm font-medium">준비완료</div>
          {orderCounts.ready > 0 && (
            <div className="absolute top-2 -right-1 bg-[#FF7355] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {orderCounts.ready}
            </div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 relative ${activeTab === 'completed' ? 'text-[#FF7355]' : 'text-gray-500'}`}
        >
          <div className="text-sm font-medium">완료</div>
        </button>
      </div>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-4 border-b">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-medium">{order.customerName}</span>
                <span className="text-sm text-gray-500 ml-2">#{order.id}</span>
              </div>
              <div className="text-sm text-gray-500">{order.createdAt}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">픽업 예정</span>
                <span className="text-[#FF7355] font-medium">{order.pickupTime}</span>
              </div>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-500">{item.quantity}개</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">{order.totalAmount.toLocaleString()}원</span>
              {order.status !== 'completed' && (
                <button
                  onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                  className="px-4 py-2 bg-[#FF7355] text-white rounded-lg text-sm font-medium"
                >
                  {order.status === 'pending' && '준비 시작'}
                  {order.status === 'preparing' && '준비 완료'}
                  {order.status === 'ready' && '픽업 완료'}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {activeTab === 'pending' && '새로운 주문이 없습니다'}
            {activeTab === 'preparing' && '준비중인 주문이 없습니다'}
            {activeTab === 'ready' && '준비완료된 주문이 없습니다'}
            {activeTab === 'completed' && '완료된 주문이 없습니다'}
          </div>
        )}
      </div>
    </div>
  );
} 
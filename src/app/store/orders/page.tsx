'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  options?: string[];
}

interface Order {
  id: string;
  customerName: string;
  pickupTime: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Order['status']>('pending');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerName: '김민지',
      pickupTime: '오후 3:30',
      items: [
        { name: '플레인 도넛', quantity: 2 },
        { name: '초코 도넛', quantity: 1, options: ['초콜릿 추가'] },
      ],
      totalAmount: 15000,
      status: 'pending',
      createdAt: '14:20',
    },
    {
      id: 'ORD002',
      customerName: '이하늘',
      pickupTime: '오후 4:00',
      items: [
        { name: '딸기 도넛', quantity: 3 },
        { name: '아메리카노', quantity: 1, options: ['ICE'] },
      ],
      totalAmount: 22000,
      status: 'preparing',
      createdAt: '14:35',
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);
  
  const getStatusCount = (status: Order['status']) => {
    return orders.filter(order => order.status === status).length;
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
    };
    return statusFlow[currentStatus] as Order['status'] | null;
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: '접수대기',
      preparing: '준비중',
      ready: '준비완료',
      completed: '완료',
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">도넛캠프 - 주문 관리</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex bg-white shadow-sm">
        {(['pending', 'preparing', 'ready', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`flex-1 py-3 text-sm font-medium relative ${
              activeTab === status ? 'text-[#FF7355] border-b-2 border-[#FF7355]' : 'text-gray-500'
            }`}
          >
            {getStatusText(status)}
            {getStatusCount(status) > 0 && (
              <span className={`absolute -top-1 -right-1 px-2 py-0.5 text-xs rounded-full ${
                activeTab === status ? 'bg-[#FF7355] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {getStatusCount(status)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 주문 목록 */}
      <div className="p-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'completed' ? '완료된 주문이 없습니다.' : '새로운 주문이 없습니다.'}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{order.customerName}</span>
                  <span className="text-sm text-gray-500 ml-2">#{order.id}</span>
                </div>
                <div className="text-sm text-gray-500">{order.createdAt}</div>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-[#FF7355] mb-2">
                  픽업 예정: {order.pickupTime}
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      {item.name} x {item.quantity}
                      {item.options && item.options.map((option, i) => (
                        <span key={i} className="text-gray-500 text-xs ml-1">
                          ({option})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                  <span className="text-sm font-medium">총 결제금액</span>
                  <span className="font-medium">{order.totalAmount.toLocaleString()}원</span>
                </div>
              </div>

              {order.status !== 'completed' && (
                <button
                  onClick={() => {
                    const nextStatus = getNextStatus(order.status);
                    if (nextStatus) updateOrderStatus(order.id, nextStatus);
                  }}
                  className="w-full py-2 bg-[#FF7355] text-white rounded-lg text-sm font-medium hover:bg-[#FF6344] transition-colors"
                >
                  {order.status === 'pending' && '주문 접수하기'}
                  {order.status === 'preparing' && '준비 완료하기'}
                  {order.status === 'ready' && '픽업 완료하기'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
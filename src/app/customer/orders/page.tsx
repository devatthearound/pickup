'use client';

import { useRouter } from 'next/navigation';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  status: 'pending' | 'preparing' | 'completed';
  items: OrderItem[];
  total: number;
  phone: string;
  address: string;
  businessHours: string;
}

export default function OrdersPage() {
  const router = useRouter();

  // 임시 주문 데이터
  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      storeId: '1',
      storeName: '도넛캠프',
      date: '2024-03-20 14:30',
      status: 'pending',
      items: [
        { name: '클래식 도넛', price: 3500, quantity: 2 },
        { name: '초코 도넛', price: 3500, quantity: 1 }
      ],
      total: 10500,
      phone: '02-1234-5678',
      address: '서울시 마포구 연남로 123길 34',
      businessHours: '10:00-20:00'
    },
    {
      id: 'ORD-2024-002',
      storeId: '2',
      storeName: '베이커리 하우스',
      date: '2024-03-19 15:00',
      status: 'completed',
      items: [
        { name: '크로와상', price: 4500, quantity: 3 }
      ],
      total: 13500,
      phone: '02-8765-4321',
      address: '서울시 마포구 연남로 456길 78',
      businessHours: '08:00-22:00'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-[140px]">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-4 flex items-center relative">
        <h1 className="text-white text-lg font-medium w-full text-center">주문내역</h1>
      </div>

      {/* 주문 내역 */}
      <div className="p-4 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg p-4"
          >
            {/* 주문 번호 */}
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">주문번호</div>
              <div className="text-xl font-bold text-[#FF7355]">{order.id}</div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{order.storeName}</h3>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status === 'pending' ? '준비중' :
                 order.status === 'preparing' ? '준비완료' : '픽업완료'}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price.toLocaleString()}원</span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>총 결제금액</span>
                <span>{order.total.toLocaleString()}원</span>
              </div>
            </div>
            
            {/* 상점 정보 */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {order.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {order.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {order.businessHours}
              </div>
            </div>

            {/* 상점 홈으로 가기 버튼 */}
            <div className="mt-4 flex justify-end gap-2">
              {order.status !== 'completed' && (
                <button
                  onClick={() => router.push(`/customer/order-code/${order.id}`)}
                  className="px-4 py-2 text-sm bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                >
                  주문코드 확인
                </button>
              )}
              <button
                onClick={() => router.push(`/customer/store/${order.storeId}`)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                상점 홈으로 가기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
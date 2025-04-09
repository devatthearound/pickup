'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

interface Order {
  id: string;
  orderNumber: string;
  orderCode: string;
  storeName: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime: string;
  orderedAt: string;
  region: string; // 지역 정보 추가
}

interface StoreGroup {
  region: string;
  stores: {
    id: string;
    name: string;
    orderCount: number;
  }[];
}

export default function AdminOrdersPage() {
  // 검색어
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  
  // 필터 상태
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<Order['status'] | 'all'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 정렬
  const [sortBy, setSortBy] = useState<{
    field: 'orderedAt' | 'pickupTime' | 'totalAmount';
    direction: 'asc' | 'desc';
  }>({ field: 'orderedAt', direction: 'desc' });

  // 주문 데이터 상태
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORDER-001',
      orderNumber: 'ORD-2024-001',
      orderCode: 'A123',
      storeName: '도넛캠프 강남점',
      storeId: 'STORE-001',
      customerName: '김고객',
      customerPhone: '010-1234-5678',
      items: [
        { name: '도넛', quantity: 2, price: 3000 },
        { name: '커피', quantity: 1, price: 4000 }
      ],
      totalAmount: 10000,
      status: 'pending',
      pickupTime: '2024-03-20 14:30',
      orderedAt: '2024-03-20 14:00',
      region: '서울'
    },
    {
      id: 'ORDER-002',
      orderNumber: 'ORD-2024-002',
      orderCode: 'B456',
      storeName: '도넛캠프 홍대점',
      storeId: 'STORE-002',
      customerName: '이고객',
      customerPhone: '010-8765-4321',
      items: [
        { name: '도넛', quantity: 3, price: 3000 }
      ],
      totalAmount: 9000,
      status: 'preparing',
      pickupTime: '2024-03-20 15:00',
      orderedAt: '2024-03-20 14:15',
      region: '서울'
    },
    {
      id: 'ORDER-003',
      orderNumber: 'ORD-2024-003',
      orderCode: 'C789',
      storeName: '도넛캠프 분당점',
      storeId: 'STORE-003',
      customerName: '박고객',
      customerPhone: '010-9876-5432',
      items: [
        { name: '도넛', quantity: 1, price: 3000 },
        { name: '커피', quantity: 2, price: 4000 }
      ],
      totalAmount: 11000,
      status: 'ready',
      pickupTime: '2024-03-20 15:30',
      orderedAt: '2024-03-20 14:30',
      region: '경기'
    }
  ]);

  // 예시 데이터 - 실제로는 API에서 가져올 데이터
  const regions: StoreGroup[] = [
    {
      region: '서울',
      stores: [
        { id: 'STORE-001', name: '도넛캠프 강남점', orderCount: 5 },
        { id: 'STORE-002', name: '도넛캠프 홍대점', orderCount: 3 },
      ]
    },
    {
      region: '경기',
      stores: [
        { id: 'STORE-003', name: '도넛캠프 분당점', orderCount: 2 },
        { id: 'STORE-004', name: '도넛캠프 일산점', orderCount: 4 },
      ]
    }
  ];

  // 상태별 색상
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  // 상태별 한글 텍스트
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '주문 접수';
      case 'preparing': return '준비 중';
      case 'ready': return '준비 완료';
      case 'completed': return '픽업 완료';
      case 'cancelled': return '주문 취소';
    }
  };

  // 필터링된 주문 목록
  const getFilteredOrders = () => {
    return orders.filter(order => {
      // 지역 필터
      if (selectedRegion !== 'all' && order.region !== selectedRegion) return false;
      
      // 매장 필터
      if (selectedStore !== 'all' && order.storeId !== selectedStore) return false;
      
      // 상태 필터
      if (activeStatus !== 'all' && order.status !== activeStatus) return false;
      
      // 검색어 필터
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.orderCode.toLowerCase().includes(searchLower) ||
          order.storeName.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerPhone.includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // 정렬된 주문 목록
  const getSortedOrders = (filteredOrders: Order[]) => {
    return [...filteredOrders].sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];
      
      if (sortBy.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // 페이지네이션된 주문 목록
  const getPaginatedOrders = (sortedOrders: Order[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedOrders.slice(startIndex, startIndex + itemsPerPage);
  };

  // 최종 표시될 주문 목록
  const filteredOrders = getFilteredOrders();
  const sortedOrders = getSortedOrders(filteredOrders);
  const paginatedOrders = getPaginatedOrders(sortedOrders);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 필터 영역 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 검색 */}
          <div>
            <input
              type="text"
              placeholder="주문번호, 매장명, 고객명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            />
          </div>

          {/* 지역 선택 */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedStore('all');
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            >
              <option value="all">전체 지역</option>
              {regions.map(region => (
                <option key={region.region} value={region.region}>
                  {region.region}
                </option>
              ))}
            </select>
          </div>

          {/* 매장 선택 */}
          <div>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            >
              <option value="all">전체 매장</option>
              {selectedRegion === 'all'
                ? regions.flatMap(region => region.stores).map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.orderCount})
                    </option>
                  ))
                : regions
                    .find(r => r.region === selectedRegion)
                    ?.stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.orderCount})
                      </option>
                    ))
              }
            </select>
          </div>

          {/* 기간 선택 */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'today' | 'week' | 'month')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
            >
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
            </select>
          </div>
        </div>

        {/* 상태 필터 */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setActiveStatus('all')}
            className={`px-4 py-2 rounded-lg ${
              activeStatus === 'all'
                ? 'bg-[#FF7355] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {(['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-lg ${
                activeStatus === status
                  ? 'bg-[#FF7355] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-500">
          <div className="col-span-2">주문정보</div>
          <div className="col-span-2">매장정보</div>
          <div className="col-span-2">고객정보</div>
          <div className="col-span-2">
            <button
              onClick={() => setSortBy({
                field: 'orderedAt',
                direction: sortBy.field === 'orderedAt' && sortBy.direction === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1"
            >
              주문시간
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => setSortBy({
                field: 'pickupTime',
                direction: sortBy.field === 'pickupTime' && sortBy.direction === 'asc' ? 'desc' : 'asc'
              })}
              className="flex items-center gap-1"
            >
              픽업시간
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
          <div className="col-span-2">상태</div>
        </div>

        {/* 주문 목록 */}
        <div className="divide-y">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
              <div className="col-span-2">
                <div className="font-medium">{order.orderNumber}</div>
                <div className="text-sm text-gray-500">코드: {order.orderCode}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">{order.storeName}</div>
                <div className="text-sm text-gray-500">{order.region}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-gray-500">{order.customerPhone}</div>
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                {order.orderedAt}
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                {order.pickupTime}
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            총 {filteredOrders.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)}건
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-[#FF7355] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { subscribeToEvents, type Order, type Inquiry } from '@/lib/socket';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [orderCount, setOrderCount] = useState(15);
  const [inquiryCount, setInquiryCount] = useState(5);

  const menuItems = [
    {
      name: '주문 관리',
      path: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: '스토어별 주문 현황 및 관리',
      count: 12,
    },
    {
      name: '문의 관리',
      path: '/admin/customer-service',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      description: '고객 및 스토어 문의사항 관리',
      count: 5,
    },
  ];

  useEffect(() => {
    // 실시간 이벤트 구독
    const unsubscribe = subscribeToEvents(
      // 주문 이벤트 핸들러
      (order: Order) => {
        if (order.status === 'pending' || order.status === 'preparing') {
          setOrderCount(prev => prev + 1);
        } else if (order.status === 'completed' || order.status === 'cancelled') {
          setOrderCount(prev => Math.max(0, prev - 1));
        }
      },
      // 문의 이벤트 핸들러
      (inquiry: Inquiry) => {
        if (inquiry.status === 'waiting') {
          setInquiryCount(prev => prev + 1);
        } else if (inquiry.status === 'completed') {
          setInquiryCount(prev => Math.max(0, prev - 1));
        }
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <div className="w-72 bg-white shadow-sm">
        {/* 로고 */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF7355] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF7355] to-[#FF7355]/70 text-transparent bg-clip-text">
              Pickup Admin
            </span>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="px-4 py-2">
          <div className="text-sm font-medium text-gray-400 mb-2">관리 메뉴</div>
          
          {/* 주문 관리 */}
          <Link 
            href="/admin/orders" 
            className={`flex items-center justify-between p-3 rounded-xl group ${
              pathname === '/admin/orders' 
                ? 'bg-[#FF7355] hover:bg-[#FF7355]' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                pathname === '/admin/orders'
                  ? 'bg-white/20'
                  : 'bg-[#FF7355]/10 group-hover:bg-[#FF7355]/20'
              }`}>
                <svg className={`w-5 h-5 ${
                  pathname === '/admin/orders' ? 'text-white' : 'text-[#FF7355]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <div className={`font-medium ${
                  pathname === '/admin/orders' ? 'text-white' : 'text-gray-900'
                }`}>주문 관리</div>
                <div className={`text-sm ${
                  pathname === '/admin/orders' ? 'text-white/80' : 'text-gray-500'
                }`}>스토어별 주문 현황 및 관리</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-sm font-medium ${
              pathname === '/admin/orders'
                ? 'bg-white/20 text-white'
                : 'bg-[#FF7355]/10 text-[#FF7355]'
            }`}>
              {orderCount}
            </div>
          </Link>

          {/* 문의 관리 */}
          <Link 
            href="/admin/customer-service" 
            className={`flex items-center justify-between p-3 rounded-xl group mt-2 ${
              pathname === '/admin/customer-service' 
                ? 'bg-[#FF7355] hover:bg-[#FF7355]' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                pathname === '/admin/customer-service'
                  ? 'bg-white/20'
                  : 'bg-[#FF7355]/10 group-hover:bg-[#FF7355]/20'
              }`}>
                <svg className={`w-5 h-5 ${
                  pathname === '/admin/customer-service' ? 'text-white' : 'text-[#FF7355]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <div className={`font-medium ${
                  pathname === '/admin/customer-service' ? 'text-white' : 'text-gray-900'
                }`}>문의 관리</div>
                <div className={`text-sm ${
                  pathname === '/admin/customer-service' ? 'text-white/80' : 'text-gray-500'
                }`}>고객 및 스토어 문의사항 관리</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-sm font-medium ${
              pathname === '/admin/customer-service'
                ? 'bg-white/20 text-white'
                : 'bg-[#FF7355]/10 text-[#FF7355]'
            }`}>
              {inquiryCount}
            </div>
          </Link>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 
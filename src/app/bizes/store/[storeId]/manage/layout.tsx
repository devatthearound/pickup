'use client';

import { useAxios } from '@/hooks/useAxios';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { storeId } = useParams();
  const axiosInstance = useAxios();

  // 모바일에서 메뉴 열었을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = [
    { href: `/bizes/store/${storeId}/manage/orders`, label: '주문 관리', exact: true },
    { href: `/bizes/store/${storeId}/manage/menu`, label: '메뉴 관리' },
    { href: `/bizes/store/${storeId}/manage/benefits`, label: '혜택 관리' },
    { href: `/bizes/store/${storeId}/manage/setup`, label: '매장 설정' },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');

      if (response.status !== 201) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      // 로그아웃 성공 시 로그인 페이지로 이동
      router.push('/bizes/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-1">
                <button 
                    onClick={() => window.history.back()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">도넛캠프 운암점</h1>
            </div> 
             <nav className="flex items-center space-x-4">
                {/* <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                </button>
                <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                </button>
                <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button> */}
                      {/* 모바일 햄버거 버튼 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800 text-white"
              >
                {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </nav>
            </div>
        </header>
      {/* 모바일 오버레이 */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 사이드바 - 모바일에서만 표시 */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">도넛캠프</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-[#FF7355] text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="space-y-2">
            {/* <Link
              href="/customer-service"
              className="block w-full px-4 py-2 text-center text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              고객센터
            </Link> */}
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-center text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <main className="min-h-screen pt-14 lg:ml-64">
          {children}
      </main>
    </>
  );
} 
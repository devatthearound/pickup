'use client';

import axiosInstance from '@/lib/axios-interceptor';
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
      const response = await axiosInstance.post('https://api.xn--5h5bx6z0e.kr/api/auth/logout');

      if (response.status !== 201) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      // 로그아웃 성공 시 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
      >
        {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* 모바일 오버레이 */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 사이드바 */}
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

      {/* 메인 콘텐츠 */}
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
} 
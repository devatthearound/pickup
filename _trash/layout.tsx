'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainPage = pathname === '/customer';

  return (
    <div className="flex flex-col h-screen">
      {/* 고정 헤더 */}
      {/* <header className="bg-white border-b fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/customer" className="text-xl font-bold text-[#FF7355]">
            PICKUP
          </Link>
        </div>
      </header> */}

      {/* 스크롤 가능한 메인 컨텐츠 */}
      {/* <main className="flex-1 -y-auoverflowto pt-16 pb-24">
        {children}
      </main> */}
       {children}

      {/* 고정 하단 네비게이션 */}
      {/* {!isMainPage && (
        <div className="bg-white border-t fixed bottom-0 left-0 right-0 z-20">
          <div className="flex justify-around">
            <Link href="/store" className="flex flex-col items-center py-3 px-6">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1 text-gray-500">홈</span>
            </Link>
            <Link href="/store/orders" className="flex flex-col items-center py-3 px-6">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs mt-1 text-gray-500">주문내역</span>
            </Link>
            <Link href="/store/profile" className="flex flex-col items-center py-3 px-6">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1 text-gray-500">프로필</span>
            </Link>
          </div>
        </div>
      )} */}
    </div>
  );
} 
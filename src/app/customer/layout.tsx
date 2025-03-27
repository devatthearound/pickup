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
    <>
      <style jsx global>{`
        body {
          padding: 0 !important;
          margin: 0 !important;
          background-color: #f8f9fa !important;
        }
        header, footer {
          display: none !important;
        }
        main {
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/customer" className="text-xl font-bold text-[#FF7355]">
              PICKUP
            </Link>
          </div>
        </header>

        <main className="relative">
          {children}
        </main>

        {/* 하단 네비게이션 - 메인 페이지가 아닐 때만 표시 */}
        {!isMainPage && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
            <div className="flex justify-around">
              <Link href="/customer" className="flex flex-col items-center py-3 px-6">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1 text-gray-500">홈</span>
              </Link>
              <Link href="/customer/orders" className="flex flex-col items-center py-3 px-6">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs mt-1 text-gray-500">주문내역</span>
              </Link>
              <Link href="/customer/profile" className="flex flex-col items-center py-3 px-6">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1 text-gray-500">프로필</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 
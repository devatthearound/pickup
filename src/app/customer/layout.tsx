'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    {
      name: "홈",
      href: "/customer",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "검색",
      href: "/customer/search",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: "장바구니",
      href: "/customer/cart",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: "내정보",
      href: "/customer/profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

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
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
        {/* 헤더 */}
        <header className="flex items-center h-16 px-4 bg-coral-500 text-white">
          <Link href="/" className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">Pickup</h1>
        </header>

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* 하단 네비게이션 바 */}
        <nav className="flex items-center justify-around h-16 bg-white border-t border-gray-200">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center text-gray-400 hover:text-coral-500"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
} 
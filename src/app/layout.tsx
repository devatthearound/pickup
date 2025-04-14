'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { setCookie } from "@/lib/useCookie";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickup",
  description: "Pickup - 스토어 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // 전역 이벤트 리스너 설정
    const messageListener = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === 'AUTO_LOGIN') {
        // 토큰을 사용하여 자동 로그인 시도
        const token = message.token;
        // 로그인 API 호출
          // refreshToken은 쿠키에 저장
          console.log('token', token);
        setCookie('refreshToken', token, {
          expires: new Date(new Date().setDate(new Date().getDate() + 14)),
        });
      }
    };

    window.addEventListener('message', messageListener);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* <header className="bg-white shadow-sm">

        </header> */}
        {/* <main className="max-w-7xl mx-auto">
          {children}
        </main> */}
        {/* <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              © 2024 Pickup. All rights reserved.
            </p>
          </div>
        </footer> */}
      </body>
    </html>
  );
}

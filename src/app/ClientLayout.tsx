'use client';
import "./globals.css";
import { useEffect } from "react";
import { setCookie } from "@/lib/useCookie";

export default function ClientLayout({
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

  return <>{children}</>;
}

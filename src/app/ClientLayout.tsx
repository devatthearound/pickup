'use client';
import { useEffect, useState } from "react";
import { setCookie } from "@/lib/useCookie";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('ClientLayout mounted');

    // React Native WebView에서 메시지를 수신하는 함수
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data);
      
      try {
        const message = JSON.parse(event.data);
        console.log('Parsed message:', message);
        
        if (message.type === 'AUTO_LOGIN') {
          setIsLoggedIn(true);
          const token = message.token;
          console.log('Setting token:', token);
          setCookie('refreshToken', token, {
            expires: new Date(new Date().setDate(new Date().getDate() + 14)),
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // 이벤트 리스너 추가
    window.addEventListener('message', handleMessage);
    console.log('Message listener added');

    // React Native WebView가 있는지 확인
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      console.log('ReactNativeWebView is available');
      // React Native WebView에 메시지 수신 준비 완료를 알림
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'WEBVIEW_READY'
      }));
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
      console.log('Message listener removed');
    };
  }, []);

  if (!isLoggedIn) {
    return <></>;
  }
  return <>{children}</>;
}

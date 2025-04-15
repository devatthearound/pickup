'use client';

import { setCookie } from '@/lib/useCookie';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // const [connectionStatus, setConnectionStatus] = useState('확인 중...');
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.ReactNativeWebView === 'undefined') return;
    // WebView 브릿지 연결 확인
    // const checkConnection = () => {
    //   if (window.ReactNativeWebView) {
    //     setConnectionStatus('WebView 브릿지 연결됨');
    //     console.log('ReactNativeWebView 브릿지 발견');
        
    //     // 연결 상태 보고
    //     window.ReactNativeWebView.postMessage(JSON.stringify({
    //       type: 'BRIDGE_CONNECTED',
    //       data: { time: new Date().toISOString() }
    //     }));
    //   } else {
    //     setConnectionStatus('WebView 브릿지 없음 (일반 브라우저)');
    //     console.log('ReactNativeWebView 브릿지 없음');
    //   }
    // };

    // 메시지 이벤트 핸들러
    const handleMessage = (event: MessageEvent) => {
      console.log('메시지 이벤트 수신:', event);
      
      try {
        let messageData;
        if (typeof event.data === 'string') {
          messageData = JSON.parse(event.data);
        } else {
          messageData = event.data;
        }
        
        console.log('파싱된 메시지:', messageData);

        // AUTO_LOGIN 메시지 처리
        if (messageData.type === 'AUTO_LOGIN' && messageData.token) {
          console.log('AUTO_LOGIN 토큰 수신:', messageData.token);
          // 토큰 저장 로직 추가
          setCookie('refreshToken', messageData.token, {
            expires: new Date(new Date().setDate(new Date().getDate() + 14)),
          });
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    };

    // 디버깅을 위한 글로벌 객체
    (window as any).expoDebug = {
      messages: [],
      logMessage: function(msg: string) {
        this.messages.push(msg);
        console.log('expoDebug:', msg);
      }
    };

    // 이벤트 리스너 등록
    console.log('이벤트 리스너 등록 중');
    window.addEventListener('message', handleMessage);
    
    // 초기화 실행
    // checkConnection();
    
    // Next.js가 로드되었음을 Expo에 알림
    // if (window.ReactNativeWebView) {
    //   window.ReactNativeWebView.postMessage(JSON.stringify({
    //     type: 'NEXT_JS_READY',
    //     data: { 
    //       ready: true, 
    //       time: new Date().toISOString(),
    //       connectionStatus
    //     }
    //   }));
    // }
    
    // 클린업 함수
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  return (
    <>
      {/* 디버깅 정보 표시 (개발 모드에서만) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          padding: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div>연결 상태: {connectionStatus}</div>
        </div>
      )} */}
      {children}
    </>
  );
}
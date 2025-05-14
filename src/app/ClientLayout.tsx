'use client';

import { setCookie } from '@/lib/useCookie';
import { useEffect } from 'react';
import { useAxios } from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
// FCM 토큰 등록을 위한 타입 정의
type DeviceType = 'IOS' | 'ANDROID' | 'WEB';

interface FCMTokenData {
  fcmToken: string;
  platform: string;
  platformVersion: string | number;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  systemVersion: string;
  appVersion: string;
  buildNumber: string;
}

interface ExpoDebug {
  messages: string[];
  logMessage: (msg: string) => void;
}

declare global {
  interface Window {
    expoDebug: ExpoDebug;
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const axiosInstance = useAxios();
  const router = useRouter();
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
          // 토큰 저장 로직 추가
          setCookie('pu-atrf', messageData.token, {
            expires: new Date(new Date().setDate(new Date().getDate() + 14)),
          });

          setCookie('pu-atac', messageData.token, {
            expires: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
          });
        }

        // FCM 토큰 업데이트 처리
        if (messageData.type === 'FCM_TOKEN_UPDATE' && messageData.data) {
          console.log('FCM 토큰 업데이트 수신:', messageData.data);
          handleFCMTokenUpdate(messageData.data);
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    };

    // FCM 토큰 업데이트 처리 함수
    const handleFCMTokenUpdate = async (data: FCMTokenData) => {
      try {
        const deviceType: DeviceType = data.platform === 'ios' ? 'IOS' : 
                                     data.platform === 'android' ? 'ANDROID' : 'WEB';

        const response = await axiosInstance.post('/notification/register-token', {
          fcmToken: data.fcmToken,
          deviceType: deviceType,
          deviceId: data.deviceId
        });

        console.log('FCM 토큰 등록 성공:', response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
        } else {
          console.error('FCM 토큰 등록 실패:', error);

        }
      }
    };

    // 디버깅을 위한 글로벌 객체
    window.expoDebug = {
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
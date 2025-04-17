import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from '@/lib/useCookie';
import { useRouter } from 'next/navigation';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.xn--5h5bx6z0e.kr';
const API_URL = 'http://localhost:3001';
export const useAxios = () => {
  const { accessToken, setAccessToken } = useAuth();
  const router = useRouter();
  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getCookie('refreshToken');
          console.log('refreshToken', refreshToken);
          
          if (!refreshToken) {
            router.push('/bizes/login');
            return Promise.reject(error);
          }

          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // refreshToken은 쿠키에 저장
          setCookie('refreshToken', newRefreshToken, {
            expires: new Date(new Date().setDate(new Date().getDate() + 14)),
          });

          // React Native 앱에서 토큰 저장
          if (typeof window !== 'undefined' && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'TOKEN_UPDATE',
              token: newRefreshToken
            }));
          }

          // 새로운 accessToken으로 요청 재시도
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          deleteCookie('refreshToken');
          // React Native 앱에서 토큰 저장
          if (typeof window !== 'undefined' && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'LOGOUT'
            }));
          }

          // 로그아웃 후 페이지 이동
          router.push('/bizes/login');
          
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}; 
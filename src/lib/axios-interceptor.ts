// api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 이미 재시도한 요청이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 새로운 Access Token 발급 요청
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // 실패한 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃 처리
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수
const handleLogout = () => {
  // 로그인 페이지로 리다이렉트
  window.location.href = '/login';
};

export default axiosInstance;
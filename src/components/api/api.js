import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 엔드포인트 기본 URL
  withCredentials: true, // 쿠키 전송을 허용
});

let refreshSubscribers = [];

// 요청 재시도 로직
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
      console.log('Request Interceptor Triggered:', config);
      const accessToken = localStorage.getItem('Authorization');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response Interceptor Success:', response);
      return response;},
    async (error) => {
      const originalRequest = error.config;

      // 토큰 만료 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        let isRefreshing = false;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await axiosInstance.post(
                '/refresh', // 토큰 재발급 엔드포인트
                {} // 요청 body (필요 없으면 빈 객체)
            );
            const newToken = response.data.token;
            localStorage.setItem('Authorization', newToken);
            onRefreshed(newToken); // 기존 요청에 새 토큰 적용
            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            localStorage.removeItem('Authorization');
            const navigate = useNavigate();
            navigate('/'); // 로그아웃 처리
            return Promise.reject(refreshError);
          }
        }

        // 기존 요청 재시도
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;

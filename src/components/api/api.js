import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // 백엔드 엔드포인트 기본 url
  withCredentials: true,  // 쿠키 전송을 허용
})

axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("Authorization");

      if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config;
    },
    (error) => {
      return Promise.reject(error)
    }
)

export default axiosInstance;

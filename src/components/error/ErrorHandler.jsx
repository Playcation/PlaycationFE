import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./ErrorPage";

const ErrorHandler = ({ apiEndpoint }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint, {
          withCredentials: true,
        });
        // API 호출 성공 시, 다음 페이지로 이동
        navigate("/main");
      } catch (err) {
        if (err.response) {
          // 서버에서 반환된 오류를 상태에 저장
          setError({
            status: err.response.status,
            errorName: err.response.data.errorName,
            message: err.response.data.message,
          });
        } else {
          // 네트워크 오류 처리
          setError({
            status: 500,
            errorName: "Network Error",
            message: "서버와의 연결이 실패했습니다.",
          });
        }
      }
    };

    fetchData();
  }, [apiEndpoint, navigate]);

  if (error) {
    return <ErrorPage status={error.status} errorName={error.errorName} message={error.message} />;
  }

  return <div>로딩 중...</div>;
};

export default ErrorHandler;

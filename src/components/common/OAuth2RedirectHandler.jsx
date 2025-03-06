import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPage from "../error/ErrorPage";

const OAuth2RedirectHandler = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOAuth2Callback = async () => {
      try {
        const response = await axios.get("/oauth2/callback", {
          withCredentials: true,
        });

        // 성공적으로 로그인한 경우 홈으로 이동
        navigate("/main");
      } catch (err) {
        if (err.response) {
          // 서버에서 반환된 오류 메시지를 상태에 저장
          setError({
            status: err.response.status,
            message: err.response.data.message,
          });
        } else {
          // 네트워크 오류 또는 기타 클라이언트 오류 처리
          setError({
            status: 500,
            message: "알 수 없는 오류가 발생했습니다.",
          });
        }
      }
    };

    fetchOAuth2Callback();
  }, [navigate]);

  // 오류가 있으면 ErrorPage 컴포넌트를 렌더링
  if (error) {
    return <ErrorPage status={error.status} message={error.message} />;
  }

  // 오류가 없으면 로딩 상태를 표시
  return <div>OAuth2 로그인 처리 중...</div>;
};

export default OAuth2RedirectHandler;

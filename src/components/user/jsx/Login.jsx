import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

import axiosInstance from "../../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sseMessage, setSseMessage] = useState(""); // SSE 메시지 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) return;

      try {
        await axiosInstance.post("/check/token", {});
        navigate("/main");
      } catch {
        console.error("Invalid token. Staying on login page.");
        try {
          await axiosInstance.post("/logout", {});
          localStorage.removeItem("Authorization");
          navigate("/");
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Failed to log out. Please try again.");
        }
      }
    };

    checkToken();
  }, [navigate]);

  // SSE 이벤트 리스너 추가
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/sse");

    eventSource.onmessage = (event) => {
      console.log("SSE Message Received:", event.data);
      setSseMessage(event.data); // SSE 메시지를 상태로 저장
    };

    eventSource.onerror = () => {
      console.error("SSE connection failed. Closing connection.");
      eventSource.close(); // 오류 발생 시 SSE 연결 닫기
    };

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      eventSource.close();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", { email, password });
      localStorage.setItem("Authorization", response.data.token);
      navigate("/main");
    } catch (error) {
      alert("Login failed! Please check your email and password.");
    }
  };

  const googleLogin = () => {
    window.location.href =
        "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/redirect";
  };

  const naverLogin = () => {
    window.location.href =
        "http://localhost:8080/oauth2/authorization/naver?redirect_uri=http://localhost:3000/redirect";
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <div className="steam-logo">
            <svg
                className="steam-logo"
                viewBox="0 0 256 259"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill="#ffffff"
                  d="M116.5 0C52.15 0 0 52.15 0 116.5c0 64.35 52.15 116.5 116.5 116.5 64.35 0 116.5-52.15 116.5-116.5C233 52.15 180.85 0 116.5 0zm0 215.175c-54.405 0-98.675-44.27-98.675-98.675 0-54.405 44.27-98.675 98.675-98.675 54.405 0 98.675 44.27 98.675 98.675 0 54.405-44.27 98.675-98.675 98.675z"
              />
            </svg>
          </div>
          <div className="login-form">
            <div className="form-header">Playcation에 로그인</div>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                    type="text"
                    placeholder="Playcation 이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="input-group">
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <button type="submit" className="login-button">
                로그인
              </button>
            </form>
            <div className="help-links">
              <a href="https://help.steampowered.com/ko/">비밀번호를 잊으셨나요?</a>
              <a href="http://localhost:3000/sign-up">Playcation이 처음이신가요?</a>
            </div>
            <div className="social-login">
              <button onClick={googleLogin} className="google-btn">
                구글로 로그인
              </button>
              <button onClick={naverLogin} className="naver-btn">
                네이버로 로그인
              </button>
            </div>
            {sseMessage && <div className="sse-message">SSE: {sseMessage}</div>}
          </div>
        </div>
      </div>
  );
};

export default Login;
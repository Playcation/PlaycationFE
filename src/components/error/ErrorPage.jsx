import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = ({ status, errorName, message }) => {
  const navigate = useNavigate();

  return (
      <div className="error-page">
        <h1>오류 {status}</h1>
        <h2>{errorName}</h2>
        <p>{message}</p>
        <button onClick={() => navigate("/main")}>홈으로 돌아가기</button>
      </div>
  );
};

export default ErrorPage;

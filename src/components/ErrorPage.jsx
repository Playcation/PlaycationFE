import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = ({ status, message }) => {
  const navigate = useNavigate();

  return (
      <div className="error-page">
        <h1>Error {status}</h1>
        <p>{message}</p>
        <button onClick={() => navigate('/home')}>홈으로 돌아가기</button>
      </div>
  );
};

export default ErrorPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Check token and redirect to home if valid
    const token = localStorage.getItem('Authorization');
    if (token) {
      axios.post('http://localhost:8080/check/token', {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(response => {
        localStorage.setItem('Authorization', response.data.token);
        navigate('/home');
      })
      .catch(() => {
        console.error('Token validation failed');
        navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      }, { withCredentials: true });
      localStorage.setItem('Authorization', response.data.token);
      navigate('/home');
    } catch (error) {
      alert('Login failed!');
    }
  };

  const googleLogin = () => {
    window.location.href =
        'http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/redirect';
  };

  const naverLogin = () => {
    window.location.href =
        'http://localhost:8080/oauth2/authorization/naver?redirect_uri=http://localhost:3000/redirect';
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <div className="steam-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 233 233">
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
              {/*<div className="remember-me">*/}
              {/*  <input type="checkbox" id="remember" />*/}
              {/*  <label htmlFor="remember">로그인 정보 저장</label>*/}
              {/*</div>*/}
              <button type="submit" className="login-button">로그인</button>
            </form>

            <div className="help-links">
              <a href="https://help.steampowered.com/ko/">비밀번호를 잊으셨나요?</a>
              <a href="http://localhost:3000/sign-up">Playcation이 처음이신가요?</a>
            </div>

            <div className="social-login">
              <button onClick={googleLogin} className="google-btn">구글로 로그인</button>
              <button onClick={naverLogin} className="naver-btn">네이버로 로그인</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;

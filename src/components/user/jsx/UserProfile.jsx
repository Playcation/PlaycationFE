import React, { useState, useEffect } from 'react';
import axiosInstance from "../../api/api";
import '../css/UserProfile.css';
import {useNavigate} from "react-router-dom";
import ErrorPage from '../../error/ErrorPage';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('Authorization');
      if (!token) {
        setError('Authorization token is missing.');
        return;
      }

      try {
        const response = await axiosInstance.get('/users',
            {
        });

        setUser({
          username: response.data.username,
          filePath: response.data.filePath,
          email: response.data.email,
          description: response.data.description,
          updatedDate: response.data.updatedDate,
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile.');
      }
    };

    fetchUserProfile();
  }, []);

  const changeProfile = () => {
    // Add logic for changing profile here
    navigate('/user-update');
  };

  const daliyCheck = async () => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      setError('Authorization token is missing.');
      return;
    }
    try {
      const response = await axiosInstance.put('/users/attendance', null, {
      });
      console.log(response);
    } catch (error) {
      const errorData = error.response?.data || {};
      const status = errorData.httpStatus || error.response?.status || 500;
      const message = errorData.message || 'An unexpected error occurred.';

      console.error(`Error ${status}: ${message}`);
      setError({ status, message });
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return;

    try {
      await axiosInstance.post(
          "/logout",
          {},
          {
          }
      );
      localStorage.removeItem("Authorization");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const deleteUser = () =>{
    navigate("/user-delete");
  }

  const registerManager = () => {
    navigate("/register/manager");
  }

  if (error) {
    return <ErrorPage status={error.status} message={error.message} />;
  }

  const formattedJoinDate = user?.updatedDate
      ? new Date(user.updatedDate).toISOString().split('T')[0]
      : 'N/A';

  const payCheck = () => {
    navigate("/sandbox");
  }

  return (
      <div className="user-profile">
        {user ? (
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-background"></div>
                <div className="profile-summary">
                  <div className="avatar">
                    {user.filePath ? (
                        <img src={user.filePath} alt="프로필 아바타" />
                    ) : (
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
                    )}
                  </div>
                  <div className="profile-details">
                    <h1 className="profile-name">{user.username}</h1>
                    <div className="profile-info">
                      <span className="nickname">이메일: {user.email}</span>
                      <span className="status-message">
                    {user.description || '상태 메시지를 입력하세요'}
                  </span>

                    </div>
                    <div>
                      <button onClick={changeProfile}>프로필 변경</button>
                      <button onClick={daliyCheck}>일일 출석체크</button>
                      <button onClick={handleLogout}>로그 아웃</button>
                      <button onClick={deleteUser}>회원 탈퇴</button>
                      <button onClick={registerManager}>메니저 등록</button>
                    </div>
                    <button onClick={payCheck}>결제 확인 버튼</button>
                  </div>
                </div>
              </div>
            </div>
        ) : error ? (
            <div className="error">{error}</div>
        ) : (
            <div className="loading">Loading user profile...</div>
        )}
      </div>
  );
};

export default UserProfile;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import "../css/UserUpdate.css";

const UserDelete = () => {
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("Authorization");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await axiosInstance.post(
            "/check/token",
            {},
            {
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // },
              // withCredentials: true,
            }
        );

        const { username, description } = response.data;
        // 여기에 setUser 및 setUsername 로직 추가 가능
      } catch (error) {
        console.error("Token validation failed:", error);

        if (error.response && error.response.status === 401) {
          navigate("/refresh");
        } else {
          navigate("/");
        }
      }
    };

    checkToken();
  }, [navigate]);

  const changePassword = async () => {
    if (!password) {
      alert("모든 비밀번호 필드를 입력하세요.");
      return;
    }

    if (!window.confirm("비밀번호를 변경하시겠습니까?")) return;

    const token = localStorage.getItem("Authorization");

    try {
      const response = await axiosInstance.delete(
          "/users/delete", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
        data: { password }, // RequestBody에 password를 추가
        // withCredentials: true,
      });

      alert("회원 탈퇴가 되었습니다.");
      console.log(response.data);

      // 비밀번호 입력 필드 초기화
      setPassword("");

      if (!token) return;
      try {
        await axiosInstance.post(
            "/logout",
            {},
            {
              // headers: { Authorization: `Bearer ${token}` },
              // withCredentials: true,
            }
        );
        localStorage.removeItem("Authorization");
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to log out. Please try again.");
      }

    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호가 틀렸습니다. 다시 시도해 주세요.");
    }
  };

  const cancelChange = () => {
    if (window.confirm('정말 취소하시겠습니까?')) {
      setPassword(password || '');
      navigate('/profile');
    }
  }

  return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-background"></div>
          <div className="profile-summary">
            <div className="avatar">
              {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="프로필 아바타" />
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
          </div>
        </div>

        <div className="profile-content">
          <div className="edit-form">
            <h2>비밀번호 변경</h2>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={cancelChange}>
                취소
              </button>
              <button className="change-password-button"
                      onClick={changePassword}>
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserDelete;

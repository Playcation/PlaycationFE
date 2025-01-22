import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserUpdate.css";

const Home = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

        const response = await axios.post(
            "http://localhost:8080/check/token",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
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
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("모든 비밀번호 필드를 입력하세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!window.confirm("비밀번호를 변경하시겠습니까?")) return;

    const token = localStorage.getItem("Authorization");

    try {
      const response = await axios.patch(
          "http://localhost:8080/users/password",
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
      );

      alert("비밀번호가 성공적으로 변경되었습니다!");
      console.log(response.data);

      // 비밀번호 입력 필드 초기화
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (!token) return;
      try {
        await axios.post(
            "http://localhost:8080/logout",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
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
      alert("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const cancelChange = () => {
    if (window.confirm('정말 취소하시겠습니까?')) {
      setOldPassword(oldPassword || '');
      setNewPassword('');
      setConfirmPassword('');
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
              <label>현재 비밀번호</label>
              <input
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  className="form-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>새 비밀번호</label>
              <input
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={cancelChange}>
                취소
              </button>
              <button className="change-password-button"
                      onClick={changePassword}>
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import "../../game/css/CreateGamePage.css"

const RegisterManagerPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    termsAgreement: false,
  });

  const [gameImage, setGameImage] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const {name, value, type, checked, files} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setGameImage(selectedFile);
    } else {
      setGameImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAgreement) {
      alert("Playcation 개발자 이용약관에 동의해야 합니다.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append(
        'registManagerRequestDto',
        new Blob([JSON.stringify(formData)], {type: 'application/json'})
    );
    if (gameImage) submissionData.append('gameImage', gameImage);

    try {
      // console.log("FormData:", Array.from(formData.entries()));
      const response = await axiosInstance.post("/users/manager",
          submissionData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          });

      if (response.status >= 200 && response.status < 300) {
        // 데이터 처리
        alert("등업 신청 성공: " + response.data);
      } else {
        // 에러 메시지 처리
        alert("등업 신청 실패: " + response.data);
      }
      formData.title = '';
      formData.price = '';
      formData.description = '';
      formData.termsAgreement = false;
      navigate('/profile');
    } catch (error) {
      // 오류 처리
      console.error("Error:", error);

      if (error.response) {
        // 서버 응답에 따른 오류 처리
        alert("게임 등록 실패: " + error.response.data);
      } else {
        // 네트워크 오류 또는 기타 문제
        alert("서버에 문제가 발생했습니다.");
      }
    };
  }

  return (
      <div className="steam-container">
        <header className="steam-header">
          <h1 className="game-registration-form h1">메니저 설정</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-section">
              <label htmlFor="title">게임 제목</label>
              <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
              />
            </div>

            <div className="form-section">
              <label htmlFor="description">게임 설명</label>
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
              ></textarea>
            </div>

            <div className="form-section">
              <label htmlFor="price">가격 (KRW)</label>
              <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  required
              />
            </div>

            <div className="form-section">
              <label htmlFor="gameImage">대표 이미지</label>
              <input
                  type="file"
                  id="gameImage"
                  name="gameImage"
                  onChange={onFileChange}
                  accept="image/*"
                  required
              />
            </div>

            <div className="checkbox-section">
              <input
                  type="checkbox"
                  id="termsAgreement"
                  name="termsAgreement"
                  checked={formData.termsAgreement}
                  onChange={handleInputChange}
                  required
              />
              <label htmlFor="termsAgreement">Steam 개발자 이용약관에 동의합니다</label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">게임 등록</button>
              <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      gameTitle: "",
                      gameDescription: "",
                      gamePrice: "",
                      termsAgreement: false,
                    });
                    navigate("/profile");
                  }}
                  className="btn-cancel"
              >
                취소
              </button>
            </div>
          </form>
        </main>
        <footer className="steam-footer">
          <p>© 2023 Valve Corporation. All rights reserved.</p>
        </footer>
      </div>
  );
};

export default RegisterManagerPage;

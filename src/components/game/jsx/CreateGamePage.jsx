import React, { useState } from "react";
import axiosInstance from "../../api/api";
import {useNavigate} from "react-router-dom";


const CreateGamePage = () => {
  const [formData, setFormData] = useState({
    gameTitle: "",
    gameDescription: "",
    gameGenre: 1,
    gamePrice: "",
  });

  const [gameImage, setGameImage] = useState(null);
  const [subImage, setSubImage] = useState(null);
  const [gameFile, setGameFile] = useState(null);

  const navigate = useNavigate();

  const genres = [
    { value: 1, label: "액션" },
    { value: 2, label: "어드벤처" },
    { value: 3, label: "RPG" },
    { value: 4, label: "전략" },
    { value: 5, label: "시뮬레이션" }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const onGameImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setGameImage(selectedFile);
    } else {
      setGameImage(null);
    }
  };

  const onSubImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSubImage(selectedFile);
    } else {
      setSubImage(null);
    }
  };

  const onGameFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setGameFile(selectedFile);
    } else {
      setGameFile(null);
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
        'createGameRequestDto',
        new Blob([JSON.stringify(formData)], {type: 'application/json'})
    );
    if (gameImage) submissionData.append('gameImage', gameImage);
    if (subImage) submissionData.append('subImage', subImage);
    if (gameFile) submissionData.append('gameFile', gameFile);

    try {
      const response = await axiosInstance.post("/games",
        submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      if (response.status >= 200 && response.status < 300) {
        // 데이터 처리
        alert("게임 등록 성공: " + response.data);
      } else {
        // 에러 메시지 처리
        alert("게임 등록 실패: " + response.data);
      }
      // formData.title = '';
      // formData.price = '';
      // formData.description = '';
      // formData.termsAgreement = false;
      navigate('/profile');
    } catch (error) {
      console.error("Error:", error);
      alert("서버에 문제가 발생했습니다.");
    }
  };

  return (
      <div className="steam-container">
        <header className="steam-header">
          <h1 className="game-registration-form h1">Steam 게임 등록</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-section">
              <label htmlFor="gameTitle">게임 제목</label>
              <input
                  type="text"
                  id="gameTitle"
                  name="gameTitle"
                  value={formData.gameTitle}
                  onChange={handleInputChange}
                  required
              />
            </div>

            <div className="form-section">
              <label htmlFor="gameDescription">게임 설명</label>
              <textarea
                  id="gameDescription"
                  name="gameDescription"
                  value={formData.gameDescription}
                  onChange={handleInputChange}
                  rows="4"
                  required
              ></textarea>
            </div>

            <div className="form-section">
              <label htmlFor="gameGenre">장르</label>
              <select
                  id="gameGenre"
                  name="gameGenre"
                  value={formData.gameGenre}
                  onChange={handleInputChange}
                  required
              >
                <option value="">장르 선택</option>
                {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="gamePrice">가격 (KRW)</label>
              <input
                  type="number"
                  id="gamePrice"
                  name="gamePrice"
                  value={formData.gamePrice}
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
                  onChange={handleInputChange}
                  accept="image/*"
                  required
              />
            </div>

            <div className="form-section">
              <label htmlFor="gameImage">서브 이미지</label>
              <input
                  type="file"
                  id="subImage"
                  name="subImage"
                  onChange={onSubImageChange}
                  accept="image/*"
              />
            </div>

            <div className="form-section">
              <label htmlFor="gameImage">게임 파일</label>
              <input
                  type="file"
                  id="gameFile"
                  name="gameFile"
                  onChange={onGameFileChange}
                  accept="application/zip"
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
              <label htmlFor="termsAgreement">Playcation 개발자 이용약관에 동의합니다</label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">게임 등록</button>
              <button
                  type="button"
                  onClick={() =>
                      setFormData({
                        gameTitle: "",
                        gameDescription: "",
                        gameGenre: "",
                        gamePrice: "",
                        systemRequirements: "",
                        termsAgreement: false,
                        gameImage: null,
                      })
                  }
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

export default CreateGamePage;

import React, { useState } from "react";

const RegisterManagerPage = () => {
  const [formData, setFormData] = useState({
    gameTitle: "",
    gameDescription: "",
    gameGenre: "",
    gamePrice: "",
    termsAgreement: false,
    gameImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAgreement) {
      alert("Playcation 개발자 이용약관에 동의해야 합니다.");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "termsAgreement") return;
      submissionData.append(key, formData[key]);
    });

    try {
      const response = await fetch("/manager", {
        method: "POST",
        headers: {
          Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with actual token
        },
        body: submissionData,
      });

      if (response.ok) {
        const result = await response.text();
        alert("게임 등록 성공: " + result);
      } else {
        const error = await response.text();
        alert("게임 등록 실패: " + error);
      }
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
                <option value="action">액션</option>
                <option value="adventure">어드벤처</option>
                <option value="rpg">RPG</option>
                <option value="strategy">전략</option>
                <option value="simulation">시뮬레이션</option>
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
              <label htmlFor="systemRequirements">시스템 요구 사항</label>
              <textarea
                  id="systemRequirements"
                  name="systemRequirements"
                  value={formData.systemRequirements}
                  onChange={handleInputChange}
                  rows="4"
                  required
              ></textarea>
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

export default RegisterManagerPage;

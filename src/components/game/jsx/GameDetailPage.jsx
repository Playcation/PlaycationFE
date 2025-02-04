import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import axiosInstance from "../../api/api";
import "../css/GameDetailPage.css"; // CSS 파일 연결

const SteamGameDetails = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  const { gameId } = useParams(); // URL에서 게임 ID 가져오기
  const [game, setGame] = useState(null); // 게임 데이터 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [mainImage, setMainImage] = useState(""); // 대표 이미지
  const [thumbnails, setThumbnails] = useState([]); // 썸네일 이미지 리스트

  // 🎯 API 요청: 게임 데이터를 백엔드에서 가져오기
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axiosInstance.get(`/games/${gameId}`);
        const gameData = response.data;

        setGame(gameData); // 게임 정보 저장
        setMainImage(gameData.mainImagePath); // 대표 이미지 설정
        setThumbnails(gameData.subImagePath || []); // 썸네일 목록 저장
        setLoading(false);
      } catch (err) {
        console.error("게임 정보를 불러오는 중 오류 발생:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]); // gameId가 변경될 때마다 다시 불러오기

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;
  if (!game) return <p>게임 정보를 찾을 수 없습니다.</p>;

  return (
      <div className="steam-page">
        {/* 헤더 */}
        <header className="header">
          <nav className="nav">
            <div className="steam-logo">
              <img alt="Steam Logo" className="logo-img" />
            </div>
            <div className="nav-menu">
              <button onClick={() => navigate("/main")}>스토어</button>
              <button onClick={() => navigate("/community")}>커뮤니티</button>
              <button onClick={() => navigate("/info")}>정보</button>
            </div>
          </nav>
        </header>

        {/* 메인 섹션 */}
        <main className="main-content">
          <section className="game-hero">
            {/* 갤러리 */}
            <div className="game-gallery">
              <div className="gallery-container">
                <div className="main-image">
                  <img src={mainImage} alt={game.title} />
                </div>
                <div className="thumbnail-gallery">
                  {thumbnails.map((thumb, index) => (
                      <div
                          key={index}
                          className={`thumbnail ${mainImage === thumb ? "active" : ""}`}
                          onClick={() => setMainImage(thumb)}
                      >
                        <img src={thumb} alt={`Thumbnail ${index + 1}`} />
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 게임 설명 */}
            <div className="game-summary">
              <h1>{game.title}</h1>
              <div className="game-tags">
                <span className="tag">멀티플레이어</span>
                <span className="tag">RTS</span>
                <span className="tag">전략</span>
              </div>
              <div className="game-price">₩{game.price.toLocaleString()}</div>

              {/* 페이지 이동 버튼 */}
              <button className="install-btn" onClick={() => navigate("/purchase")}>
                스토어에서 구매하기
              </button>
            </div>
          </section>

          {/* 상세 정보 */}
          <section className="game-details">
            <div className="description">
              <h2>게임 정보</h2>
              <p>{game.description}</p>
            </div>

          </section>
        </main>
      </div>
  );
};

export default SteamGameDetails;

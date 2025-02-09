import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../api/api"; // axiosInstance 파일 경로에 맞게 수정하세요.
import "./styles.css";

const Review = () => {
  const { gameId } = useParams(); // URL에서 gameId 추출
  const routerLocation = useLocation(); // location 객체 (전역 변수와 혼동되지 않도록 routerLocation으로 사용)
  // 부모(예: SteamGameDetails)에서 전달받은 gameTitle (필요시 사용)
  const { gameTitle } = routerLocation.state || {};

  // === 리뷰 생성 관련 상태 ===
  const [isModalOpen, setIsModalOpen] = useState(false); // 리뷰 작성 모달 열림 여부
  const [newReviewText, setNewReviewText] = useState(""); // 새 리뷰 텍스트
  const [isRecommended, setIsRecommended] = useState(null); // true: 긍정, false: 부정, null: 미선택

  // === 리뷰 수정 관련 상태 ===
  const [editingReview, setEditingReview] = useState(null); // 수정 대상 리뷰 객체
  const [editReviewText, setEditReviewText] = useState(""); // 수정 모달에서의 텍스트
  const [editIsRecommended, setEditIsRecommended] = useState(null); // 수정 모달에서의 추천 여부

  // === 전체 리뷰 목록 상태 ===
  const [reviews, setReviews] = useState([]);

  // 리뷰 목록 불러오기 (GET /games/{gameId}/reviews?page=0&size=5)
  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}/reviews`, {
        params: { page: 0, size: 5 },
      });
      setReviews(response.data.list || []);
    } catch (error) {
      console.error("리뷰 목록 불러오기 실패:", error.response || error);
      alert("리뷰 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (gameId) fetchReviews();
  }, [gameId]);

  const handleNewReviewTextChange = (e) => setNewReviewText(e.target.value);

  const handleRecommendClick = () => {
    if (isRecommended === true) {
      setIsRecommended(null);
    } else if (isRecommended === null) {
      setIsRecommended(true);
    }
  };

  const handleNotRecommendClick = () => {
    if (isRecommended === false) {
      setIsRecommended(null);
    } else if (isRecommended === null) {
      setIsRecommended(false);
    }
  };

  // === 리뷰 생성 관련 핸들러 ===
  const handleSubmitReview = async () => {
    if (newReviewText.trim().length < 10) {
      alert("리뷰는 최소 10자 이상 작성해주세요.");
      return;
    }
    if (isRecommended === null) {
      alert("긍정적 또는 부정적 중 한 개를 선택해주세요.");
      return;
    }
    const rating = isRecommended ? "POSITIVE" : "NEGATIVE";
    const payload = {
      content: newReviewText,
      rating: rating,
    };

    try {
      await axiosInstance.post(`/games/${gameId}/reviews`, payload);
      alert("리뷰가 생성되었습니다.");
      setNewReviewText("");
      setIsRecommended(null);
      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 오류:", error.response || error);
      alert("리뷰 생성에 실패하였습니다.");
    }
  };

  // === 리뷰 수정 관련 핸들러 ===
  const openEditModal = (review) => {
    // 수정 모달을 열 때, 수정 대상 리뷰 객체와 기존 내용을 상태에 저장합니다.
    console.log("openEditModal 호출, review:", review); // 디버깅 로그
    setEditingReview(review);
    setEditReviewText(review.content);
    setEditIsRecommended(review.rating === "POSITIVE" ? true : false);
  };

  const handleEditReviewTextChange = (e) => setEditReviewText(e.target.value);

  const handleEditRecommendClick = () => {
    if (editIsRecommended === true) {
      setEditIsRecommended(null);
    } else if (editIsRecommended === null) {
      setEditIsRecommended(true);
    }
  };

  const handleEditNotRecommendClick = () => {
    if (editIsRecommended === false) {
      setEditIsRecommended(null);
    } else if (editIsRecommended === null) {
      setEditIsRecommended(false);
    }
  };

  const handleUpdateReview = async () => {
    // 디버깅 로그: 수정 요청 전 상태 확인
    console.log("수정 요청 전, editingReview:", editingReview);
    console.log("수정 텍스트:", editReviewText);
    if (editReviewText.trim().length < 10) {
      alert("리뷰는 최소 10자 이상 작성해주세요.");
      return;
    }
    if (editIsRecommended === null) {
      alert("긍정적 또는 부정적 중 한 개를 선택해주세요.");
      return;
    }
    const rating = editIsRecommended ? "POSITIVE" : "NEGATIVE";
    const payload = {
      content: editReviewText,
      rating: rating,
    };
    console.log("PATCH 요청 payload:", payload); // 디버깅 로그

    try {
      // 백엔드 API에서 수정 대상 리뷰의 식별자가 review.reviewId로 온다고 가정합니다.
      await axiosInstance.patch(
          `/games/${gameId}/reviews/${editingReview.reviewId}`,
          payload
      );
      alert("리뷰가 수정되었습니다.");
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error("리뷰 수정 오류:", error.response || error);
      alert("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  // === 리뷰 삭제 핸들러 ===
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 리뷰를 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/games/${gameId}/reviews/${reviewId}`);
      alert("리뷰가 삭제되었습니다.");
      fetchReviews();
    } catch (error) {
      console.error("리뷰 삭제 오류:", error.response || error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  // === 좋아요 토글 핸들러 ===
  const handleToggleLike = async (reviewId) => {
    const reviewIndex = reviews.findIndex((r) => r.reviewId === reviewId);
    if (reviewIndex === -1) return;
    const review = reviews[reviewIndex];

    // 본인이 작성한 리뷰에는 좋아요를 누를 수 없음
    if (review.isMine) {
      alert("자신이 작성한 리뷰에는 좋아요를 누를 수 없습니다.");
      return;
    }

    try {
      if (review.likedByCurrentUser) {
        // 좋아요 취소
        await axiosInstance.delete(`/reviews/${reviewId}/likes`);
        const updatedReview = {
          ...review,
          likeCount: review.likeCount - 1,
          likedByCurrentUser: false,
        };
        setReviews([
          ...reviews.slice(0, reviewIndex),
          updatedReview,
          ...reviews.slice(reviewIndex + 1),
        ]);
      } else {
        // 좋아요 추가
        await axiosInstance.post(`/reviews/${reviewId}/likes`);
        const updatedReview = {
          ...review,
          likeCount: review.likeCount + 1,
          likedByCurrentUser: true,
        };
        setReviews([
          ...reviews.slice(0, reviewIndex),
          updatedReview,
          ...reviews.slice(reviewIndex + 1),
        ]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage && errorMessage.includes("이미 좋아요를 누른 리뷰입니다.")) {
        try {
          await axiosInstance.delete(`/reviews/${reviewId}/likes`);
          const updatedReview = {
            ...review,
            likeCount: review.likeCount - 1,
            likedByCurrentUser: false,
          };
          setReviews([
            ...reviews.slice(0, reviewIndex),
            updatedReview,
            ...reviews.slice(reviewIndex + 1),
          ]);
        } catch (deleteError) {
          console.error("좋아요 취소 오류:", deleteError.response || deleteError);
          alert("좋아요 취소 중 오류가 발생했습니다.");
        }
      } else {
        console.error("좋아요 토글 오류:", error.response || error);
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
      <div className="container">
        <header>
          <h1>Playcation</h1>
        </header>
        <main className="game-review-page">
          <section className="game-header">
            <div className="game-banner">
              <img src="stardew-banner.jpg" alt="스타듀 밸리 배너" />
            </div>
            <div className="game-overview">
              <div className="game-thumbnail">
                <img src="stardew-thumbnail.jpg" alt="스타듀 밸리 썸네일" />
              </div>
              <div className="game-details">
                {/* 부모에서 전달된 gameTitle 대신, 만약 gameTitle이 없다면 "게임 제목 없음" 출력 */}
                <h2>{gameTitle ? gameTitle : "게임 제목 없음"}</h2>
                <div className="game-meta">
                  <span className="genre">시뮬레이션, RPG</span>
                  <span className="developer">ConcernedApe</span>
                  <span className="release-date">2016년 2월 26일</span>
                </div>
              </div>
            </div>
          </section>
          <section className="review-section">
            <div className="review-controls">
              <button id="write-review-btn" onClick={() => setIsModalOpen(true)}>
                리뷰 작성
              </button>
              <select id="review-filter">
                <option>최근 리뷰</option>
                <option>긍정적 리뷰</option>
                <option>부정적 리뷰</option>
              </select>
            </div>
            {/* 리뷰 작성 모달 */}
            {isModalOpen && (
                <div className="review-modal" style={{ display: "flex" }}>
                  <div className="modal-content">
                    <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                      X
                    </button>
                    <h2>리뷰 작성</h2>
                    <textarea
                        id="review-text"
                        value={newReviewText}
                        onChange={handleNewReviewTextChange}
                        placeholder="리뷰를 작성하세요"
                    />
                    <div>
                      <button
                          className={`recommend-btn ${isRecommended === true ? "active" : ""}`}
                          onClick={handleRecommendClick}
                      >
                        긍정적
                      </button>
                      <button
                          className={`not-recommend-btn ${isRecommended === false ? "active" : ""}`}
                          onClick={handleNotRecommendClick}
                      >
                        부정적
                      </button>
                    </div>
                    <button id="submit-review" onClick={handleSubmitReview}>
                      리뷰 제출
                    </button>
                  </div>
                </div>
            )}
            {/* 리뷰 수정 모달 */}
            {editingReview && (
                <div className="review-modal" style={{ display: "flex" }}>
                  <div className="modal-content">
                    <button className="close-modal" onClick={() => setEditingReview(null)}>
                      X
                    </button>
                    <h2>리뷰 수정</h2>
                    <textarea
                        id="edit-review-text"
                        value={editReviewText}
                        onChange={handleEditReviewTextChange}
                        placeholder="리뷰를 수정하세요"
                    />
                    <div>
                      <button
                          className={`recommend-btn ${editIsRecommended === true ? "active" : ""}`}
                          onClick={handleEditRecommendClick}
                      >
                        긍정적
                      </button>
                      <button
                          className={`not-recommend-btn ${editIsRecommended === false ? "active" : ""}`}
                          onClick={handleEditNotRecommendClick}
                      >
                        부정적
                      </button>
                    </div>
                    <button id="update-review" onClick={handleUpdateReview}>
                      리뷰 수정 제출
                    </button>
                  </div>
                </div>
            )}
            {/* 리뷰 목록 */}
            <div className="review-list">
              {reviews.map((review) => (
                  <div
                      className={`review-card ${review.rating === "POSITIVE" ? "recommended" : "not-recommended"}`}
                      key={review.reviewId}
                  >
                    <div className="review-header">
                      <img
                          src={review.avatar || "user-avatar.jpg"}
                          alt="사용자 아바타"
                      />
                      <div className="user-info">
                        <h4 className="user-nickname">
                          {review.nickname ? review.nickname : "작성자 정보 없음"}
                        </h4>
                        <span className="recommendation">
                      {review.rating === "POSITIVE" ? "긍정적" : "부정적"}
                    </span>
                      </div>
                    </div>
                    <div className="review-content">
                      <p>{review.content}</p>
                    </div>
                    <div className="review-footer">
                      <div className="review-actions">
                        <button
                            className={`helpful-btn ${review.likedByCurrentUser ? "liked" : ""}`}
                            onClick={() => handleToggleLike(review.reviewId)}
                        >
                          👍 좋아요 ({review.likeCount})
                        </button>
                        <button className="helpful-btn" onClick={() => openEditModal(review)}>
                          수정
                        </button>
                        <button
                            className="helpful-btn"
                            onClick={() => handleDeleteReview(review.reviewId)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </section>
        </main>
        <footer>
          <p>© 2025 게임 리뷰 플랫폼</p>
        </footer>
      </div>
  );
};

export default Review;
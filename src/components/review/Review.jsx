import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../api/api";  // axiosInstance 경로에 맞게 수정
import NavPage from "../NavPage";
import { PageDiv } from "../main/Main"; // PageDiv 경로에 맞게 수정
import "./styles.css";
import playcationLogo from "../../assets/images/playcationLogo.png";


const Review = () => {
  const { gameId } = useParams();
  const routerLocation = useLocation();
  const { gameTitle } = routerLocation.state || {};

  // === 페이징/필터 관련 상태 ===
  const [page, setPage] = useState(1);  // 현재 페이지 (1-based)
  const [pageSize] = useState(5); // 한 페이지에 보여줄 리뷰 수
  const [totalReviews, setTotalReviews] = useState(0); // 전체 리뷰 개수
  const [ratingFilter, setRatingFilter] = useState("");

  // === 리뷰 생성 관련 상태 ===
  const [isModalOpen, setIsModalOpen] = useState(false); // 리뷰 작성 모달 열림 여부
  const [newReviewText, setNewReviewText] = useState("");
  const [isRecommended, setIsRecommended] = useState(null); // true: 긍정, false: 부정, null: 미선택

  // === 리뷰 수정 관련 상태 ===
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editIsRecommended, setEditIsRecommended] = useState(null);

  // === 전체 리뷰 목록 ===
  const [reviews, setReviews] = useState([]);

  // === 게임 정보 ===
  const [gameInfo, setGameInfo] = useState({
    title: gameTitle || "게임 제목 없음",
    mainImage: "",
    subImages: "",
  });

  // 게임 상세 정보 가져오기
  const fetchGameInfo = async () => {
    try {
      const response = await axiosInstance.get(`/games/${gameId}`);
      setGameInfo({
        title: response.data.title,
        mainImage: response.data.mainImagePath || playcationLogo,
        subImages: response.data.subImagesPath || playcationLogo,
      });
    } catch (error) {
      console.error("게임 상세 정보 불러오기 실패:", error);
    }
  };

  // 리뷰 목록 가져오기 (페이지네이션)
  const fetchReviews = async () => {
    try {
      // 백엔드가 0-based page를 요구한다고 가정
      const response = await axiosInstance.get(`/games/${gameId}/reviews`, {
        params: {
          page: page - 1,  // 현재 페이지가 1이면 백엔드는 0
          size: pageSize,
          rating: ratingFilter || null,
          // ratingFilter가 ""이면 null
          // ratingFilter가 "POSITIVE"이면 긍정적 리뷰만, "NEGATIVE"면 부정적 리뷰만
        },
      });
      const data = response.data;
      setReviews(response.data.list || []);
      setTotalReviews(data.count || 0);
    } catch (error) {
      console.error("리뷰 목록 불러오기 실패:", error.response || error);
      alert("리뷰 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGameInfo();
      fetchReviews();
    }
    // page 가 바뀔 때마다 fetchReviews 재호출
  }, [gameId, page, ratingFilter]);


  // PageDiv에서 페이지 번호가 바뀔 때
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleNewReviewTextChange = (e) => setNewReviewText(e.target.value);

  const handleRecommendClick = () => {
    // [positve] <-> [not selected]
    if (isRecommended === true) {
      setIsRecommended(null);
    } else if (isRecommended === null) {
      setIsRecommended(true);
    }
  };

  const handleNotRecommendClick = () => {
    // [negative] <-> [not selected]
    if (isRecommended === false) {
      setIsRecommended(null);
    } else if (isRecommended === null) {
      setIsRecommended(false);
    }
  };

  // 리뷰 수정 모달
  const openEditModal = (review) => {
    setEditingReview(review);
    setEditReviewText(review.content);
    setEditIsRecommended(review.rating === "POSITIVE");
  };

  const handleEditReviewTextChange = (e) => {
    setEditReviewText(e.target.value);
  };

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

  // 리뷰 생성
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
      rating,
    };

    try {
      await axiosInstance.post(`/games/${gameId}/reviews`, payload);
      alert("리뷰가 생성되었습니다.");

      // 모달 닫고 초기화
      setNewReviewText("");
      setIsRecommended(null);
      setIsModalOpen(false);

      // 리뷰 목록 재조회 (페이지 새로고침)
      fetchReviews();
    } catch (error) {
      console.error("리뷰 생성 오류:", error.response || error);
      alert("리뷰 생성에 실패하였습니다.");
    }
  };

  // 리뷰 수정
  const handleUpdateReview = async () => {
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
      rating,
    };

    try {
      await axiosInstance.patch(
          `/games/${gameId}/reviews/${editingReview.reviewId}`,
          payload
      );
      alert("리뷰가 수정되었습니다.");

      // 프론트 상태 갱신 (리뷰 목록 다시 불러오거나, 해당 항목만 변경)
      setReviews((prev) =>
          prev.map((r) =>
              r.reviewId === editingReview.reviewId
                  ? { ...r, content: editReviewText, rating }
                  : r
          )
      );

      // 모달 닫기
      setEditingReview(null);
    } catch (error) {
      console.error("리뷰 수정 오류:", error.response || error);
      alert("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 리뷰를 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/games/${gameId}/reviews/${reviewId}`);
      alert("리뷰가 삭제되었습니다.");
      // 삭제 후 재조회
      fetchReviews();
    } catch (error) {
      console.error("리뷰 삭제 오류:", error.response || error);
      alert("본인이 작성한 리뷰만 삭제 가능합니다.");
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (reviewId) => {
    const reviewIndex = reviews.findIndex((r) => r.reviewId === reviewId);
    if (reviewIndex === -1) return;
    const review = reviews[reviewIndex];

    // 본인이 작성한 리뷰는 좋아요 불가
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
        // 이미 좋아요 상태라고 한다면, 한 번 더 취소 요청
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

  // 필터 변경 시 (select onChange 핸들러)
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;

    // 예: "POSITIVE", "NEGATIVE", ""(최근리뷰)
    setRatingFilter(selectedValue);

    // 필터 바꾸면 1페이지로 돌아가기
    setPage(1);
  };

  return (
      <>
      <NavPage/>
      <div className="container">
        <main className="game-review-page">
          <section className="game-header">
            <div className="game-overview">
              <div className="game-thumbnail">
                <img
                    src={gameInfo.mainImage || "default-thumbnail.jpg"}
                    alt={gameInfo.title}
                />
              </div>
              <div className="game-details">
                <h2>{gameInfo.title}</h2>
              </div>
            </div>
          </section>

          <section className="review-section">
            <div className="review-controls">
              <button id="write-review-btn" onClick={() => setIsModalOpen(true)}>
                리뷰 작성
              </button>
              {/* 필터 Select */}
              <select id="review-filter" onChange={handleFilterChange}>
                <option value="">최근 리뷰</option>
                <option value="POSITIVE">긍정적 리뷰</option>
                <option value="NEGATIVE">부정적 리뷰</option>
              </select>
            </div>

            {/* 리뷰 작성 모달 */}
            {isModalOpen && (
                <div className="review-modal" style={{ display: "flex" }}>
                  <div className="modal-content">
                    <button
                        className="close-modal"
                        onClick={() => setIsModalOpen(false)}
                    >
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
                    <button
                        className="close-modal"
                        onClick={() => setEditingReview(null)}
                    >
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
                      className={`review-card ${
                          review.rating === "POSITIVE" ? "recommended"
                              : "not-recommended"
                      }`}
                      key={review.reviewId}
                  >
                    <div className="review-header">
                      {/* 만약 이미지(아바타)가 있으면 표시, 없으면 기본 네모 등 */}
                      {/* 원형 대신 네모로 하고 싶으면 .review-header-img 에 radius 제거 */}
                      <img
                          className="review-header-img"
                          src={review.userImage || playcationLogo}
                          alt="유저 아바타"
                      />
                      <div className="user-info">
                        <h4 className="user-nickname">
                          {review.userName || "작성자 정보 없음"}
                        </h4>
                        <span className="recommendation">
                      {review.rating === "POSITIVE" ? "긍정적" : "부정적"}
                    </span>
                      </div>
                    </div>
                    <hr className="hr-1"/>
                    <div className="review-content">
                      <p>{review.content}</p>
                    </div>
                    <div className="review-footer">
                      <div className="review-actions">
                        <button
                            className={`helpful-btn ${review.likedByCurrentUser
                                ? "liked" : ""}`}
                            onClick={() => handleToggleLike(review.reviewId)}
                        >
                          👍 좋아요 ({review.likeCount})
                        </button>
                        <button className="helpful-btn"
                                onClick={() => openEditModal(review)}>
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

            {/* 페이지네이션 */}
            <PageDiv
                count={totalReviews}   // 전체 리뷰 개수
                length={pageSize}      // 한 페이지에 보여줄 리뷰 수
                onPageChange={handlePageChange}
            />
          </section>
        </main>

        <footer>
          <p>© 게임 리뷰 플랫폼</p>
        </footer>
      </div>
        </>
  );
};

export default Review;
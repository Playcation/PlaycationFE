import React, {useState} from "react";
import "./EventAdminPage.css"; // 기존 CSS 유지
import axiosInstance from "../api/api";

const EventAdminPage = () => {
  // 현재 활성화된 탭 관리 (기본값: events)
  const [activeTab, setActiveTab] = useState("events");

  // 이벤트 생성 폼 상태 관리
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
  });

  // 쿠폰 생성 폼 상태 관리
  const [couponData, setCouponData] = useState({
    name: "",
    stock: "",
    rate: "",
    couponType: "PERCENT",
    validDays: "",
    eventId: "",
  });
// 쿠폰 발급할 때 사용할 쿠폰 ID 상태 추가
  const [couponId, setCouponId] = useState("");
  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 이벤트 생성 폼 제출 핸들러
  const handleEventSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/events', {
        title: eventData.title,
        description: eventData.description,
      });

      alert(`이벤트 생성 성공! ID: ${response.data.id}`);

      // 폼 초기화
      setEventData({title: "", description: ""});
    } catch (error) {
      console.error("이벤트 생성 실패:", error);
      alert("이벤트 생성에 실패했습니다.");
    }
  };

  // 쿠폰 생성 폼 제출 핸들러
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admin/coupons/lock', {
        name: couponData.name,
        stock: Number(couponData.stock),
        rate: Number(couponData.rate).toFixed(2),
        couponType: couponData.couponType,
        validDays: Number(couponData.validDays),
        eventId: Number(couponData.eventId),
      });
      console.log("✅ 쿠폰 생성 성공! 응답 데이터:", response.data);
      alert('쿠폰 생성 성공!');
      setCouponData({
        name: "",
        stock: "",
        rate: "",
        couponType: "PERCENT",
        validDays: "",
        eventId: "",
      });
      console.log("🔄 초기화된 쿠폰 데이터:", couponData);
    } catch (error) {
      console.error("쿠폰 생성 실패:", error);
      alert("쿠폰 생성에 실패했습니다.");
    }
  };
  const handleCouponIssue = async () => {
    if (!couponId) {
      alert("쿠폰 ID를 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.post(`/admin/coupons/lockpublish/${couponId}`);
      alert("쿠폰이 발급되었습니다!");
      setCouponId(""); // 입력 필드 초기화
    } catch (error) {
      console.error("쿠폰 발급 실패:", error);
      alert("쿠폰 발급에 실패했습니다.");
    }
  };
  return (
      <div className="admin-container">
        {/* 네비게이션 바 */}
        <nav className="admin-nav">
          <div className="nav-logo">
            <i className="fas fa-cogs"></i>
            <span>관리자 대시보드</span>
          </div>
          <div className="nav-menu">
            <button
                className={`nav-btn ${activeTab === "events" ? "active" : ""}`}
                onClick={() => handleTabChange("events")}
            >
              <i className="fas fa-calendar-alt"></i> 이벤트 관리
            </button>
            <button
                className={`nav-btn ${activeTab === "coupons" ? "active" : ""}`}
                onClick={() => handleTabChange("coupons")}
            >
              <i className="fas fa-ticket-alt"></i> 쿠폰 생성
            </button>
            <button
                className={`nav-btn ${activeTab === "issued" ? "active" : ""}`}
                onClick={() => handleTabChange("issued")}
            >
              <i className="fas fa-receipt"></i> 쿠폰 발급
            </button>
          </div>
        </nav>

        {/* 메인 컨텐츠 */}
        <main className="admin-main">
          {/* 이벤트 관리 탭 */}
          {activeTab === "events" && (
              <section id="events" className="admin-tab active">
                <h2>이벤트 생성</h2>
                <form onSubmit={handleEventSubmit}>
                  <div className="form-group">
                    <label htmlFor="event-title">이벤트 제목</label>
                    <input
                        type="text"
                        id="event-title"
                        value={eventData.title}
                        onChange={(e) =>
                            setEventData({...eventData, title: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-description">이벤트 설명</label>
                    <textarea
                        id="event-description"
                        value={eventData.description}
                        onChange={(e) =>
                            setEventData(
                                {...eventData, description: e.target.value})
                        }
                        required
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    이벤트 생성
                  </button>
                </form>
              </section>
          )}

          {/* 쿠폰 관리 탭 */}
          {activeTab === "coupons" && (
              <section id="coupons" className="admin-tab active">
                <h2>쿠폰 관리</h2>
                <form onSubmit={handleCouponSubmit}>
                  <div className="form-group">
                    <label htmlFor="coupon-name">쿠폰 이름</label>
                    <input
                        type="text"
                        id="coupon-name"
                        value={couponData.name}
                        onChange={(e) =>
                            setCouponData({...couponData, name: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coupon-stock">재고량</label>
                    <input
                        type="number"
                        id="coupon-stock"
                        value={couponData.stock}
                        onChange={(e) =>
                            setCouponData(
                                {...couponData, stock: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coupon-event">이벤트 ID</label>
                    <input
                        type="text"
                        id="coupon-event"
                        value={couponData.eventId}
                        onChange={(e) =>
                            setCouponData(
                                {...couponData, eventId: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coupon-type">쿠폰 유형</label>
                    <select
                        id="coupon-type"
                        value={couponData.couponType || "PERCENT"}
                        onChange={(e) =>
                            setCouponData(
                                {...couponData, couponType: e.target.value})
                        }
                        required
                    >
                      <option value="PERCENT">퍼센트 할인</option>
                      <option value="WON">고정 금액 할인</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="coupon-rate">할인율/금액</label>
                    <input
                        type="number"
                        id="coupon-rate"
                        value={couponData.rate}
                        onChange={(e) =>
                            setCouponData({...couponData, rate: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coupon-valid-days">유효 기간</label>
                    <input
                        type="number"
                        id="coupon-valid-days"
                        value={couponData.validDays}
                        onChange={(e) =>
                            setCouponData(
                                {...couponData, validDays: e.target.value})
                        }
                        required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="submit-btn">쿠폰 생성</button>
                  </div>
                </form>
              </section>
          )}
          {/* Issued Coupons Tab */}
          {activeTab === "issued" && (
              <section id="issued" className="admin-tab active">
                <h2>쿠폰 발급</h2>
                <div className="form-group">
                  <label htmlFor="coupon-id">쿠폰 ID</label>
                  <input
                      type="text"
                      id="coupon-id"
                      value={couponId}
                      onChange={(e) => setCouponId(e.target.value)}
                      required
                  />
                </div>
                <button type="button" className="submit-btn"
                        onClick={handleCouponIssue}>쿠폰 발급
                </button>
              </section>
          )}
        </main>
      </div>
  );
};

export default EventAdminPage;
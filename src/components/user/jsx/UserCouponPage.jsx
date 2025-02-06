import React, { useEffect, useState } from 'react';
import axiosInstance from "../../api/api";
import '../css/UserCouponPage.css';
import NavPage from '../../NavPage';

const UserCouponPage = () => {
  const [couponUsers, setCouponUsers] = useState([]); // 쿠폰 목록 상태
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const fetchCouponUsers = async () => {
      try {
        const token = localStorage.getItem('Authorization'); // JWT 토큰 가져오기
        if (!token) {
          return;
        }

        // API 요청
        const response = await axiosInstance.get('/user/coupons', {
          params: {
            page: page, // 현재 페이지
            size: size, // 한 페이지에 보여줄 개수
          },
        });

        setCouponUsers(response.data.list); // API 응답 데이터 저장
      } catch (err) {
        setError("쿠폰을 불러오는 데 실패했습니다: " + err.message);
      }
    };

    fetchCouponUsers();
  }, [page, size]); // 페이지 또는 크기 변경 시 API 다시 요청

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <NavPage />
      <div className="steam-container">
        <header className="steam-header">
          <div className="steam-logo">쿠폰함</div>
        </header>

        <main className="coupon-grid">
          {couponUsers.length > 0 ? (
            couponUsers.map((couponUser, index) => (
              <div className="coupon-card" key={index}>
                <div className="coupon-header">
                  <h3>{couponUser.eventTitle}</h3>
                </div>
                <div className="coupon-body">
                  <p className="gameName">{couponUser.name}</p>
                  <p className="rate">
                    {couponUser.couponType === "PERCENT"
                      ? `${couponUser.rate}% 할인 쿠폰`
                      : `${couponUser.rate.toLocaleString()}원 할인 쿠폰`}
                  </p>
                  <div className="coupon-details">
                    <span>발급일: {couponUser.issuedDate}</span>
                    <span>만료일: {couponUser.expiredDate}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-coupons">사용 가능한 쿠폰이 없습니다.</p>
          )}
        </main>
      </div>
    </>
  );
};

export default UserCouponPage;
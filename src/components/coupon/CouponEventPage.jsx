import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from "../api/api";
import {Pagination} from '@mui/material';
import Stack from '@mui/material/Stack';
import './CouponEventPage.css'

/**
 * 단일 배너
 *
 * @param {*} props 제목
 */
const Banner = ({title, eventId}) => {
  const navigate = useNavigate();

  const couponDetail = () => {
    navigate('/events/${eventId}');
  }

  return (
      <a href=''>
        <div className="banner active">
          <h2>{title}</h2>
        </div>
      </a>
  )

}

/**
 * header 태그 이벤트 배너 목록
 *
 * @param {*} props 이벤트 목록?
 */
const Header = ({id}) => {
  const [event, setEvent] = useState(null);

  // TODO: 이벤트 목록 DB로 뽑을지 fix할지 상의

  // const bannerList = [];
  // for (let i = 0; i < props.topics.length; i++) {
  //     bannerList.push(<Banner key={i} title={props.topics[i]}></Banner>)
  // }
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Assuming you want to fetch a specific event, replace 1 with the actual event ID
        const response = await axiosInstance.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setEvent("멋진 이벤트로 돌아오겠습니다!");
      }
    };

    fetchEvent();
  }, [id]);

  return (
      <header>
        <div className="banner-container">
          {event && event.eventId && (
              <Banner title={event.title} eventId={event.eventId}/>
          )}
        </div>
      </header>
  );
}

/**
 * 상단 탭 목록들
 *
 * @returns 탭 목록, 장바구니/알림에는 개수 포함
 */
const NavItems = () => {
  // TODO: url 추가하기
  const itemList = [
    {url: "/profile", class: "fas fa-user", name: "프로필"},
    {url: "", class: "fas fa-gamepad", name: "라이브러리"},
  ];

  const list = [];
  for (let i = 0; i < itemList.length; i++) {
    list.push(
        <a key={i} href={itemList[i].url} className="nav-item">
          <i className={itemList[i].class}></i>
          <span>{itemList[i].name}</span>
        </a>
    );
  }

  return <>
    {list}
    <a href="" className="nav-item">
      <i className="fas fa-shopping-cart"></i>
      <span>장바구니</span>
      <span className="cart-count">0</span>
    </a>
    <a href="" className="nav-item">
      <i className="fas fa-bell"></i>
      <span>알림</span>
      <span className="notification-count">0</span>
    </a>
  </>
}

// TODO: 검색 기능

/**
 * 게임 보드 생성
 *
 * @param {*} props 이미지, 제목, 가격
 * @returns 단일 게임 보드
 */
const CouponCard = (props) => {// 만료일 계산
  const issuedDate = new Date(props.issuedDate);
  const expiredDate = new Date(issuedDate);
  const navigate = useNavigate();
  expiredDate.setDate(issuedDate.getDate() + props.validDays);

  // YYYY-MM-DD 형식으로 변환
  const formattedExpiredDate = expiredDate.toISOString().split('T')[0];

  // ✅ 쿠폰 발급 API 호출 함수
  const handleCouponIssue = async () => {
    try {
      const token = localStorage.getItem('Authorization');
      if (!token) {
        console.log('Authorization token is missing.');
        navigate('/redirect')
        return;
      }

      const response = await axiosInstance.post(
          `/user/coupons/lockrequest/${props.name}`
      );

      alert(response.data); // ✅ 성공 메시지 표시

    } catch (error) {
      console.error("쿠폰 발급 실패:", error.response?.data || error.message);
      alert(`쿠폰 발급 실패: ${error.response?.data?.message || "서버 오류 발생"}`);
    }
  };
  // TODO: 이미지 배율 + 자르기 적용
  return (
      <div className="coupon-card">
        <div className="coupon-info">
          <h3>{props.name}</h3>
          <p className="rate">
            {props.couponType === "PERCENT"
                ? `${props.rate}% 할인`
                : `${props.rate.toLocaleString()}원 할인`}
          </p>
          <p className="validDays">사용기간 : {props.validDays}일</p>
          <p className="expiredDate">만료일 : {formattedExpiredDate}</p>
          <button className="issue-btn" onClick={handleCouponIssue}>쿠폰 발급
          </button>
        </div>
      </div>
  )
}

const PageDiv = (props) => {
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
    if (props.onPageChange) {
      props.onPageChange(value); // 부모 컴포넌트에 페이지 값 전달
    }
  };

  return (
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination
              count={Math.ceil(props.count / props.length)}
              color="primary"
              page={page}
              onChange={handlePageChange}/>
        </Stack>
      </div>
  )
}

/**
 * 게임 다건 조회api 호출해서 페이징된 게임 목록 생성
 *
 * @returns 게임 보드 목록 + 페이징
 */
const Coupons = ({eventId}) => {
  const list = [];
  const [coupons, setCoupons] = useState({list: [], count: 0});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        if (!token) {
          console.log('Authorization token is missing.');
          navigate('/redirect')
        }

        const response = await axiosInstance.get(`/coupons/${eventId}`, {
          params: {
            page: page - 1,
          },
        })
        setCoupons(response.data)
      } catch (err) {
        setError("Failed to fetch coupons: " + err.message);
      }
    };
    fetchCoupons();
  }, [eventId, page]);

  if (error) {
    return <div>Error: {error}</div>
  }

  // TODO: 이미지 주석 해제
  for (const element of coupons.list) {
    list.push(
        <CouponCard
            key={element.name}
            id={element.name}
            name={element.name}
            rate={element.rate}
            couponType={element.couponType}
            issuedDate={element.issuedDate}
            validDays={element.validDays}
        />
    );
  }

  // TODO: 페이지네이션 버튼 이벤트
  return <>
    <main>
      <div class="coupon-grid">{list}</div>
    </main>
    <PageDiv
        count={coupons.count}
        length={coupons.list.length}
        onPageChange={(value) => setPage(value)}/>
  </>
}

const Main = () => {
  const eventId = 1;
  return <>
    <nav className="top-nav">
      <div className="nav-container">
        <div className="logo">
          <h1>Playcation</h1>
        </div>
        <div className="nav-items"><NavItems></NavItems></div>
      </div>
    </nav>
    <Header id={eventId}/>
    <div className="main-body">
      <Coupons eventId={eventId}/>
    </div>
  </>
}

export default Main;
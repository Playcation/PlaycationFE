import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from "../api/api";
import {Pagination} from '@mui/material';
import Stack from '@mui/material/Stack';
import './CouponEventPage.css'

const Banner = ({title, description}) => {

  return (
      <a href=''>
        <div className="banner active">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </a>
  )

}

const Header = ({id}) => {
  const [searchContent, setSearchContent] = useState("");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        if (response.data && response.data.eventId) {
          setEvent(response.data);
        } else {
          setEvent(null); // 이벤트 없을 때
        }
      } catch (err) {
        setEvent({title: "새로운 이벤트를 준비 중입니다!"});
      }
    };

    fetchEvent();
  }, [id]);

  return (
      <header>
        <div className="banner-container">
          {event && (
              <Banner title={event.title} eventId={event.eventId}
                      description={event.description || ""}/>
          )}
        </div>
      </header>
  );
}

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

const CouponCard = (props) => {// 만료일 계산
  const issuedDate = new Date(props.issuedDate);
  const expiredDate = new Date(issuedDate);
  const navigate = useNavigate();
  expiredDate.setDate(issuedDate.getDate() + props.validDays);

  // YYYY-MM-DD 형식으로 변환
  const formattedExpiredDate = expiredDate.toISOString().split('T')[0];

  //  쿠폰 발급 API 호출 함수
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

      alert(response.data); // 성공 메시지 표시

    } catch (error) {
      console.error("쿠폰 발급 실패:", error.response?.data || error.message);
      alert(`쿠폰 발급 실패: ${error.response?.data?.message || "서버 오류 발생"}`);
    }
  };
  return (
      <div className="coupon-card">
        <div className="coupon-info">
          <h3>{props.name}</h3>
          <p className="rate">
            {props.couponType === "PERCENT"
                ? `${props.rate}% 할인 쿠폰`
                : `${props.rate.toLocaleString()}원 할인 쿠폰`}
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
  const {eventId} = useParams(); // 현재 URL에서 eventId 가져오기

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
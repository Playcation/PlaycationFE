import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axiosInstance from "../api/api";
import {Pagination} from '@mui/material';
import Stack from '@mui/material/Stack';
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import './styles.css'
import NavPage from '../NavPage';

/**
 * 단일 배너
 *
 * @param {*} props 제목
 */
const Banner = ({title, description, eventId}) => {
  const navigate = useNavigate();

  const couponDetail = () => {
    navigate(`/events/${eventId}`);
  }

  return (
      <a href=''>
        <div className="banner active">
          <h2>{title}</h2>
          <p>{description}</p>
          {eventId && (
              <button type="button" onClick={couponDetail}>
                이벤트 확인하기
              </button>
          )}
        </div>
      </a>
  )
}

/**
 * header 태그 이벤트 배너 목록
 *
 * @param {*} props 이벤트 목록?
 */
const Header = () => {
  const [searchContent, setSearchContent] = useState("");
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // TODO: 이벤트 목록 DB로 뽑을지 fix할지 상의

  // const bannerList = [];
  // for (let i = 0; i < props.topics.length; i++) {
  //     bannerList.push(<Banner key={i} title={props.topics[i]}></Banner>)
  // }
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        } else {
          setEvents([{title: "새로운 이벤트를 준비 중입니다!"}]); // 이벤트 없을 때
        }
      } catch (err) {
        setEvents([{title: "새로운 이벤트를 준비 중입니다!"}]);
      }
    };

    fetchEvents();
  }, []);

  const goToEvent = () => {
    if (events[currentIndex]?.eventId) {
      navigate(`/events/${events[currentIndex].eventId}`);
    }
  };

  const slideBanner = (direction) => {
    if (direction === "next") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    } else {
      setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + events.length) % events.length);
    }
  };
  return (
      <header>
        <div className="banner-container">
          {events.length > 0 && (
              <>
                <button className="slider-btn slider-btn-prev"
                        onClick={() => slideBanner("prev")}>
                  <FaChevronLeft/>
                </button>
                <Banner
                    title={events[currentIndex].title}
                    description={events[currentIndex].description || ""}
                    eventId={events[currentIndex].eventId}
                    onClick={goToEvent}
                />
                <button className="slider-btn slider-btn-next"
                        onClick={() => slideBanner("next")}>
                  <FaChevronRight/>
                </button>
              </>
          )}
        </div>
        <div className="search-container">
          <input
              type="text"
              value={searchContent}
              placeholder="게임 검색..."
              id="searchInput"
              onChange={(e) => setSearchContent(e.target.value)}
          />
          <button type="button">검색</button>
        </div>
      </header>
  )
      ;
}

// TODO: 검색 기능
const Search = (props) => {

}

/**
 * 게임 보드 생성
 *
 * @param {*} props 이미지, 제목, 가격
 * @returns 단일 게임 보드
 */
export const GameCard = (props) => {
  // TODO: 이미지 배율 + 자르기 적용

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${props.id}`);
  };

  return (
      <div className="game-card" onClick={handleClick}
           style={{cursor: "pointer"}}>
        <div className="game-image">
          {props.image ? (
              <img src={props.image} className="game-img"/>
          ) : <svg viewBox="0 0 100 100" className="placeholder-img">
            <rect width="100" height="100" fill="#2a475e"/>
          </svg>
          }
        </div>
        <div className="game-info">
          <h3>{props.title}</h3>
          <p className="price">₩{props.price}</p>
          <button className="buy-btn">상세 페이지</button>
        </div>
      </div>
  )
}

export const PageDiv = (props) => {
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
export const Games = () => {
  const list = [];
  const [games, setGames] = useState({list: [], count: 0});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        if (!token) {
          console.log('Authorization token is missing.');
          navigate('/redirect')
          return;
        }

        const response = await axiosInstance.get('/games', {
          params: {
            page: page - 1,
          },
        })
        setGames({
          list: response.data.list || [],
          count: response.data.count || 0,
        });
      } catch (err) {
        setError("Failed to fetch games: " + err.message);
        navigate("/");
        alert("다시 로그인 해 주식기 바랍니다.");
      }
    };
    fetchGames();
  }, [page]);

  if (error) {
    return <div>Error: {error}</div>
  }

  for (const element of games.list) {
    list.push(
        <GameCard
            key={element.gameId}
            id={element.gameId}
            image={element.mainImagePath}
            title={element.title}
            price={element.price}
        />
    );
  }

  // TODO: 페이지네이션 버튼 이벤트
  return <>
    <main>
      <div className="game-grid">{list}</div>
    </main>
    <PageDiv
        count={games.count}
        length={games.list.length}
        onPageChange={(value) => setPage(value)}/>
  </>
}

const Main = () => {

  return <>
    <NavPage />
    <Header/>
    <div className="main-body">
      <Games></Games>
    </div>
  </>
}

export default Main;

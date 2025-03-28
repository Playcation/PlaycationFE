import React, {useEffect, useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import axiosInstance from "../api/api";
import {Pagination} from '@mui/material';
import Stack from '@mui/material/Stack';
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import './styles.css'
import {Logo} from "../user/jsx/Login";
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
      <div className="banner active" onClick={couponDetail} style={{ cursor: 'pointer' }}>
        <h2>{title}</h2>
        <p>{description}</p>
        {eventId && (
            <button type="button" onClick={couponDetail}>
              이벤트 확인하기
            </button>
        )}
      </div>
  );
}

/**
 * header 태그 이벤트 배너 목록
 *
 * @param {*} props 이벤트 목록?
 */
const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        } else {
          setEvents([{ title: "새로운 이벤트를 준비 중입니다!" }]);
        }
      } catch (err) {
        setEvents([{ title: "새로운 이벤트를 준비 중입니다!" }]);
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
      setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
      <header>
        <div className="banner-container">
          <button className="slider-btn slider-btn-prev" onClick={() => slideBanner("prev")}>
            <FaChevronLeft />
          </button>
          <Banner {...events[currentIndex]} />
          <button className="slider-btn slider-btn-next" onClick={() => slideBanner("next")}>
            <FaChevronRight />
          </button>
        </div>
        {userRole === "ADMIN" && <button onClick={() => navigate('/events/admin')} className="admin-btn">EVENT ADMIN</button>}
        <div className="search-container">
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="게임 검색..."
          />
          <button onClick={handleSearch}>검색</button>
        </div>
      </header>
  );
};
/**
 * 상단 탭 목록들
 *
 * @returns 탭 목록, 장바구니/알림에는 개수 포함
 */
// const NavItems = () => {
//   // TODO: url 추가하기
//   const itemList = [
//     {url: "/profile", class: "fas fa-user", name: "프로필"},
//     {url: "", class: "fas fa-gamepad", name: "라이브러리"},
//   ];
//
//   const list = [];
//   for (let i = 0; i < itemList.length; i++) {
//     list.push(
//         <Link key={i} to={itemList[i].url} className="nav-item">
//           <i className={itemList[i].class}></i>
//           <span>{itemList[i].name}</span>
//         </Link>
//     );
//   }
//
//   return <>
//     {list}
//     <Link to="/carts" className="nav-item">
//       <i className="fas fa-shopping-cart"></i>
//       <span>장바구니</span>
//       <span className="cart-count">0</span>
//     </Link>
//     <a href="" className="nav-item">
//       <i className="fas fa-bell"></i>
//       <span>알림</span>
//       <span className="notification-count">0</span>
//     </a>
//   </>
// }
//
// const Search = ({ onSearch }) => {
//     const [searchTerm, setSearchTerm] = useState("");
//
//     const handleSearch = () => {
//         onSearch(searchTerm);
//     };
//
//     return (
//         <div className="search-container">
//             <input
//                 type="text"
//                 value={searchTerm}
//                 placeholder="게임 검색..."
//                 id="searchInput"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button type="button" onClick={handleSearch}>검색</button>
//         </div>
//     );
// };

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
        <div className="game-card" onClick={handleClick} style={{ cursor: "pointer" }}>
                <div className="game-image">
                    {props.image ? (
                        <img src={props.image} className="game-img" />
                    ) : <Logo></Logo>
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
export const Games = ({ searchTitle }) => {
    const list = [];
    const [games, setGames] = useState({ list: [], count: 0 });
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
                        title: searchTitle || "", // 검색어가 없으면 기본 리스트
                    },
                });
                setGames({
                    list: response.data.list || [],
                    count: response.data.count || 0,
                });
            } catch (err) {
                setError("Failed to fetch games: " + err.message);
                navigate("/");
                alert("다시 로그인 해 주시기 바랍니다.");
            }
        };
        fetchGames();
    }, [page, searchTitle]);

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

    return <>
        <main>
            <div className="game-grid">{list}</div>
        </main>
        <PageDiv
            count={games.count}
            length={games.list.length}
            onPageChange={(value) => setPage(value)} />
    </>
}

const Main = () => {
    const [searchTitle, setSearchTitle] = useState(""); // 검색어 상태
    const [error, setError] = useState(null);

    // 🔍 검색 API 호출
    const fetchSearchResults = async (query) => {
        try {
            const response = await axiosInstance.get("/games/search", {
                params: { keyword: query }
            });
            setError(null);
        } catch (err) {
            setError("검색 결과를 가져오지 못했습니다.");
        }
    };

  return <>
    <NavPage />
    <Header title="Playcation" onSearch={setSearchTitle}></Header>

    <div className="main-body">
      <Games searchTitle={searchTitle} />
    </div>
  </>
}

export default Main;

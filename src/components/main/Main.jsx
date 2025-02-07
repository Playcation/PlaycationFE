import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../api/api";
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './styles.css';
import { Logo } from "../user/jsx/Login";

const Banner = ({ title, description, eventId }) => {
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

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        setEvents(response.data.length > 0 ? response.data : [{ title: "새로운 이벤트를 준비 중입니다!" }]);
      } catch (err) {
        setEvents([{ title: "새로운 이벤트를 준비 중입니다!" }]);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
      <header>
        <div className="banner-container">
          {events.length > 0 && (
              <>
                <button className="slider-btn" onClick={() => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length)}>
                  <FaChevronLeft />
                </button>
                <Banner {...events[currentIndex]} />
                <button className="slider-btn" onClick={() => setCurrentIndex((prev) => (prev + 1) % events.length)}>
                  <FaChevronRight />
                </button>
              </>
          )}
        </div>
        <div className="search-container">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="게임 검색..." />
          <button onClick={handleSearch}>검색</button>
        </div>
      </header>
  );
};

const Games = ({ searchTitle }) => {
  const [games, setGames] = useState({ list: [], count: 0 });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        if (!token) {
          navigate('/redirect');
          return;
        }
        const response = await axiosInstance.get('/games', {
          params: { page: page - 1, title: searchTitle || "" },
        });
        setGames({
          list: response.data.list || [],
          count: response.data.count || 0,
        });
      } catch (err) {
        navigate("/");
        alert("다시 로그인 해 주시기 바랍니다.");
      }
    };
    fetchGames();
  }, [page, searchTitle]);

  return (
      <>
        <main>
          <div className="game-grid">
            {games.list.map((game) => (
                <GameCard key={game.gameId} id={game.gameId} image={game.mainImagePath} title={game.title} price={game.price} />
            ))}
          </div>
        </main>
        <PageDiv count={games.count} length={games.list.length} onPageChange={setPage} />
      </>
  );
};

export const GameCard = ({ id, image, title, price }) => {
  const navigate = useNavigate();

  return (
      <div className="game-card" onClick={() => navigate(`/games/${id}`)}>
        <div className="game-image">
          {image ? <img src={image} className="game-img" alt={title} /> : <Logo />}
        </div>
        <div className="game-info">
          <h3>{title}</h3>
          <p className="price">₩{price}</p>
          <button className="buy-btn">상세 페이지</button>
        </div>
      </div>
  );
};

export const PageDiv = ({ count, length, onPageChange }) => {
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
    onPageChange(value);
  };

  return (
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination count={Math.ceil(count / length)} color="primary" page={page} onChange={handlePageChange} />
        </Stack>
      </div>
  );
};

const Main = () => {
  const [searchTitle, setSearchTitle] = useState("");

  return (
      <>
        <nav className="top-nav">
          <div className="nav-container">
            <div className="logo"><Logo /></div>
          </div>
        </nav>
        <Header onSearch={setSearchTitle} />
        <div className="main-body">
          <Games searchTitle={searchTitle} />
        </div>
      </>
  );
};

export default Main;

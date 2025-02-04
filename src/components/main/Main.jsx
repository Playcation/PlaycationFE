import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../api/api";
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import './styles.css'

/**
 * 단일 배너
 * 
 * @param {*} props 제목
 */
const Banner = (props) => {
    return (
        <a href=''>
            <div className="banner active">
                <h2>{props.title}</h2>
            </div>
        </a>
    )
}

/**
 * header 태그 이벤트 배너 목록
 * 
 * @param {*} props 이벤트 목록?
 */
const Header = (props) => {
    const [searchContent, setSearchContent] = useState("");

    // TODO: 이벤트 목록 DB로 뽑을지 fix할지 상의

    // const bannerList = [];
    // for (let i = 0; i < props.topics.length; i++) {
    //     bannerList.push(<Banner key={i} title={props.topics[i]}></Banner>)
    // }

    return (
        <header>
            <div className="banner-container">
                <Banner key="0" title="쿠폰 발급 이벤트"></Banner>
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
        { url: "/profile", class: "fas fa-user", name: "프로필" },
        { url: "", class: "fas fa-gamepad", name: "라이브러리" },
    ];

    const list = [];
    for (let i = 0; i < itemList.length; i++) {
        list.push(
            <Link key={i} to={itemList[i].url} className="nav-item">
                <i className={itemList[i].class}></i>
                <span>{itemList[i].name}</span>
            </Link>
        );
    }

    return <>
        {list}
        <Link to="/carts" className="nav-item">
            <i className="fas fa-shopping-cart"></i>
            <span>장바구니</span>
            <span className="cart-count">0</span>
        </Link>
        <a href="" className="nav-item">
            <i className="fas fa-bell"></i>
            <span>알림</span>
            <span className="notification-count">0</span>
        </a>
    </>
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
const GameCard = (props) => {
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
                    ) : <svg viewBox="0 0 100 100" className="placeholder-img">
                        <rect width="100" height="100" fill="#2a475e" />
                    </svg>
                    }
                </div>
                <div className="game-info">
                    <h3>{props.title}</h3>
                    <p className="price">₩{props.price}</p>
                    <button className="buy-btn">구매하기</button>
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
                    onChange={handlePageChange} />
            </Stack>
        </div>
    )
}


/**
 * 게임 다건 조회api 호출해서 페이징된 게임 목록 생성
 * 
 * @returns 게임 보드 목록 + 페이징
 */
const Games = () => {
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

    // TODO: 이미지 주석 해제
    for (const element of games.list) {
        list.push(
            <GameCard
                key={element.gameId}
                id={element.gameId}
                // image={games.list.image}
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
            onPageChange={(value) => setPage(value)} />
    </>
}

const Main = () => {

    return <>
        <nav className="top-nav">
            <div className="nav-container">
                <div className="logo">
                    <h1>Playcation</h1>
                </div>
                <div className="nav-items"><NavItems></NavItems></div>
            </div>
        </nav>
        <Header title="Playcation"></Header>
        <div className="main-body">
            <Games></Games>
        </div>
    </>
}

export default Main;
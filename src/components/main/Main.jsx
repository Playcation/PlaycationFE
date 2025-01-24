import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
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
            <div class="banner active">
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
            <div class="banner-container">
                <Banner key="0" title="쿠폰 발급 이벤트"></Banner>
            </div>
            <div class="search-container">
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
        { url: "", class: "fas fa-user", name: "프로필" },
        { url: "", class: "fas fa-gamepad", name: "라이브러리" },
    ];

    const list = [];
    for (let i = 0; i < itemList.length; i++) {
        list.push(
            <a key={i} href={itemList[i].url} class="nav-item">
                <i class={itemList[i].class}></i>
                <span>{itemList[i].name}</span>
            </a>
        );
    }

    return <>
        {list}
        <a href="" class="nav-item">
            <i class="fas fa-shopping-cart"></i>
            <span>장바구니</span>
            <span class="cart-count">0</span>
        </a>
        <a href="" class="nav-item">
            <i class="fas fa-bell"></i>
            <span>알림</span>
            <span class="notification-count">0</span>
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
const GameCard = (props) => {
    // TODO: 이미지 배율 + 자르기 적용
    return <>
        <div class="game-card">
            <div class="game-image">
                {props.image ? (
                    <img src={props.image} className="game-img" />
                ) : <svg viewBox="0 0 100 100" class="placeholder-img">
                    <rect width="100" height="100" fill="#2a475e" />
                </svg>
                }
            </div>
            <div class="game-info">
                <h3>{props.title}</h3>
                <p class="price">₩{props.price}</p>
                <button class="buy-btn">구매하기</button>
            </div>
        </div>
    </>
}

const PageDiv = (props) => {
    const [page, setPage] = React.useState(1);

    const handlePageChange = (event, value) => {
        setPage(value);
        if (props.onPageChange) {
            props.onPageChange(value); // 부모 컴포넌트에 페이지 값 전달
        }
    };

    return <>
        <div class="pagination">
            <Stack spacing={2}>
                <Pagination
                    count={Math.ceil(props.count / props.length)}
                    color="primary"
                    page={page}
                    onChange={handlePageChange} />
            </Stack>
        </div>
    </>
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

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const token = localStorage.getItem('Authorization');
                if (!token) {
                    setError('Authorization token is missing.');
                    return;
                }

                const response = await axios.get('http://localhost:8080/games', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: page - 1,
                    },
                    withCredentials: true,
                })
                setGames(response.data)
            } catch (err) {
                setError("Failed to fetch games: " + err.message);
            }
        };
        fetchGames();
    }, [page]);

    if (error) {
        return <div>Error: {error}</div>
    }

    // TODO: 이미지 주석 해제
    for (let i = 0; i < games.list.length; i++) {
        list.push(
            <GameCard
                key={games.list[i].gameId}
                // image={games.list.image}
                title={games.list[i].title}
                price={games.list[i].price}
            />
        );
    }

    // TODO: 페이지네이션 버튼 이벤트
    return <>
        <main>
            <div class="game-grid">{list}</div>
        </main>
        <PageDiv
            count={games.count}
            length={games.list.length}
            onPageChange={(value) => setPage(value)} />
    </>
}

const Main = () => {

    return <>
        <nav class="top-nav">
            <div class="nav-container">
                <div class="logo">
                    <h1>Playcation</h1>
                </div>
                <div class="nav-items"><NavItems></NavItems></div>
            </div>
        </nav>
        <Header title="Playcation"></Header>
        <div class="main-body">
            <Games></Games>
        </div>
    </>
}

export default Main;
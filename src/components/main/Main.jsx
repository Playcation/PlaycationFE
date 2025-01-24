import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css'

function Header(props) {
    const [searchContent, setSearchContent] = useState("");

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

function Banner(props) {
    return (
        <a href=''>
            <div class="banner active">
                <h2>{props.title}</h2>
            </div>
        </a>
    )
}

function GameCard(props) {
    <div class="game-card">
        <div class="game-image">
            {props.image ? (
                <img src={props.image} className="game-img" />
            ) : <svg viewBox="0 0 100 100" class="placeholder-img">
                <rect width="100" height="100" fill="#2a475e" />
                <text x="50" y="50" text-anchor="middle" fill="white">Game 1</text>
            </svg>
            }
        </div>
        <div class="game-info">
            <h3>{props.title}</h3>
            <p class="price">₩{props.price}</p>
            <button class="buy-btn">구매하기</button>
        </div>
    </div>
}

function Games(props) {
    // axios.get('http://localhost:8080/games', {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    //     params: {
    //         page: `0`
    //     },
    //     withCredentials: true,
    // })

    const list = [];
    for (let i = 0; i < props.image.length; i++) {
        list.push(
            <GameCard image={props.image} title={props.title} price={props.price}></GameCard>
        );
    }

    return list;
}

function NavItems() {
    // TODO: url 추가하기
    const itemList = [
        { url: "/profile", class: "fas fa-user", name: "프로필" },
        { url: "", class: "fas fa-gamepad", name: "라이브러리" },
    ];

    const list = [];
    for (let i = 0; i < itemList.length; i++) {
        list.push(
            <a href={itemList[i].url} class="nav-item">
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

export default function Main() {

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
        <main>
            <div class="game-grid"></div>
        </main>
        <div class="pagination" id="pagination" w-tid="10">
            <button class="page-btn" disabled="" data-action="prev">
                «
            </button>

            <button class="page-btn active" data-page="1">
                1
            </button>

            <button class="page-btn " data-page="2">
                2
            </button>

            <button class="page-btn " data-page="3">
                3
            </button>

            <button class="page-btn" data-action="next">
                »
            </button>
        </div>
    </>
}


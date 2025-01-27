import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/api";
import './style.css'

const CartItem = (props) => {

    return (
        <div class="cart-item">
            {props.image ? (
                <img src={props.image} className="game-img" />
            ) : <svg viewBox="0 0 100 100" className="placeholder-img" />
            }
            <div class="item-details">
                <h3>{props.title}</h3>
                <div class="item-price">
                    <span>₩{props.price}</span>
                </div>
            </div>
            <button class="remove-item">×</button>
        </div>
    )
}

const CartSummary = (props) => {

    return (
        <section class="cart-summary">
            <h2>요약</h2>
            <div class="summary-row total">
                <span>총 결제 금액:</span>
                <span>₩{props.total}</span>
            </div>
            <button class="purchase-btn">결제하기</button>
        </section>
    )
}

const CartItemList = () => {

    const list = [];
    const [carts, setCarts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const token = localStorage.getItem('Authorization');
                if (!token) {
                    console.log('Authorization token is missing.');
                    navigate('/redirect')
                }

                const response = await axiosInstance.get('/carts');
                setCarts(response.data);
            } catch (err) {
                setError("Failed to fetch carts: " + err.message);
            }
        };
        fetchCarts();
    }, []);

    if (error) {
        return <div>Error: {error}</div>
    }

    console.log(carts)

    for (const element of carts) {
        list.push(
            <CartItem
                key={element.id}
                image={element.imageUrl}
                title={element.title}
                price={element.price}
            />
        )
    }

    return (
        <main class="cart-page">
            <section class="cart-items">
                <h1>장바구니</h1>
                {list}
            </section>
            <CartSummary />
        </main>
    )
}

const CartPage = () => {

    return (
        <div class="steam-container">
            <CartItemList />
            <footer>
                <p>© 2025 Playcation. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default CartPage;
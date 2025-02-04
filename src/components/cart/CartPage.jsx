import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/api";
import './style.css'

const CartItem = (props) => {

    return (
        <div class="cart-item">
            {props.image ? (
                <img src={props.image} className="game-img" />
            ) : <svg viewBox="0 0 100 100" width="50" height="50" className="placeholder-img" />
            }
            <div className="item-details">
                <h3>{props.title}</h3>
                <div className="item-price">
                    <span>₩{props.price}</span>
                </div>
            </div>
            <button className="remove-item" onClick={() => props.removeItem(props.id)}>×</button>
        </div>
    )
}

const CartSummary = (props) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const pay = async () => {
        const token = localStorage.getItem('Authorization');
        if (!token) {
            console.log('Authorization token is missing.');
            navigate('/redirect')
            return;
        }

        try {
            const response = await axiosInstance.get('/orders/proceed')
            console.log(response.data);

            navigate('/sandbox', {
                state: {
                    amount: {
                        currency: "KRW",
                        value: response.data.total
                    },
                    orderId: response.data.orderId
                }
            });
        } catch (err) {
            setError("Failed to fetch games: " + err.message);
        }
    }

    return (
        <section class="cart-summary">
            <h2>요약</h2>
            <div class="summary-row total">
                <span>총 결제 금액:</span>
                <span>₩{props.total}</span>
            </div>
            {error && <div className="error">{error}</div>}
            <button class="purchase-btn" onClick={pay}>결제하기</button>
        </section>
    )
}

const CartItemList = () => {
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

    const removeItem = (targetId) => {
        axiosInstance.delete(`/carts/delete/${targetId}`)
            .then(() => {
                setCarts((prevCarts) => prevCarts.filter(cart => cart.id !== targetId))
            })
    }

    const totalPrice = carts.reduce((sum, item) => sum + item.price, 0);

    const list = carts.map((element) => (
        <CartItem
            key={element.id}
            id={element.id}
            image={element.imageUrl}
            title={element.title}
            price={element.price}
            removeItem={removeItem}
        />
    ))

    return (
        <main class="cart-page">
            <section class="cart-items">
                <h1>장바구니</h1>
                {list}
            </section>
            <CartSummary total={totalPrice} />
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
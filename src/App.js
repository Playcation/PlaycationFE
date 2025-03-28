import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import Login from './components/user/jsx/Login';
import Redirection from "./components/common/Redirection";
import Refresh from "./components/common/Refresh";
import Signup from "./components/user/jsx/Signup";
import UserProfile from "./components/user/jsx/UserProfile";
import UserUpdate from "./components/user/jsx/UserUpdate";
import Main from "./components/main/Main";
import ErrorPage from './components/error/ErrorPage';
import UserPasswordUpdate from "./components/user/jsx/UserPasswordUpdate";
import OAuth2RedirectHandler from "./components/common/OAuth2RedirectHandler";
import UserDelete from "./components/user/jsx/UserDelete";
import ErrorHandler from "./components/error/ErrorHandler";
import SuccessPage from "./components/toss/jsx/Success";
import CheckoutPage from "./components/toss/jsx/Checkout";
import FailPage from "./components/toss/jsx/Fail";
import AdminMain from "./components/admin/jsx/AdminMain";
import CreateGamePage from "./components/game/jsx/CreateGamePage";
import RegisterManager from "./components/user/jsx/RegisterManager";
import AcceptManagerPage from "./components/admin/jsx/AcceptManagerPage";
import GameDetailPage from './components/game/jsx/GameDetailPage';
import CouponEventPage from './components/coupon/CouponEventPage';
import CartPage from './components/cart/CartPage';
import UserCouponPage from "./components/user/jsx/UserCouponPage";
import Notification from "./components/notification/Notification";
import Review from "./components/review/Review";
import EventAdminPage from "./components/coupon/EventAdminPage";

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // 기존 SSE 연결이 있다면 재사용 (중복 연결 방지)
    if (window.sse) {
      console.log("기존 SSE 연결이 존재합니다. 새로운 연결을 만들지 않습니다.");
      return;
    }

    console.log("SSE 연결 시작...");
    // const eventSource = new EventSource(`http://api.playcation.store:8080/sse?token=${token}`, {
    const eventSource = new EventSource(`http://localhost:8080/sse?token=${token}`, {
      withCredentials: true,
    });

    //  SSE 연결 성공 시 로그 출력
    eventSource.onopen = () => {
      console.log("SSE 연결 성공!");
    };

    // 일반 메시지 수신
    eventSource.onmessage = (event) => {
      console.log("SSE 메시지 수신:", event.data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          gameName: "알림",
          message: event.data,
          time: "방금",
          unread: true,
        },
        ...prev,
      ]);
    };

    // 특정 이벤트("newReview") 수신
    eventSource.addEventListener("newReview", (event) => {
      console.log("새로운 리뷰 이벤트 수신:", event.data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          gameName: "게임 리뷰",
          message: event.data,
          time: "방금",
          unread: true,
        },
        ...prev,
      ]);
    });

    // SSE 연결 오류 발생 시 자동 재연결 (3초 후)
    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류, 3초 후 재연결...", error);
      eventSource.close();
      setTimeout(() => {
        // window.sse = new EventSource(`http://api.playcation.store:8080/sse?token=${token}`, {
        window.sse = new EventSource(`http://localhost:8080/sse?token=${token}`, {
          withCredentials: true,
        });
      }, 3000);
    };

    // SSE 전역 등록 (중복 방지)
    window.sse = eventSource;

    return () => {
      eventSource.close();
      window.sse = null;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // 토큰 디코딩
        setUserRole(payload.role || null);
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
      }
    }
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/redirect" element={<Redirection/>}/>
          <Route path="/refresh" element={<Refresh/>}/>
          <Route path="/sign-up" element={<Signup/>}/>
          <Route path="/profile" element={<UserProfile/>}/>
          <Route path="/user-update" element={<UserUpdate/>}/>
          <Route path="/main" element={<Main/>}/>
          <Route path="/error" element={<ErrorPage status={500}
                                                   message="Something went wrong."/>}/>
          <Route path="*"
                 element={<ErrorPage status={404} message="Page not found."/>}/>
          <Route path="/change-password" element={<UserPasswordUpdate/>}/>
          <Route path="/user-delete" element={<UserDelete/>}/>
          <Route path="/oauth2/callback" element={<OAuth2RedirectHandler/>}/>
          <Route path="/error" element={<ErrorPage/>}/>
          <Route path="/error" element={<ErrorHandler
              // apiEndpoint="http://api.playcation.store:8080/error"/>}/>
              apiEndpoint="http://localhost:8080/error"/>}/>
          <Route path="/sandbox/success" element={<SuccessPage/>}/>
          <Route path="/sandbox" element={<CheckoutPage/>}/>
          <Route path="/sandbox/fail" element={<FailPage/>}/>
          <Route path="/admin" element={<AdminMain/>}/>
          <Route path="/game" element={<CreateGamePage/>}/>
          <Route path="/register/manager" element={<RegisterManager/>}/>
          <Route path="/search/regist/manager" element={<AcceptManagerPage/>}/>
          <Route path="/carts" element={<CartPage/>}/>
          <Route path="/games/:gameId" element={<GameDetailPage/>}/>
          <Route path="/forbidden"
                 element={<ErrorPage status="403" errorName="Forbidden"
                                     message="권한이 없습니다."/>}/>
          <Route path="/events/:eventId" element={<CouponEventPage/>}/>
          <Route path="/my-coupon" element={<UserCouponPage/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/games/:gameId/review" element={<Review/>}/>
          <Route path="/events/admin" element={<EventAdminPage/>}/>
        </Routes>
      </Router>
  );
};

export default App;
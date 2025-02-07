import React, { useState, useEffect } from "react";
import '../notification/styles.css';
import {Navigate} from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

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
    const eventSource = new EventSource(`http://api.playcation.store/sse?token=${token}`, {
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
        window.sse = new EventSource(`http://api.playcation.store/sse?token=${token}`, {
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

  // 알림 읽음 처리
  const handleNotificationAction = (id) => {
    setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
      <div className="container">
        <header>
          <h1>🎮 알림</h1>
          <nav>
            <div>
              {/* 알림 버튼 */}
              <button id="notifications-btn">
                🔔
                {/* 읽지 않은 알림 개수 */}
                <span>{notifications.filter((n) => n.unread).length}</span>
              </button>
            </div>
          </nav>
        </header>

        <main className="notifications-page">
          <section className="notifications-header">
            <h2>알림</h2>
          </section>

          <section className="notifications-list">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification-card ${notification.unread ? "unread" : ""}`}>
                  <div className="notification-icon">💬</div>
                  <div className="notification-content">
                    <p>
                      <strong>{notification.gameName}</strong>: {notification.message}
                    </p>
                  </div>
                  <button
                      className="notification-action"
                      onClick={() => handleNotificationAction(notification.id)}>
                    확인
                  </button>
                </div>
            ))}
          </section>
        </main>

        <footer>
          <p>© 2025 게임 리뷰 플랫폼</p>
        </footer>
      </div>
  );
};

export default Notifications;
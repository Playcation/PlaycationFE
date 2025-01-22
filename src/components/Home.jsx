import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("Authorization");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        await axios.post(
            "http://localhost:8080/check/token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
        );
      } catch (error) {
        console.error("Invalid token:", error);
        try {
          await axios.post(
              "http://localhost:8080/logout",
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
          );
          localStorage.removeItem("Authorization");
          navigate("/");
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Failed to log out. Please try again.");
        }
      }
    };

    checkToken();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return;

    try {
      await axios.post(
          "http://localhost:8080/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
      );
      localStorage.removeItem("Authorization");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
      <div className="home-container">
        <div className="header">
          {/* 원형 로고 추가 */}
          <svg className="steam-logo" viewBox="0 0 256 259"
               xmlns="http://www.w3.org/2000/svg">
            <path
                fill="#ffffff"
                d="M116.5 0C52.15 0 0 52.15 0 116.5c0 64.35 52.15 116.5 116.5 116.5 64.35 0 116.5-52.15 116.5-116.5C233 52.15 180.85 0 116.5 0zm0 215.175c-54.405 0-98.675-44.27-98.675-98.675 0-54.405 44.27-98.675 98.675-98.675 54.405 0 98.675 44.27 98.675 98.675 0 54.405-44.27 98.675-98.675 98.675z"
            />
          </svg>
        </div>
        <div>
          <h1>Welcome to Playcation App</h1>
          <button onClick={goToProfile}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
  );
};

export default Home;

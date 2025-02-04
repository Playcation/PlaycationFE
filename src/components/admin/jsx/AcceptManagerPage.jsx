import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../css/AcceptManagerPage.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 리디렉션에 사용할 네비게이트 훅

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/regist/managers");
      setUsers(response.data.list || []);
    } catch (error) {
      if (error.response?.status === 403) {
        console.error("Access denied: You do not have permission to access this resource.");
        navigate("/forbidden"); // 에러 발생 시 리디렉션
      } else {
        console.error("Error fetching users:", error);
        navigate("/error", {
          state: {
            status: error.response?.status || 500,
            message: error.message || "An unknown error occurred.",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const apprroveManager = async (prop) => {
    try {
      await axiosInstance.put(`/admin/users/${prop}/role`);
      await fetchUsers(); // 권한 업데이트 후 사용자 목록 다시 로드
    } catch (error) {
      console.error("Error approving manager:", error);
      navigate("/error", {
        state: {
          status: error.response?.status || 500,
          message: error.message || "Failed to approve manager.",
        },
      });
    }
  };

  if (loading) {
    return <div className="container"><p>Loading users...</p></div>;
  }

  if (!users.length) {
    return <div className="container"><p>No users found.</p></div>;
  }

  return (
      <div className="container">
        <h1>User List</h1>
        <div className="user-list">
          {users.map((user) => (
              <div className="user-card" key={user.title}>
                <div className="user-info">
                  <div
                      className="user-avatar"
                      style={{ backgroundImage: `url(${user.imageUrl})`, backgroundSize: "cover" }}
                  ></div>
                  <div>
                    <h2>{user.title}</h2>
                    <p>{user.description}</p>
                    <p><strong>Price:</strong> {user.price.toLocaleString()}원</p>
                    <p><strong>Terms Agreement:</strong> {user.termsAgreement ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="btn btn-approve" onClick={() => apprroveManager(user.userId)}>Approve</button>
                  <button className="btn btn-details">Details</button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default UserList;

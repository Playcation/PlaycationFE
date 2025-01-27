import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import "../css/AcceptManagerPage.css"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/regist/managers");
      setUsers(response.data.content || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const apprroveManager = (prop) =>{
    try {
    axiosInstance.put(`/admin/users/${prop}/role`);
    fetchUsers();
  } catch (error) {
    console.error("Error approving manager:", error);
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
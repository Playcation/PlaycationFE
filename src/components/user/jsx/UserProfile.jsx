import React, { useState, useEffect } from 'react';
import axiosInstance from "../../api/api";
import '../css/UserProfile.css';
import { useNavigate } from "react-router-dom";
import ErrorPage from '../../error/ErrorPage';
import {GameCard, Games, PageDiv} from "../../main/Main";
import {Logo} from "./Login";
import NavPage from '../../NavPage';

const ManagerBtn = (props) => {
  const navigate = useNavigate();

  const managementManager = () =>{
    navigate("/search/regist/manager")
  }

  const registerManager = () => {
    navigate("/register/manager");
  }

  const registerGame = () => {
    navigate("/manager/game");
  }

      if(props.role == "ADMIN"){
        return(
            <button onClick={managementManager}>메니저 관리</button>
        )
      }else if(props.role == "MANAGER"){
        return(
        <button onClick={registerGame}>게임 등록</button>
        );
      }else{
        return(
        <button onClick={registerManager}>메니저 등록</button>
        );
      }
};

const LibraryCards = () => {
  // TODO: 이미지 배율 + 자르기 적용
  const list = [];
  const navigate = useNavigate();
  const [games, setGames] = useState({list: [], count: 0});
  const [page, setPage] = useState(1);

  useEffect( () => {
    const fetchGames = async () => {
      try {
        const libraryResponse = await axiosInstance.get('/libraries/my-games', {
          params: { page: page - 1 },
        });

        setGames({
          list: libraryResponse.data.list || [],
          count: libraryResponse.data.count || 0,
        });
      } catch (error) {
        console.error("게임 목록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchGames();
  }, [page]);

  var i = 0;
  for (const element of games.list) {
    list.push(
        <GameCard
            key={i}
            id={element.gameId}
            image={element.mainImagePath}
            title={element.title}
            price={element.price}
        />
    );
    i = i + 1;
  }

  return (<>
        <div>
          <p>Library</p>
          <div className="game-grid">{list}</div>
        </div>
        <PageDiv
            count={games.count}
            length={games.list.length}
            onPageChange={(value) => setPage(value)}/>
      </>
  )
}

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [games, setGames] = useState({list: [], count: 0});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  // const list = [];

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('Authorization');
      if (!token) {
        setError('Authorization token is missing.');
        return;
      }

      try {
        const response = await axiosInstance.get('/users',
            {});

        setUser({
          username: response.data.username,
          filePath: response.data.filePath,
          email: response.data.email,
          description: response.data.description,
          updatedDate: response.data.updatedDate,
        });
        setRole(response.data.role);

        // const libraryResponse = await axiosInstance.get('/libraries/my-games', {
        //   params: {
        //     page: page - 1,
        //   },
        // });

      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile.');
      }
    };

    fetchUserProfile();
  }, [page]);

  if (error) {
    return <div>Error: {error}</div>
  }

  // var i = 0;
  // for (const element of games.list) {
  //   list.push(
  //       <GameCard
  //           key={i}
  //           id={element.gameId}
  //           image={element.mainImagePath}
  //           title={element.title}
  //           price={element.price}
  //       />
  //   );
  //   i = i + 1;
  // }

  // return (<>
  //       <div>
  //         <p>Library</p>
  //         <div className="game-grid">{list}</div>
  //       </div>
  //       <PageDiv
  //           count={games.count}
  //           length={games.list.length}
  //           onPageChange={(value) => setPage(value)}/>
  //     </>
  // )

  const changeProfile = () => {
    // Add logic for changing profile here
    navigate('/user-update');
  };

  const daliyCheck = async () => {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      setError('Authorization token is missing.');
      return;
    }
    try {
      const response = await axiosInstance.put('/users/attendance', null, {
      });
      alert("출석 체크 되었습니다");
      console.log(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      alert(`${errorMessage}`);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return;

    try {
      await axiosInstance.post(
        "/logout",
        {},
        {
        }
      );
      localStorage.removeItem("Authorization");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const deleteUser = () => {
    navigate("/user-delete");
  }

  const myCoupon = () => {
    navigate("/my-coupon")
  }

  if (error) {
    return <ErrorPage status={error.status} message={error.message} />;
  }


  const formattedJoinDate = user?.updatedDate
    ? new Date(user.updatedDate).toISOString().split('T')[0]
    : 'N/A';

  return (
    <>
      <NavPage />
      <div className="user-profile">
        {user ? (
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-background"></div>
                <div className="profile-summary">
                  <div className="avatar">
                    {user.filePath ? (
                        <img src={user.filePath} alt="프로필 아바타" />
                    ) : (
                        <Logo></Logo>
                    )}
                  </div>
                  <div className="profile-details">
                    <h1 className="profile-name">{user.username}</h1>
                    <div className="profile-info">
                      <span className="nickname">이메일: {user.email}</span>
                      <span className="status-message">
                    {user.description || '상태 메시지를 입력하세요'}
                  </span>

                  </div>
                  <div>
                    <button onClick={changeProfile}>프로필 변경</button>
                    <button onClick={daliyCheck}>일일 출석체크</button>
                    <button onClick={handleLogout}>로그 아웃</button>
                    <button onClick={deleteUser}>회원 탈퇴</button>
                    <ManagerBtn role = {role}></ManagerBtn>
                    <button onClick={myCoupon}>쿠폰함</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="loading">Loading user profile...</div>
        )}
        <div className="library">
          <LibraryCards ></LibraryCards>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

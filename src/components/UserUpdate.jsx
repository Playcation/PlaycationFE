import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserUpdate.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('Authorization');

        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.post(
            'http://localhost:8080/check/token',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
        );
        const { username, description } = response.data;
        setUser(response.data);
        setUsername(username);
        setDescription(description);
      } catch (error) {
        console.error('Token validation failed:', error);

        if (error.response && error.response.status === 401) {
          navigate('/refresh');
        } else {
          navigate('/');
        }
      }
    };

    checkToken();
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const deleteFileChange = () => {
    setSelectedFile(null);
  };

  const saveChange = async () => {
    if (!window.confirm('변경사항을 저장하시겠습니까?')) return;

    const token = localStorage.getItem('Authorization');

    const formData = new FormData();
    const userUpdateRequestDto = {
      username,
      password,
      description
    };

    formData.append(
        'json',
        new Blob([JSON.stringify(userUpdateRequestDto)], { type: 'application/json' })
    );

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await axios.put('http://localhost:8080/users', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('변경사항이 성공적으로 저장되었습니다!');
      console.log(response.data);
      navigate('/profile');
    } catch (error) {
      console.error('변경사항 저장 실패:', error);
      alert('변경사항 저장에 실패했습니다.');
    }
  };

  const cancelChange = () => {
    if (window.confirm('정말 취소하시겠습니까?')) {
      setUsername(user?.username || '');
      setPassword('');
      setDescription(user?.description || '');
      setSelectedFile(null);
      navigate('/profile');
    }
  };

  const changePassword = () => {
    navigate('/change-password');
  };

  return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-background"></div>
          <div className="profile-summary">
            <div className="avatar">
              {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="프로필 아바타" />
              ) : (
                  <svg
                      className="steam-logo"
                      viewBox="0 0 256 259"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        fill="#ffffff"
                        d="M116.5 0C52.15 0 0 52.15 0 116.5c0 64.35 52.15 116.5 116.5 116.5 64.35 0 116.5-52.15 116.5-116.5C233 52.15 180.85 0 116.5 0zm0 215.175c-54.405 0-98.675-44.27-98.675-98.675 0-54.405 44.27-98.675 98.675-98.675 54.405 0 98.675 44.27 98.675 98.675 0 54.405-44.27 98.675-98.675 98.675z"
                    />
                  </svg>
              )}
              <div className="avatar-buttons">
                <button className="upload-button" onClick={handleFileUploadClick}>
                  아바타 변경
                </button>
                <button className="upload-button" onClick={deleteFileChange}>
                  아바타 삭제
                </button>
              </div>
              <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="edit-form">
            <h2>프로필 수정</h2>

            <div className="form-group">
              <label>프로필 이름</label>
              <input
                  type="text"
                  placeholder="닉네임"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>상태 메시지</label>
              <input
                  type="text"
                  placeholder="상태 메시지를 입력하세요"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={cancelChange}>
                취소
              </button>
              <button className="change-password-button" onClick={changePassword}>
                비밀번호 변경
              </button>
              <button className="save-button" onClick={saveChange}>
                변경사항 저장
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;

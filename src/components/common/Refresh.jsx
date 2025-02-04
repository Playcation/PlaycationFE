import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from "../api/api";

const Refresh = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axiosInstance.post(
            '/check/token',
            {}, // POST request body
            {}
        );

        console.log('Token refreshed successfully:', response.data.token);

        // Save the new token
        localStorage.setItem('Authorization', response.data.token);

        // Redirect to the home page
        navigate('/main');
      } catch (error) {
        console.error('Failed to refresh token:', error);

        // Redirect to login if token refresh fails
        navigate('/');
      }
    };

    refreshToken();
  }, [navigate, location]);

  return null;
};

export default Refresh;

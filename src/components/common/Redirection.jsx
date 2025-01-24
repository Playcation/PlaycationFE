import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import './Redirection.css';

const Redirection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Save the token to localStorage
      localStorage.setItem('Authorization', token);
      console.log('Token saved:', token);

      // Redirect to home page
      navigate('/main');
    } else {
      console.error('No token found in the URL.');

      // Redirect to login page
      navigate('/');
    }
  }, [navigate, location]);

  return <div className="redirection-container"></div>;
};

export default Redirection;

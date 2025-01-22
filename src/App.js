import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Redirection from "./components/Redirection";
import Refresh from "./components/Refresh";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import UserUpdate from "./components/UserUpdate";
import ErrorPage from './components/ErrorPage';
import UserPasswordUpdate from "./components/UserPasswordUpdate";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/redirect" element={<Redirection />} />
          <Route path="/refresh" element={<Refresh />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user-update" element={<UserUpdate />} />
          <Route path="/error" element={<ErrorPage status={500} message="Something went wrong." />} />
          <Route path="*" element={<ErrorPage status={404} message="Page not found." />} />
          <Route path="/change-password" element={<UserPasswordUpdate />} />
        </Routes>
      </Router>
  );
};

export default App;

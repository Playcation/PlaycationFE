import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Redirection from "./components/Redirection";
import Refresh from "./components/Refresh";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import UserUpdate from "./components/UserUpdate";
import Main from "./components/main/Main";
import ErrorPage from './components/ErrorPage';
import UserPasswordUpdate from "./components/UserPasswordUpdate";
import OAuth2RedirectHandler from "./OAuth2RedirectHandler";
import UserDelete from "./components/UserDelete";

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
          <Route path="/main" element={<Main/>}/>
          <Route path="/error" element={<ErrorPage status={500} message="Something went wrong." />} />
          <Route path="*" element={<ErrorPage status={404} message="Page not found." />} />
          <Route path="/change-password" element={<UserPasswordUpdate />} />
          <Route path="/user-delete" element={<UserDelete />} />
          <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
  );
};

export default App;

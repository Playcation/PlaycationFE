import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/user/jsx/Login';
import Redirection from "./components/common/Redirection";
import Refresh from "./components/common/Refresh";
import Signup from "./components/user/jsx/Signup";
import UserProfile from "./components/user/jsx/UserProfile";
import UserUpdate from "./components/user/jsx/UserUpdate";
import Main from "./components/main/Main";
import ErrorPage from './components/error/ErrorPage';
import UserPasswordUpdate from "./components/user/jsx/UserPasswordUpdate";
import OAuth2RedirectHandler from "./components/common/OAuth2RedirectHandler";
import UserDelete from "./components/user/jsx/UserDelete";
import ErrorHandler from "./components/error/ErrorHandler";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
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
          <Route path="/error" element={<ErrorHandler apiEndpoint="http://localhost:8080/error" />} />
        </Routes>
      </Router>
  );
};

export default App;

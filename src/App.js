import React, { useEffect } from "react";

const LandingRedirect = () => {
  useEffect(() => {
    window.location.href = "/landing.html";
  }, []);
  return null;
};
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import Upgrade from "./pages/Upgrade";
import Chat from "./pages/Chat";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/chat/:matchId" element={<Chat />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

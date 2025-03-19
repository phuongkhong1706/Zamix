import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GuestMenu from "./components/guest/GuestMenu";
import GuestHomeTab from "./components/guest/tabs/HomeTab";
import Login from "./components/LogIn"; // Import trang đăng nhập
import Signup from "./components/SignUp";

function GuestLayout({ children }) {
  return (
    <div className="App">
      <GuestMenu />
      <div className="content">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Chuyển hướng mặc định từ "/" đến "/guest/home" */}
        <Route path="/" element={<Navigate to="/guest/home" replace />} />
        {/* Các trang có giao diện Guest */}
        <Route path="/guest/home" element={<GuestLayout> <GuestHomeTab /> </GuestLayout>}/>

        {/* Trang đăng nhập tách biệt, không có GuestMenu */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

export default App;

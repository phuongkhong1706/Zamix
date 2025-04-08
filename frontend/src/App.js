import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* Chức năng hệ thống */
import Login from "./components/LogIn"; // Import trang đăng nhập
import Signup from "./components/SignUp";

/* Chức năng khách */
import GuestMenu from "./components/guest/GuestMenu";
import GuestHomeTab from "./components/guest/tabs/GuestHomeTab";

/* Chức năng admin */

/* Chức năng student */
import StudentMenu from "./components/student/StudentMenu";
import StudentHomeTab from "./components/student/tabs/StudentHomeTab";
import StudentDoExam from "./components/student/tabs/StudentDoExam";

/* Chức năng teacher */


/* Định dạng trang web Guest (có menu) */
function GuestLayout({ children }) {
  return (
    <div className="App">
      <GuestMenu />
      <div className="content">{children}</div>
    </div>
  );
}

/* Định dạng trang web Admin (có menu) */

/* Định dạng trang web Student (có menu) */
function StudentLayout({ children }) {
  return (
    <div className="App">
      <StudentMenu />
      <div className="content">{children}</div>
    </div>
  );
}

/* Định dạng trang web Teacher (có menu) */

/*######################################################################################################################################### */

function App() {
  return (
    <Router>
      <Routes>
        {/* Chuyển hướng mặc định từ "/" đến "/guest/home" */}
        <Route path="/" element={<Navigate to="/guest/home" replace />} />
        {/* Các trang có giao diện Guest */}
        <Route path="/guest/home" element={<GuestLayout> <GuestHomeTab /> </GuestLayout>}/>

        {/* Trang đăng nhập tách biệt, không có GuestMenu */}
        <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Các trang giao diện Student */}
        <Route path="/student/home" element={<StudentLayout> <StudentHomeTab /> </StudentLayout>}/>
        <Route path="/student/do_exam" element={<StudentLayout> <StudentDoExam /> </StudentLayout>}/>

      </Routes>
    </Router>
  );
}

export default App;

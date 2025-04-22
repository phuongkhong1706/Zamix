import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* Chức năng hệ thống */
import Login from "./components/LogIn"; // Import trang đăng nhập
import Signup from "./components/SignUp";

/* Chức năng khách */
import GuestMenu from "./components/guest/GuestMenu";
import GuestHomeTab from "./components/guest/tabs/GuestHomeTab";

/* Chức năng admin */
import AdminMenu from "./components/admin/AdminMenu"
/* Chức năng student */
import StudentMenu from "./components/student/StudentMenu";
import StudentHomeTab from "./components/student/tabs/StudentHomeTab";
import StudentDoExam from "./components/student/tabs/doExam/StudentDoExam";
import StudentDoExamDetail from "./components/student/tabs/doExam/StudentDoExamDetail";
import StudentNewsTab from "./components/student/tabs/StudentNewsTab";

/* Chức năng teacher */
import TeacherMenu from "./components/teacher/TeacherMenu"
import TeacherHomeTab from "./components/teacher/tabs/TeacherHomeTab";
import TeacherExamManagement from "./components/teacher/tabs/exams/TeacherExamManagement";
import TeacherExamAdd from "./components/teacher/tabs/exams/TeacherExamAdd";
import TeacherExamCode from "./components/teacher/tabs/exams/TeacherExamCode";

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
function AdminLayout({ children }) {
  return (
    <div className="App">
      <AdminMenu />
      <div className="content">{children}</div>
    </div>
  );
}

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
function TeacherLayout({ children }) {
  return (
    <div className="App">
      <TeacherMenu />
      <div className="content">{children}</div>
    </div>
  );
}
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
        <Route path="/exam/:id" element={<StudentDoExamDetail />} />
        <Route path="/student/news" element={<StudentLayout> <StudentNewsTab /> </StudentLayout>}/>

        {/* Các trang giao diện Teacher */}
        <Route path="/teacher/home" element={<TeacherLayout> <TeacherHomeTab /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management" element={<TeacherLayout> <TeacherExamManagement /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management/exam_add" element={<TeacherLayout> <TeacherExamAdd /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management/exam_add/exam_code" element={<TeacherExamCode />} />
      </Routes>
    </Router>
  );
}

export default App;

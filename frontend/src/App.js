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
import StudentDoExam from "./components/student/tabs/doExam/StudentDoExam";
import StudentDoExamDetail from "./components/student/tabs/doExam/StudentDoExamDetail";
import StudentRule from "./components/student/tabs/rules/StudentRule";
import StudentPractice from "./components/student/tabs/practice/StudentPractice";
import StudentStatistics from "./components/student/tabs/result/evaluate/StudentStatistics";
import StudentVerifyExam from "./components/student/tabs/doExam/StudentVerifyExam";
import StudentVerifyPractice from "./components/student/tabs/practice/StudentVerifyPractice";
import StudentPracticeDetail from "./components/student/tabs/practice/StudentPracticeDetail";
import StudentPracticeReview from "./components/student/tabs/practice/StudentPracticeReview"
import StudentScoreExam from "./components/student/tabs/result/score/StudentScoreExam"
import StudentScoreReviewExam from "./components/student/tabs/result/score/StudentScoreReviewExam";
import StudentScoreRemarkExam from "./components/student/tabs/result/score/StudentScoreRemarkExam";

/* Chức năng teacher */
import TeacherMenu from "./components/teacher/TeacherMenu"
import TeacherHomeTab from "./components/teacher/tabs/TeacherHomeTab";
import TeacherExamManagement from "./components/teacher/tabs/exams/TeacherExamManagement";
import TeacherExamAdd from "./components/teacher/tabs/exams/TeacherExamAdd";
import TeacherExamCode from "./components/teacher/tabs/exams/TeacherExamCode";
import TeacherDocument from "./components/teacher/tabs/documents/TeacherDocument"
import TeacherRule from "./components/teacher/tabs/rules/TeacherRule"
import TeacherScoreExam from "./components/teacher/tabs/result/score/TeacherScoreExam"
import TeacherScoreReviewExam from "./components/teacher/tabs/result/score/TeacherScoreReviewExam";
import TeacherScoreRemarkExam from "./components/teacher/tabs/result/score/TeacherScoreRemarkExam";
import TeacherStatistics from "./components/teacher/tabs/result/evaluate/TeacherStatistics";
import TeacherQuestionManagement from "./components/teacher/tabs/exams/TeacherQuestionManagement";
/* Định dạng trang web Guest (có menu) */
function GuestLayout({ children }) {
  return (
    <div className="App">
      <GuestMenu />
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
        <Route path="/student/do_exam/verify_exam/:id" element={<StudentLayout> <StudentVerifyExam /> </StudentLayout>}/>
        <Route path="/student/do_exam/:id" element={<StudentDoExamDetail />} />
        <Route path="/student/rules" element={<StudentLayout> <StudentRule/> </StudentLayout>} />
        <Route path="/student/practice" element={<StudentLayout> <StudentPractice /> </StudentLayout>}/>
        <Route path="/student/practice/verify_practice" element={<StudentLayout> <StudentVerifyPractice /> </StudentLayout>}/>
        <Route path="/student/practice/do_practice/:id" element={<StudentPracticeDetail />}/>
        <Route path="/student/practice/review" element={<StudentPracticeReview />}/>
        <Route path="/student/result/score" element={<StudentLayout> <StudentScoreExam /> </StudentLayout>}/>
        <Route path="/student/result/score/review_exam" element={<StudentLayout> <StudentScoreReviewExam /> </StudentLayout>}/>
        <Route path="/student/result/score/remark_exam" element={<StudentLayout> <StudentScoreRemarkExam /> </StudentLayout>}/>
        <Route path="/student/result/statistics" element={<StudentLayout> <StudentStatistics /> </StudentLayout>}/>


        {/* Các trang giao diện Teacher */}
        <Route path="/teacher/home" element={<TeacherLayout> <TeacherHomeTab /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management" element={<TeacherLayout> <TeacherExamManagement /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management/exam_add" element={<TeacherLayout> <TeacherExamAdd /> </TeacherLayout>}/>
        <Route path="/teacher/exams/exam_management/exam_add/:examId" element={<TeacherLayout> <TeacherExamAdd /> </TeacherLayout>} />
        <Route path="/teacher/exams/exam_management/exam_add/exam_code/:testId" element={<TeacherExamCode />} />
        <Route path="/teacher/exams/exam_management/exam_add/exam_code/" element={<TeacherExamCode />} />
        <Route path="/teacher/documents" element={<TeacherLayout> <TeacherDocument /> </TeacherLayout>} />
        <Route path="/teacher/rules" element={<TeacherLayout> <TeacherRule/> </TeacherLayout>} />
        <Route path="/teacher/result/score" element={<TeacherLayout> <TeacherScoreExam /> </TeacherLayout>}/>
        <Route path="/teacher/result/score/review_exam" element={<TeacherLayout> <TeacherScoreReviewExam /> </TeacherLayout>}/>
        <Route path="/teacher/result/score/remark_exam" element={<TeacherLayout> <TeacherScoreRemarkExam /> </TeacherLayout>}/>
        <Route path="/teacher/result/statistics" element={<TeacherLayout> <TeacherStatistics /> </TeacherLayout>}/>
        <Route path="/teacher/exams/question_bank" element={<TeacherLayout> <TeacherQuestionManagement /> </TeacherLayout>}/>
      </Routes>
    </Router>
  );
}

export default App;

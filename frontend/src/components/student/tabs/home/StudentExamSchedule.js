// ExamSchedule.js
import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';
import '../../../../styles/student/StudentHomeTab/StudentExamSchedule.css';

const ExamSchedule = () => {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "Algebra II - Quadratic Equations",
      date: "May 15, 2025",
      time: "10:00 AM",
      duration: "60 phút",
      badge: "Tomorrow",
      badgeType: "tomorrow"
    },
    {
      id: 2,
      title: "Geometry - Trigonometric Functions",
      date: "May 18, 2025",
      time: "1:30 PM",
      duration: "45 phút",
      badge: "In 3 days",
      badgeType: "days"
    },
    {
      id: 3,
      title: "Chemistry - Organic Compounds",
      date: "May 22, 2025",
      time: "9:15 AM",
      duration: "90 phút",
      badge: "In 1 week",
      badgeType: "week"
    },
    {
      id: 4,
      title: "Physics - Electromagnetic Waves",
      date: "May 25, 2025",
      time: "2:00 PM",
      duration: "75 phút",
      badge: "In 10 days",
      badgeType: "later"
    },
    {
      id: 5,
      title: "Biology - Cell Structure & Function",
      date: "May 29, 2025",
      time: "11:30 AM",
      duration: "60 phút",
      badge: "In 2 weeks",
      badgeType: "later"
    },
    {
      id: 6,
      title: "English Literature - Shakespeare Analysis",
      date: "June 1, 2025",
      time: "3:45 PM",
      duration: "120 phút",
      badge: "In 17 days",
      badgeType: "later"
    }
  ]);

  const getBadgeStyles = (badgeType) => {
    const styles = {
      tomorrow: 'student-examschedule-badge-red',
      days: 'student-examschedule-badge-orange',
      week: 'student-examschedule-badge-blue',
      later: 'student-examschedule-badge-gray'
    };
    return styles[badgeType] || styles.later;
  };

  return (
    <div className="student-examschedule-container">
      <div className="student-examschedule-header">
        <div className="student-examschedule-header-left">
          <BookOpen className="student-examschedule-icon" />
          <h1 className="student-examschedule-title">Kỳ thi sắp diễn ra</h1>
        </div>
        <button className="student-examschedule-view-all">
          Xem tất cả <ChevronRight className="student-examschedule-chevron" />
        </button>
      </div>

      {/* Exam List */}
      <div className="student-examschedule-exam-grid">
        {exams.map((exam) => (
          <div key={exam.id} className="student-examschedule-exam-card">
            <div className="student-examschedule-exam-top">
              <span className={`student-examschedule-badge ${getBadgeStyles(exam.badgeType)}`}>
                {exam.badge}
              </span>
            </div>
            <h3 className="student-examschedule-exam-title">{exam.title}</h3>
            <div className="student-examschedule-exam-details">
              <div><Calendar /> {exam.date} • {exam.time}</div>
              <div><Clock /> Thời gian làm bài: {exam.duration}</div>
            </div>
            <div className="student-examschedule-progress-section">
              <div className="student-examschedule-progress-labels">
                <span>Tiến trình luyện tập</span>
                <span>75%</span>
              </div>
              <div className="student-examschedule-progress-bar">
                <div className="student-examschedule-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamSchedule;

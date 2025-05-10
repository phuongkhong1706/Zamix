import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../../../styles/CountdownTimer.css";
import "../../../../styles/SidebarNavigation.css";

function CountdownTimer({ durationInSeconds, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    if (!durationInSeconds || isNaN(durationInSeconds)) return;

    const start = Date.now();
    const end = start + durationInSeconds * 1000;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((end - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onEnd?.();
      }
    };

    tick(); // Cập nhật ngay khi bắt đầu
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []); // 👈 để [] để chỉ chạy 1 lần khi mount

  const percentage = ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="countdown-container">
      <div className="countdown-text">{formatTime(timeLeft)}</div>
      <div className="countdown-fill" style={{ width: `${100 - percentage}%` }} />
    </div>
  );
}

function StudentPracticeDetail() {
  const { id } = useParams();
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const questionRefs = useRef([]);

    useEffect(() => {
  // Giả lập dữ liệu từ API sau 1 giây
  const mockData = {
    exam_title: "Đề Thi Thử Lập Trình Căn Bản",
    duration: 300, // 5 phút
    questions: [
      {
        id_question: 1,
        content: "Ngôn ngữ lập trình nào sau đây được sử dụng phổ biến trong phát triển web?",
        option_a: "Python",
        option_b: "C++",
        option_c: "HTML",
        option_d: "Java",
      },
      {
        id_question: 2,
        content: "React là thư viện dùng cho:",
        option_a: "Back-end",
        option_b: "Front-end",
        option_c: "Database",
        option_d: "AI",
      },
      {
        id_question: 3,
        content: "Lệnh nào dùng để khai báo biến trong JavaScript?",
        option_a: "`var`",
        option_b: "`int`",
        option_c: "`string`",
        option_d: "`const`",
      },
    ],
  };

  const timer = setTimeout(() => {
    setExamData(mockData);
  }, 1000);

  return () => clearTimeout(timer);
}, [id]);


  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  if (!examData) return <div style={{ marginTop: "40px" }}>Đang tải đề thi...</div>;

  return (
    <div style={{ display: "flex", padding: "20px", marginTop: "40px" }}>
      {/* MAIN CONTENT - Câu hỏi */}
      <div style={{ flex: 1, paddingRight: "280px" }}>
        <h2>{examData.exam_title}</h2>
        <hr />
        {examData.questions && examData.questions.map((q, index) => (
          <div
            key={q.id_question || index}
            ref={(el) => (questionRefs.current[index] = el)}
            style={questionStyle}
          >
            <p><strong>Câu {index + 1}:</strong> {q.content}</p>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {["A", "B", "C", "D"].map((option) => (
                <li key={option} style={{ marginBottom: "6px" }}>
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      style={{ marginRight: "8px" }}
                    />
                    {option}. {q[`option_${option.toLowerCase()}`]}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-container">
        <CountdownTimer
          durationInSeconds={examData.duration}
          onEnd={() => alert("⏰ Hết giờ làm bài!")}
        />

        <button className="sidebar-submit-btn">NỘP BÀI</button>

        <p className="sidebar-warning">
          Khôi phục/lưu bài làm &gt;
        </p>
        <p className="sidebar-note">
          Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu review
        </p>

        <div className="sidebar-question-list">
          <h4>Danh sách câu hỏi</h4>
          <div className="sidebar-question-buttons">
            {examData.questions.map((_, index) => (
              <button
                key={index}
                className={`sidebar-question-button ${answers[index] ? "answered" : ""}`}
                onClick={() => {
                  questionRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const questionStyle = {
  marginBottom: "20px",
  padding: "12px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default StudentPracticeDetail;

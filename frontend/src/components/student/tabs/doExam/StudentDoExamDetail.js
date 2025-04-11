import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Component đếm ngược
function CountdownTimer({ durationInSeconds, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    if (!durationInSeconds) return;

    setTimeLeft(durationInSeconds); // Đặt lại giá trị mỗi lần đổi đề

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onEnd?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationInSeconds, onEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e74c3c", marginBottom: "16px" }}>
      ⏳ Thời gian còn lại: {formatTime(timeLeft)}
    </div>
  );
}

function StudentDoExamDetail() {
  const { id } = useParams();
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/student/do_exam/exams/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setExamData(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu kỳ thi:", err);
      });
  }, [id]);

  if (!examData) return <div>Đang tải đề thi...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{examData.exam_title}</h2>

      <CountdownTimer
        durationInSeconds={parseInt(examData.duration, 10)}
        onEnd={() => alert("⏰ Hết giờ làm bài!")}
      />

      <hr />
      {examData.questions.map((q, index) => (
        <div key={q.id_question} style={questionStyle}>
          <p><strong>Câu {index + 1}:</strong> {q.content}</p>
          <ul>
            <li>A. {q.option_a}</li>
            <li>B. {q.option_b}</li>
            <li>C. {q.option_c}</li>
            <li>D. {q.option_d}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

const questionStyle = {
  marginBottom: "20px",
  padding: "12px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default StudentDoExamDetail;

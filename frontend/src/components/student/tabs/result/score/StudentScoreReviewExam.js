import React, { useEffect, useRef, useState } from "react";
import "../../../../../styles/CountdownTimer.css";
import "../../../../../styles/SidebarNavigation.css";

function StudentScoreReviewExam() {
  const [reviewData, setReviewData] = useState(null);
  const questionRefs = useRef([]);

  useEffect(() => {
    const mockReviewData = {
      score: 8.5,
      wrongCount: 1,
      questions: [
        {
          id_question: 1,
          content: "Ngôn ngữ lập trình nào sau đây được sử dụng phổ biến trong phát triển web?",
          option_a: "Python",
          option_b: "C++",
          option_c: "HTML",
          option_d: "Java",
          correct_answer: "C",
          student_answer: "C",
          explanation: "HTML là ngôn ngữ đánh dấu, không phải lập trình, nhưng rất phổ biến cho giao diện web.",
        },
        {
          id_question: 2,
          content: "React là thư viện dùng cho:",
          option_a: "Back-end",
          option_b: "Front-end",
          option_c: "Database",
          option_d: "AI",
          correct_answer: "B",
          student_answer: "A",
          explanation: "React là thư viện JavaScript mạnh mẽ dùng để xây dựng giao diện người dùng (UI) phía Front-end.",
        },
        {
          id_question: 3,
          content: "Lệnh nào dùng để khai báo biến trong JavaScript?",
          option_a: "var",
          option_b: "int",
          option_c: "string",
          option_d: "const",
          correct_answer: "D",
          student_answer: "D",
          explanation: "`const` được sử dụng để khai báo biến không thể thay đổi giá trị sau khi gán.",
        },
      ],
    };

    setTimeout(() => {
      setReviewData(mockReviewData);
    }, 1000);
  }, []);

  if (!reviewData) return <div style={{ marginTop: "40px" }}>Đang tải kết quả...</div>;

  return (
    <div style={{ display: "flex", padding: "20px", marginTop: "40px" }}>
      {/* SIDEBAR */}
      <div className="sidebar-container">
        <h2 style={{ marginBottom: "20px" }}>Chi tiết bài làm</h2>

        <div style={{ marginBottom: "10px" }}>
          <p><strong>Điểm:</strong> {reviewData.score}</p>
          <p><strong>Số câu sai:</strong> {reviewData.wrongCount}</p>
        </div>

        <div className="sidebar-question-list">
          <h4>Danh sách câu hỏi</h4>
          <div className="sidebar-question-buttons">
            {reviewData.questions.map((q, index) => {
              const isCorrect = q.student_answer === q.correct_answer;
              return (
                <button
                  key={index}
                  className="sidebar-question-button"
                  onClick={() => {
                    questionRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  style={{
                    backgroundColor: isCorrect ? "#4CAF50" : "#f44336",
                    color: "white",
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Danh sách câu hỏi */}
      <div style={{ width: "calc(100% - 340px)", paddingLeft: "30px" }}>
        {reviewData.questions.map((q, index) => {
          const isCorrect = q.student_answer === q.correct_answer;
          return (
            <div
              key={q.id_question || index}
              ref={(el) => (questionRefs.current[index] = el)}
              style={questionStyle}
            >
              <p><strong>Câu {index + 1}:</strong> {q.content}</p>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {["A", "B", "C", "D"].map((option) => {
                  const selected = q.student_answer === option;
                  const isAnswerCorrect = q.correct_answer === option;
                  const color = selected
                    ? isAnswerCorrect
                      ? "green"
                      : "red"
                    : undefined;

                  return (
                    <li key={option} style={{ marginBottom: "6px", color }}>
                      <label style={{ cursor: "default" }}>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={option}
                          checked={selected}
                          readOnly
                          style={{ marginRight: "8px" }}
                        />
                        {option}. {q[`option_${option.toLowerCase()}`]}
                      </label>
                    </li>
                  );
                })}
              </ul>
              {/* Khung Đáp án đúng */}
              {!isCorrect && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Đáp án đúng: <span style={{ color: "black", fontWeight: "normal" }}>{q.correct_answer}</span>
                </p>
              )}
              {/* Khung Lời giải */}
              {q.explanation && (
                <div style={explanationStyle}>
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    Lời giải: <span style={{ color: "black", fontWeight: "normal" }}>{q.explanation}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
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

const explanationStyle = {
  marginTop: "10px",
  padding: "12px",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  borderLeft: "4px solid green",
};

export default StudentScoreReviewExam;

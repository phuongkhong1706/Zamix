import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ lấy test_id
import "../../../../../styles/CountdownTimer.css";
import "../../../../../styles/SidebarNavigation.css";

function StudentScoreReviewExam() {
  const { testId } = useParams(); // ✅ lấy test_id từ URL
  const [reviewData, setReviewData] = useState(null);
  const questionRefs = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewData() {
      try {
        setLoading(true);
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          alert("❌ Người dùng chưa đăng nhập.");
          return;
        }
        const { token } = JSON.parse(userJson);

        const response = await fetch(
          `http://127.0.0.1:8000/api/student/student_result/student_review_exam/${testId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`❌ Fetch error: ${await response.text()}`);

        const data = await response.json();
        console.log("📥 Dữ liệu review trả về:", data); // Xem log

        setReviewData({
          score: data.total_score,
          wrongCount: data.num_wrong,
          questions: data.review_data,
        });
      } catch (error) {
        alert(error.message || "❌ Không thể lấy thông tin bài làm.");
      } finally {
        setLoading(false);
      }
    }

    fetchReviewData();
  }, [testId]);

  if (loading) return <div style={{ marginTop: "40px" }}>Đang tải kết quả...</div>;
  if (!reviewData) return null; // tránh lỗi undefined

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

      {/* MAIN CONTENT */}
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
                  const color = selected ? (isAnswerCorrect ? "green" : "red") : undefined;

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

              {!isCorrect && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Đáp án đúng:{" "}
                  <span style={{ color: "black", fontWeight: "normal" }}>{q.correct_answer}</span>
                </p>
              )}

              {q.explanation && (
                <div style={explanationStyle}>
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    Lời giải:{" "}
                    <span style={{ color: "black", fontWeight: "normal" }}>{q.explanation}</span>
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

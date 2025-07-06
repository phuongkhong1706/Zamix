import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../../styles/CountdownTimer.css";
import { renderWithLatex } from "./../../../teacher/tabs/exams/LatexInputKaTeX";

function CountdownTimer({ durationInSeconds, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds * 60);

  useEffect(() => {
    if (!durationInSeconds || isNaN(durationInSeconds)) return;
    const end = Date.now() + durationInSeconds * 60 * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((end - now) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onEnd?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [durationInSeconds, onEnd]);

  const percentage = ((durationInSeconds * 60 - timeLeft) / (durationInSeconds * 60)) * 100;
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

export default function StudentPracticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 id chính là test_id
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const handleSubmitExamRef = useRef();
  const questionRefs = useRef([]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitExam = useCallback(async () => {
    if (!examData) return alert("❌ Không thể gửi bài.");
    const userJson = localStorage.getItem("user");
    if (!userJson) return alert("❌ Người dùng chưa đăng nhập.");

    const { token, user_id: studentId } = JSON.parse(userJson);
    const formattedAnswers = examData.questions.map((q, index) => ({
      question_id: q.question_id,
      selected_option: answers[index] || null,
    }));

    const submissionData = {
      test_id: id,
      student_id: studentId,
      answers: formattedAnswers,
      start_time: startTime,
      end_time: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/student/student_test/student_do_exam/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(submissionData),
        }
      );
      if (!res.ok) throw new Error(await res.text());

      const scoreRes = await fetch(
        `http://127.0.0.1:8000/api/student/student_test/student_do_exam/?student_id=${studentId}&test_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!scoreRes.ok) throw new Error(await scoreRes.text());

      const scoreData = await scoreRes.json();
      navigate("/student/do_exam/result_exam", {
        state: {
          correctAnswers: scoreData.correct_answers,
          totalQuestions: scoreData.total_questions,
          examName: examData.exam_name || "Tên đề thi",
        },
      });
    } catch (err) {
      alert("❌ Gửi bài thất bại hoặc không thể lấy kết quả.");
    }
  }, [examData, answers, id, navigate, startTime]);

  useEffect(() => {
    handleSubmitExamRef.current = handleSubmitExam;
  }, [handleSubmitExam]);

  const onEndHandler = useCallback(() => {
    alert("⏰ Hết giờ làm bài!");
    handleSubmitExamRef.current?.();
  }, []);

  useEffect(() => {
    async function fetchExamDetail() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/student/student_test/student_detail_test/${id}/`
        );
        const data = await res.json();
        if (!data?.questions?.length) {
          alert("⚠️ Đề thi không có câu hỏi.");
          return;
        }
        setExamData(data);
        setStartTime(new Date().toISOString());
      } catch (err) {
        alert("❌ Không thể tải đề thi.");
      }
    }

    if (id) fetchExamDetail();
  }, [id]);

  if (!examData) return <div style={{ marginTop: "40px" }}>Đang tải đề thi...</div>;

  return (
    <div style={{ display: "flex", padding: "20px", marginTop: "40px" }}>
      <div style={{ flex: 1, paddingRight: "280px" }}>
        <h2>{examData.exam_title}</h2>
        <hr />
        {examData.questions.map((q, index) => (
          <div
            key={q.question_id || index}
            ref={(el) => (questionRefs.current[index] = el)}
            style={questionStyle}
          >
            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content || '')}</p>

            {q.image && (
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <img
                  src={`http://localhost:8000${q.image}`}
                  alt="Hình ảnh câu hỏi"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    margin: '10px auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.error("Lỗi ảnh:", e.target.src);
                  }}
                />
              </div>
            )}

            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {Array.isArray(q.answers) && q.answers.length >= 2 ? (
                q.answers.map((answer, idx) => {
                  const optionLabel = String.fromCharCode(65 + idx); // A, B, C,...
                  return (
                    <li key={answer.answer_id} style={{ marginBottom: "6px" }}>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value={optionLabel}
                          checked={answers[index] === optionLabel}
                          onChange={() => handleAnswerChange(index, optionLabel)}
                          style={{ marginRight: "8px" }}
                        />
                        <span><strong>{optionLabel}.</strong> {renderWithLatex(answer.content || '')}</span>
                      </label>
                    </li>
                  );
                })
              ) : (
                <li>
                  <input
                    type="text"
                    placeholder="Nhập đáp án đúng"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-container">
        <CountdownTimer
          durationInSeconds={examData.duration_minutes}
          onEnd={onEndHandler}
        />
        <button className="sidebar-submit-btn" onClick={handleSubmitExam}>NỘP BÀI</button>
        <p className="sidebar-warning">Khôi phục/lưu bài làm &gt;</p>
        <p className="sidebar-note">Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu review</p>
        <div className="sidebar-question-list">
          <h4>Danh sách câu hỏi</h4>
          <div className="sidebar-question-buttons">
            {examData.questions.map((_, index) => (
              <button
                key={index}
                className={`sidebar-question-button ${answers[index] ? "answered" : ""}`}
                onClick={() =>
                  questionRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
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

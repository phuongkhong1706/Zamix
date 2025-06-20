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

export default function StudentDoExamDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [chosenTestId, setChosenTestId] = useState(null);
  const handleSubmitExamRef = useRef();
  const questionRefs = useRef([]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitExam = useCallback(async () => {
    if (!examData || !chosenTestId) {
      alert("❌ Không thể gửi bài.");
      return;
    }
    const userJson = localStorage.getItem("user");
    if (!userJson) return alert("❌ Người dùng chưa đăng nhập.");
    const { token, user_id: studentId } = JSON.parse(userJson);
    const formattedAnswers = examData.questions.map((q, index) => ({
      question_id: q.question_id,
      selected_option: answers[index] || null,
    }));
    const submissionData = { test_id: chosenTestId, student_id: studentId, answers: formattedAnswers };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/student_test/student_do_exam/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(submissionData),
      });
      if (!res.ok) throw new Error(await res.text());
      const scoreRes = await fetch(`http://127.0.0.1:8000/api/student/student_test/student_do_exam/?student_id=${studentId}&test_id=${chosenTestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!scoreRes.ok) throw new Error(await scoreRes.text());
      const scoreData = await scoreRes.json();
      navigate("/student/do_exam/result_exam", {
        state: {
          correctAnswers: scoreData.correct_answers,
          totalQuestions: scoreData.total_questions,
          examName: examData.exam_name || "Tên đề thi",
        },
      });
    } catch (error) {
      alert("❌ Gửi bài thất bại hoặc không thể lấy kết quả.");
    }
  }, [examData, chosenTestId, answers, navigate]);

  useEffect(() => {
    handleSubmitExamRef.current = handleSubmitExam;
  }, [handleSubmitExam]);

  const onEndHandler = useCallback(() => {
    alert("⏰ Hết giờ làm bài!");
    handleSubmitExamRef.current?.();
  }, []);
  useEffect(() => {
    // Kiểm soát chỉ cho phép 1 tab thi hoạt động
    if (!window.name) {
      window.name = `exam_tab_${Date.now()}`;
    }

    localStorage.setItem("examTabActive", window.name);

    /*
    const handleViolation = () => {
      const now = Date.now();
      // Nếu lần vi phạm trước < 1.5 giây thì bỏ qua
      if (now - lastViolationTimeRef.current < 1500) return;
  
      lastViolationTimeRef.current = now;
  
      setViolationCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          alert("🚨 Bạn đã vi phạm quá 3 lần. Bài thi sẽ được nộp tự động!");
          setTimeout(() => {
            handleSubmitExamRef.current?.();
          }, 3000);
        } else {
          alert(`⚠️ Phát hiện vi phạm (${newCount}/3)`);
        }
        return newCount;
      });
    };
  
    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };
  
    const handleBlur = () => {
      handleViolation();
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      localStorage.removeItem("examTabActive");
    };
    */

    return () => {
      localStorage.removeItem("examTabActive");
    };
  }, []);


  useEffect(() => {
    async function fetchExamData() {
      const savedSession = localStorage.getItem("examSession");
      let cachedData = null;

      if (savedSession) {
        const { testId, examData } = JSON.parse(savedSession);
        cachedData = examData?.questions?.length ? { testId, examData } : null;
      }

      // 1️⃣ FETCH DỮ LIỆU SERVER
      const res = await fetch(`http://127.0.0.1:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_test/${id}/`);
      const testList = await res.json();
      const validTests = testList.filter((test) => test && test.test_id);
      const testId = validTests[Math.floor(Math.random() * validTests.length)]?.test_id;

      if (!testId) {
        alert("❌ Không có đề thi!");
        localStorage.removeItem("examSession");
        return;
      }

      const detailRes = await fetch(`http://127.0.0.1:8000/api/student/student_test/student_detail_test/${testId}/`);
      const serverData = await detailRes.json();

      if (!serverData?.questions?.length) {
        alert("⚠️ Đề thi không có câu hỏi nào.");
        localStorage.removeItem("examSession");
        return;
      }

      // 2️⃣ SO SÁNH SERVER vs CACHE
      if (!cachedData || JSON.stringify(cachedData.examData) !== JSON.stringify(serverData)) {
        console.log("✅ Server khác cache --> Cập nhật cache");
        localStorage.setItem("examSession", JSON.stringify({ testId, examData: serverData }));
        setChosenTestId(testId);
        setExamData(serverData);
      } else {
        console.log("✅ Cache còn mới, sử dụng cache");
        setChosenTestId(cachedData.testId);
        setExamData(cachedData.examData);
      }
    }

    if (id) {
      fetchExamData();
    }
  }, [id]);




  if (!examData) return <div style={{ marginTop: "40px" }}>Đang tải đề thi...</div>;

  return (
    <div style={{ display: "flex", padding: "20px", marginTop: "40px" }}>
      <div style={{ flex: 1, paddingRight: "280px" }}>
        <h2>{examData.exam_title}</h2>
        <hr />
        {examData.questions?.map((q, index) => (
          <div
            key={q.question_id || index}
            ref={(el) => (questionRefs.current[index] = el)}
            style={questionStyle}
          >
            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content || '')}</p>
            {q.image && (
              <div style={{
                textAlign: 'center',
                margin: '15px 0',
                padding: '10px'
              }}>
                <img
                  src={`http://localhost:8000${q.image}`}
                  alt="Hình ảnh câu hỏi"
                  style={{
                    maxWidth: '100%',        // ✅ Giảm kích thước xuống 50%
                    width: '100%',           // ✅ Đảm bảo ảnh luôn 50% kích thước gốc
                    height: 'auto',         // Giữ tỷ lệ khung hình
                    marginTop: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'block',       // Đảm bảo ảnh hiển thị như block element
                    margin: '10px auto'     // Center ảnh
                  }}
                  onError={(e) => {
                    console.error('Lỗi tải ảnh:', e.target.src);
                    e.target.style.display = 'none';
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
                        <span>
                          <strong>{optionLabel}.</strong> {renderWithLatex(answer.content || '')}
                        </span>
                      </label>
                    </li>
                  );
                })
              ) : (
                <li>
                  <label className="exam-form-label" htmlFor={`manual_answer_${index}`}>
                    Điền đáp án đúng:
                  </label>
                  <input
                    type="text"
                    id={`manual_answer_${index}`}
                    name={`manual_answer_${index}`}
                    className="exam-form-input"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Nhập đáp án đúng"
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

        <button className="sidebar-submit-btn" onClick={handleSubmitExam}>
          NỘP BÀI
        </button>

        <p className="sidebar-warning">Khôi phục/lưu bài làm &gt;</p>
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
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../../../../styles/CountdownTimer.css";

function CountdownTimer({ durationInSeconds, onEnd }) {
  durationInSeconds = durationInSeconds * 60;
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

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [durationInSeconds, onEnd]);

  const percentage = ((durationInSeconds - timeLeft) / durationInSeconds) * 100;

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
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

function StudentDoExamDetail() {
  const { id } = useParams();
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const questionRefs = useRef([]);
  const [chosenTestId, setChosenTestId] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_test/${id}/`);
        const testList = await res.json();

        const validTests = testList.filter(test => test && test.test_id);
        const randomIndex = Math.floor(Math.random() * validTests.length);
        const testId = validTests[randomIndex].test_id;

        setChosenTestId(testId);

        const detailRes = await fetch(`http://127.0.0.1:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}/`);
        const detailData = await detailRes.json();
        console.log("📝 Test Detail Response:", detailData);
        setExamData(detailData);
      } catch (err) {
        console.error("❌ Lỗi khi lấy đề thi:", err);
      }
    };

    fetchExam();
  }, [id]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const onEndHandler = useCallback(() => {
    alert("⏰ Hết giờ làm bài!");
  }, []);

  const handleSubmitExam = async () => {
    if (!examData || !chosenTestId) {
      alert("❌ Không thể gửi bài vì chưa có dữ liệu đề thi.");
      return;
    }

    const formattedAnswers = examData.questions.map((question, index) => ({
      question_id: question.question_id,
      selected_option: answers[index] || null,
    }));

    const submissionData = {
      test_id: chosenTestId,
      student_id: 1, // hoặc lấy từ context/login nếu có
      answers: formattedAnswers,
    };

    console.log("📤 Gửi dữ liệu nộp bài:", submissionData);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/student/submit_exam/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        throw new Error(`Server trả về lỗi: ${res.status}`);
      }

      const result = await res.json();
      alert("✅ Bài thi đã được nộp thành công!");
      console.log("📦 Kết quả từ server:", result);
    } catch (err) {
      console.error("❌ Lỗi khi gửi bài thi:", err);
      alert("❌ Gửi bài thất bại. Vui lòng thử lại.");
    }
  };

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
            <p><strong>Câu {index + 1}:</strong> {q.content}</p>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {q.answers?.map((answer, idx) => {
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C,...
                return (
                  <li key={answer.answer_id} style={{ marginBottom: "6px" }}>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="radio"
                        name={`question_${index}`}
                        value={optionLabel}
                        checked={answers[index] === optionLabel}
                        onChange={() => handleAnswerChange(index, optionLabel)}
                        style={{ marginRight: "8px" }}
                      />
                      {optionLabel}. {answer.content}
                    </label>
                  </li>
                );
              })}
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

export default StudentDoExamDetail;

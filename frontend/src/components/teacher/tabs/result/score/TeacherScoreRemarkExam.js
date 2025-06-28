import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TeacherScoreRemarkExam() {
  const { studentId, testId } = useParams(); // ✅ Lấy cả testId và studentId từ URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    className: "",
    dob: "",
    examDate: "",
    currentScore: "",
    remarkReason: "",
  });

  const [examData, setExamData] = useState({
    title: "",
    type: "",
    time_start: "",
    time_end: "",
    duration: 0,
  });

  useEffect(() => {
    async function fetchRemarkInfo() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/student/student_result/student_remark_exam/${studentId}/?user_id=${testId}`
        );

        if (!response.ok) {
          throw new Error(`❌ Lỗi lấy thông tin: ${response.statusText}`);
        }

        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          fullName: data.studentInfo.fullName,
          className: data.studentInfo.className,
          dob: data.studentInfo.dob,
          examDate: data.examInfo.timeStart,
          currentScore: data.examInfo.score,
          remarkReason: data.remarkReasonDefault,
        }));

        setExamData({
          title: data.examInfo.title,
          type: data.examInfo.type,
          time_start: data.examInfo.timeStart,
          time_end: data.examInfo.timeEnd,
          duration: data.examInfo.duration,
        });
      } catch (error) {
        console.error(error);
        alert(error.message || "❌ Không thể tải thông tin phúc tra");
      }
    }

    fetchRemarkInfo();
  }, [testId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatTime = (timeStr) => new Date(timeStr).toLocaleString("vi-VN");

  const handleSubmit = async () => {
  const confirmed = window.confirm(
    "⚠️ Bạn có chắc chắn cập nhật phúc tra cho học sinh này không?"
  );
  if (!confirmed) return;

  const userJson = localStorage.getItem("user");
  if (!userJson) {
    alert("❌ Người dùng chưa đăng nhập.");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/teacher/teacher_result/teacher_remark_exam/${studentId}/${testId}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          currentScore: formData.currentScore,
          remarkReason: formData.remarkReason,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "❌ Không thể gửi phúc tra");
    }

    alert(`✅ Gửi phúc tra thành công (ID ${data.data.id})!`);
    navigate("/teacher/result/score");
  } catch (error) {
    console.error(error);
    alert(error.message || "❌ Không thể gửi phúc tra");
  }
};


  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={infoWrapperStyle}>
          {/* Phúc tra */}
          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin phúc tra</h3>

            <div style={inputGroup}>
              <label>Họ và tên:</label>
              <input type="text" value={formData.fullName} readOnly style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>Lớp:</label>
              <input type="text" value={formData.className} readOnly style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>Ngày sinh:</label>
              <input type="date" value={formData.dob} readOnly style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>Ngày thi:</label>
              <input type="date" value={formData.examDate} readOnly style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>Điểm cập nhật:</label>
              <textarea
                name="currentScore" // ✅ Thêm name để cập nhật đúng field trong formData
                value={formData.currentScore}
                onChange={handleChange} // ✅ Cho phép nhập
                rows="2"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <div style={inputGroup}>
              <label>Lý do:</label>
              <textarea
                name="remarkReason"
                value={formData.remarkReason}
                onChange={handleChange}
                rows="4"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <button onClick={handleSubmit} style={submitButtonStyle}>Cập nhật</button>
          </div>

          {/* Thông tin kỳ thi */}
          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin kỳ thi</h3>
            <p><strong>Tiêu đề:</strong> {examData.title}</p>
            <p><strong>Loại:</strong> {examData.type === "Thi thử" ? "Giữa kỳ" : "Cuối kỳ"}</p>
            <p><strong>Bắt đầu:</strong> {formatTime(examData.time_start)}</p>
            <p><strong>Kết thúc:</strong> {formatTime(examData.time_end)}</p>
            <p><strong>Thời gian làm bài:</strong> {examData.duration} phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "50px",
  fontFamily: "Arial",
};

const mainCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "30px",
  width: "1000px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const infoWrapperStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "30px",
};

const boxStyle = {
  backgroundColor: "#f0f4ff",
  borderRadius: "16px",
  padding: "20px",
  flex: 1,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const sectionTitleStyle = {
  marginBottom: "16px",
  color: "#0b3d91",
  borderBottom: "2px solid #0b3d91",
  paddingBottom: "6px",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "12px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "4px",
};

const submitButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#0b3d91",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default TeacherScoreRemarkExam;

import React, { useState } from "react";

function StudentScoreRemarkExam() {
  const [formData, setFormData] = useState({
    fullName: "",
    className: "",
    dob: "",
    examDate: "",
    currentScore: "",
    remarkReason: "",
  });

  const examData = {
    id: "EX001",
    title: "Kỳ thi cuối kỳ môn Toán",
    type: "final",
    time_start: "2025-03-10T08:00:00",
    time_end: "2025-03-10T10:00:00",
    duration: 7200,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const confirmed = window.confirm("⚠️ Bạn chỉ có thể phúc tra 1 lần. Bạn có chắc chắn gửi?");
    if (confirmed) {
      alert("✅ Yêu cầu phúc tra đã được gửi.");
      // Reset form if needed
      // setFormData({ fullName: "", className: "", dob: "", examDate: "", currentScore: "", remarkReason: "" });
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={infoWrapperStyle}>
          {/* Phúc tra (bên trái) */}
          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin phúc tra</h3>

            <div style={inputGroup}>
              <label>Họ và tên:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label>Lớp:</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label>Ngày sinh:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label>Ngày thi:</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label>Điểm hiện tại:</label>
              <input
                type="number"
                name="currentScore"
                value={formData.currentScore}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label>Lý do phúc tra:</label>
              <textarea
                name="remarkReason"
                value={formData.remarkReason}
                onChange={handleChange}
                rows="4"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={submitButtonStyle}
            >
              Gửi
            </button>
          </div>

          {/* Thông tin kỳ thi (bên phải) */}
          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin kỳ thi</h3>
            <p><strong>Tiêu đề:</strong> {examData.title}</p>
            <p><strong>Loại:</strong> {examData.type === "midterm" ? "Giữa kỳ" : "Cuối kỳ"}</p>
            <p><strong>Bắt đầu:</strong> {formatTime(examData.time_start)}</p>
            <p><strong>Kết thúc:</strong> {formatTime(examData.time_end)}</p>
            <p><strong>Thời gian làm bài:</strong> {examData.duration / 60} phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utilities
function formatTime(datetimeString) {
  const options = {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "2-digit", year: "numeric"
  };
  return new Date(datetimeString).toLocaleString("vi-VN", options);
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

export default StudentScoreRemarkExam;

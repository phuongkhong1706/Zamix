import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function StudentScoreExam() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleReviewExam = () => {
    // Điều hướng đến trang review_exam
    navigate('/student/result/score/review_exam');
  };
  const handleRemarkExam = () => {
    // Điều hướng đến trang review_exam
    navigate('/student/result/score/remark_exam');
  };

  const handleSelectChange = (type, value) => {
    if (type === "class") setSelectedClass(value);
    if (type === "semester") setSelectedSemester(value);
    if (type === "type") setSelectedType(value);
  };

  const examScores = [
    { id: 1, class: "12A1", examTitle: "Thi giữa kỳ Toán", examDate: "2025-03-10T08:00:00", score: 8.5 },
    { id: 2, class: "12A2", examTitle: "Thi cuối kỳ Hóa", examDate: "2025-06-15T10:00:00", score: 7.2 },
    { id: 3, class: "12A1", examTitle: "Thi cuối kỳ Lý", examDate: "2025-06-20T09:00:00", score: 9.1 },
    { id: 4, class: "12A2", examTitle: "Thi giữa kỳ Văn", examDate: "2025-03-11T08:00:00", score: 8.3 },
    { id: 5, class: "12A1", examTitle: "Thi cuối kỳ Toán", examDate: "2025-06-17T08:30:00", score: 7.8 },
    { id: 6, class: "12A3", examTitle: "Thi giữa kỳ Sử", examDate: "2025-03-09T09:15:00", score: 6.9 },
    { id: 7, class: "12A1", examTitle: "Thi giữa kỳ Toán", examDate: "2025-03-10T08:45:00", score: 9.4 },
    { id: 8, class: "12A2", examTitle: "Thi cuối kỳ Sinh", examDate: "2025-06-22T08:00:00", score: 7.0 },
    { id: 9, class: "12A3", examTitle: "Thi cuối kỳ Văn", examDate: "2025-06-18T10:30:00", score: 8.0 },
    { id: 10, class: "12A1", examTitle: "Thi giữa kỳ Hóa", examDate: "2025-03-13T08:00:00", score: 7.5 },
  ];

  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={filterButtonWrapperStyle}>
          <select
            value={selectedClass}
            onChange={(e) => handleSelectChange("class", e.target.value)}
            style={filterSelectStyle}
          >
            <option value="" disabled hidden>Lớp</option>
            <option value="12A1">12A1</option>
            <option value="12A2">12A2</option>
            <option value="12A3">12A3</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => handleSelectChange("semester", e.target.value)}
            style={filterSelectStyle}
          >
            <option value="" disabled hidden>Học kỳ</option>
            <option value="Giữa kỳ">Giữa kỳ</option>
            <option value="Cuối kỳ">Cuối kỳ</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => handleSelectChange("type", e.target.value)}
            style={filterSelectStyle}
          >
            <option value="" disabled hidden>Loại kỳ thi</option>
            <option value="Toán">Toán</option>
            <option value="Văn">Văn</option>
            <option value="Lý">Lý</option>
            <option value="Hóa">Hóa</option>
            <option value="Sử">Sử</option>
            <option value="Sinh">Sinh</option>
          </select>
        </div>

        <h3 style={sectionTitleStyle}>Bảng điểm kỳ thi</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableCellStyle}>STT</th>
              <th style={tableCellStyle}>Lớp</th>
              <th style={tableCellStyle}>Tên kỳ thi</th>
              <th style={tableCellStyle}>Ngày thi</th>
              <th style={tableCellStyle}>Điểm</th>
              <th style={tableCellStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {examScores.map((item, index) => (
              <tr key={item.id}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{item.class}</td>
                <td style={tableCellStyle}>{item.examTitle}</td>
                <td style={tableCellStyle}>
                  {new Date(item.examDate).toLocaleDateString("vi-VN")}
                </td>
                <td style={tableCellStyle}>{item.score}</td>
                <td style={tableCellStyle}>
                  <button style={actionButtonStyle} onClick={handleReviewExam}>
                    Xem
                  </button>
                  {" "}
                  <button style={appealButtonStyle} onClick={handleRemarkExam}>
                    Phúc tra
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const sectionTitleStyle = {
  marginBottom: "16px",
  color: "#0b3d91",
  borderBottom: "2px solid #0b3d91",
  paddingBottom: "6px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const tableCellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  verticalAlign: "middle",
};

const actionButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#0b3d91",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "6px",
};

const appealButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#f39c12",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const filterButtonWrapperStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const filterSelectStyle = {
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  // Removed active button style to avoid color changes
};

export default StudentScoreExam;

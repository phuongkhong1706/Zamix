import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StudentVerifyPractice() {
  const navigate = useNavigate();
  const { id } = useParams();

  const examData = {
    id,
    title: "Kỳ thi cuối kỳ môn Toán",
    type: "final",
    time_start: "2025-06-15T08:00:00",
    time_end: "2025-06-15T10:00:00",
    duration: 7200,
  };

  const studentInfo = {
    fullName: "Nguyễn Văn A",
    dob: "2003-08-20",
    studentCode: "SBD001",
  };

  const [agreed, setAgreed] = useState(false);

  const handleStartExam = () => {
    if (agreed) {
      navigate(`/student/practice/do_practice/${id}`);
    } else {
      alert("Bạn cần đồng ý chấp hành nội quy trước khi vào thi.");
    }
  };

  const practiceResults = [
    { id: 1, score: 8.5 },
    { id: 2, score: 7.0 },
    { id: 3, score: 9.25 },
  ];

  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={infoWrapperStyle}>
          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin học sinh</h3>
            <p><strong>Họ và tên:</strong> {studentInfo.fullName}</p>
            <p><strong>Ngày sinh:</strong> {formatDate(studentInfo.dob)}</p>
            <p><strong>Số báo danh:</strong> {studentInfo.studentCode}</p>
          </div>

          <div style={boxStyle}>
            <h3 style={sectionTitleStyle}>Thông tin kỳ thi</h3>
            <p><strong>Tiêu đề:</strong> {examData.title}</p>
            <p><strong>Loại:</strong> {examData.type === "midterm" ? "Giữa kỳ" : "Cuối kỳ"}</p>
            <p><strong>Bắt đầu:</strong> {formatTime(examData.time_start)}</p>
            <p><strong>Kết thúc:</strong> {formatTime(examData.time_end)}</p>
            <p><strong>Thời gian làm bài:</strong> {examData.duration / 60} phút</p>
          </div>
        </div>

        <div style={agreementWrapperStyle}>
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />{" "}
            Tôi đã đọc và đồng ý chấp hành quy định phòng thi
          </label>
          <button
            onClick={handleStartExam}
            disabled={!agreed}
            style={{
              marginLeft: "auto",
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: agreed ? "#0b3d91" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: agreed ? "pointer" : "not-allowed",
              fontWeight: "bold",
            }}
          >
            Vào thi
          </button>
        </div>

        <div style={resultBoxStyle}>
          <h3 style={sectionTitleStyle}>Kết quả bài thi thử</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableCellStyle}>STT</th>
                <th style={tableCellStyle}>Điểm</th>
                <th style={tableCellStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {practiceResults.map((result, index) => (
                <tr key={result.id}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{result.score}</td>
                  <td style={tableCellStyle}>
                    <button
                      style={viewButtonStyle}
                      onClick={() => alert(`Xem bài thi thử ID ${result.id}`)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function formatTime(datetimeString) {
  const options = {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "2-digit", year: "numeric"
  };
  return new Date(datetimeString).toLocaleString("vi-VN", options);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
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
  marginBottom: "30px",
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

const agreementWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "30px",
};

const resultBoxStyle = {
  backgroundColor: "#f9f9f9",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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

const viewButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#0b3d91",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default StudentVerifyPractice;

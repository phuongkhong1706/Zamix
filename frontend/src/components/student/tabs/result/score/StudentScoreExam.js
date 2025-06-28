import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function StudentScoreExam() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [examScores, setExamScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const inputWrapperStyle = {
    position: "relative",
    display: "inline-block",
  };
  const inputStyle = {
    ...filterInputStyle,
  };
  const iconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    pointerEvents: "none",
  };

  // Fetch exam scores data
  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      try {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          alert("❌ Người dùng chưa đăng nhập.");
          return;
        }
        const { token } = JSON.parse(userJson);
        const response = await fetch(`http://127.0.0.1:8000/api/student/student_result/student_score/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`❌ Fetch error: ${await response.text()}`);
        const data = await response.json();
        console.log("📥 Dữ liệu trả về:", data); // ✅ Log toàn bộ data
        setExamScores(data.examScores || []);
      } catch (error) {
        alert(error.message || "❌ Không thể lấy danh sách điểm thi.");
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, []);

  // Apply filters
  const filteredScores = examScores.filter((item) => {
    return (
      (studentName ? item.examTitle.toLowerCase().includes(studentName.toLowerCase()) : true) &&
      (selectedSemester ? item.semester === selectedSemester : true) &&
      (selectedSlot ? item.slot === selectedSlot : true) &&
      (selectedDate ? item.examDate === selectedDate : true) &&
      (selectedGrade ? item.grade === selectedGrade : true)
    );
  });

  const handleReviewExam = (test_id) => {
    navigate(`/student/result/score/review_exam/${test_id}`);
  };

  const handleRemarkExam = (test_id) => {
    navigate(`/student/result/score/remark_exam/${test_id}`);
  };

  if (loading) return <div style={{ padding: "1rem" }}>Đang tải danh sách điểm thi...</div>;

  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={filterWrapperStyle}>
          <div style={inputWrapperStyle}>
            <input
              type="text"
              placeholder="Tìm kỳ thi..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={inputStyle}
            />
            <FaSearch style={iconStyle} />
          </div>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">Tất cả đợt thi</option>
            <option value="Giữa kỳ">Giữa kỳ</option>
            <option value="Cuối kỳ">Cuối kỳ</option>
          </select>

          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">Tất cả ca thi</option>
            <option value="1">Ca 1 (7h00 - 9h00)</option>
            <option value="2">Ca 2 (9h15 - 11h15)</option>
            <option value="3">Ca 3 (12h30 - 14h00)</option>
            <option value="4">Ca 4 (15h - 17h30)</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={filterSelectStyle}
          />

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={filterSelectStyle}
          >
            <option value="">Tất cả các khối</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
        </div>

        <h3 style={sectionTitleStyle}>Bảng điểm kỳ thi</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableCellStyle}>STT</th>
              <th style={tableCellStyle}>Kỳ thi</th>
              <th style={tableCellStyle}>Đợt thi</th>
              <th style={tableCellStyle}>Ngày thi</th>
              <th style={tableCellStyle}>Ca thi</th>
              <th style={tableCellStyle}>Khối</th>
              <th style={tableCellStyle}>Điểm</th>
              <th style={tableCellStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.length > 0 ? (
              filteredScores.map((item, index) => (
                <tr key={item.id}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{item.examTitle}</td>
                  <td style={tableCellStyle}>{item.semester}</td>
                  <td style={tableCellStyle}>
                    {new Date(item.examDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={tableCellStyle}>{item.slot}</td>
                  <td style={tableCellStyle}>Lớp {item.grade}</td>
                  <td style={tableCellStyle}>{item.score}</td>
                  <td style={tableCellStyle}>
                    <button style={actionButtonStyle} onClick={() => handleReviewExam(item.test_id)}>Xem</button>{" "}
                    {item.status === 0 && (
                      <button style={appealButtonStyle} onClick={() => handleRemarkExam(item.test_id)}>Phúc tra</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tableCellStyle} colSpan="8">Không có dữ liệu phù hợp.</td>
              </tr>
            )}

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
  marginTop: "30px",
  marginBottom: "30px",
  padding: "0 20px",
};

const mainCardStyle = {
  width: "1200px",
  borderRadius: "15px",
  padding: "20px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const filterWrapperStyle = {
  marginBottom: "25px",
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  alignItems: "center",
};

const filterInputStyle = {
  height: "38px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  padding: "0 10px",
  fontSize: "14px",
  width: "434px",
};

const filterSelectStyle = {
  height: "38px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  padding: "0 10px",
  fontSize: "14px",
  cursor: "pointer",
};

const sectionTitleStyle = {
  marginBottom: "15px",
  fontWeight: "bold",
  fontSize: "18px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontSize: "14px",
};

const actionButtonStyle = {
  backgroundColor: "#2a9d8f",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "8px",
  fontWeight: "bold",
};

const appealButtonStyle = {
  backgroundColor: "#e76f51",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default StudentScoreExam;

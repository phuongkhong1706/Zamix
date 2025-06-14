import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function TeacherScoreExam() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(""); // Bộ lọc khối (Lớp 10,11,12)
  const [appealClicked, setAppealClicked] = useState(false);

  const handleReviewExam = () => {
    navigate("/teacher/result/score/review_exam");
  };

  const handleRemarkExam = () => {
    navigate("/teacher/result/score/remark_exam");
  };

  const inputWrapperStyle = {
    position: "relative",
    display: "inline-block",
  };

  const inputStyle = {
    paddingRight: "30px", // chừa chỗ cho icon
    ...filterInputStyle,
  };

  const iconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    pointerEvents: "none", // icon không ảnh hưởng khi click
  };

  // Dữ liệu giả gồm 10 dòng với các cột bạn yêu cầu và bổ sung thêm khối (grade)
  const examScores = [
    { id: 1, studentName: "Khổng Thị Hoài Phương", examTitle: "Kiểm tra Toán cuối kỳ", semester: "Cuối kỳ", examDate: "2025-06-17", slot: "1", score: 8.5, grade: "10" },
    { id: 2, studentName: "Trần Thị B", examTitle: "Kiểm tra Toán cuối kỳ", semester: "Cuối kỳ", examDate: "2025-06-17", slot: "2", score: 7.2, grade: "11" },
    { id: 3, studentName: "Lê Văn C", examTitle: "Kiểm tra Toán giữa kỳ", semester: "Giữa kỳ", examDate: "2025-03-10", slot: "1", score: 9.1, grade: "12" },
    { id: 4, studentName: "Phạm Thị D", examTitle: "Kiểm tra Toán giữa kỳ", semester: "Giữa kỳ", examDate: "2025-03-11", slot: "2", score: 8.3, grade: "10" },
    { id: 5, studentName: "Hoàng Văn E", examTitle: "Kiểm tra Toán cuối kỳ", semester: "Cuối kỳ", examDate: "2025-06-18", slot: "3", score: 7.8, grade: "11" },
    { id: 6, studentName: "Đỗ Thị F", examTitle: "Kiểm tra Toán giữa kỳ", semester: "Giữa kỳ", examDate: "2025-03-09", slot: "1", score: 8.7, grade: "12" },
    { id: 7, studentName: "Vũ Văn G", examTitle: "Kiểm tra Toán cuối kỳ", semester: "Cuối kỳ", examDate: "2025-06-19", slot: "4", score: 9.0, grade: "10" },
    { id: 8, studentName: "Trịnh Thị H", examTitle: "Kiểm tra Toán giữa kỳ", semester: "Giữa kỳ", examDate: "2025-03-12", slot: "3", score: 7.6, grade: "11" },
    { id: 9, studentName: "Bùi Văn I", examTitle: "Kiểm tra Toán cuối kỳ", semester: "Cuối kỳ", examDate: "2025-06-20", slot: "2", score: 8.2, grade: "12" },
    { id: 10, studentName: "Ngô Thị K", examTitle: "Kiểm tra Toán giữa kỳ", semester: "Giữa kỳ", examDate: "2025-03-13", slot: "4", score: 7.9, grade: "10" },
  ];

  // Filter theo tên học sinh, kỳ thi, đợt thi, ca thi, ngày thi và khối (grade)
  const filteredScores = examScores.filter((item) => {
    return (
      item.studentName.toLowerCase().includes(studentName.toLowerCase()) &&
      (selectedSemester ? item.semester === selectedSemester : true) &&
      (selectedSlot ? item.slot === selectedSlot : true) &&
      (selectedDate ? item.examDate === selectedDate : true) &&
      (selectedGrade ? item.grade === selectedGrade : true)
    );
  });

  return (
    <div style={outerContainerStyle}>
      <div style={mainCardStyle}>
        <div style={filterWrapperStyle}>
          <div style={inputWrapperStyle}>
            <input
              type="text"
              placeholder="Kỳ thi..."
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

          {/* Bộ lọc khối (grade) */}
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

          <button
            onClick={() => setAppealClicked(!appealClicked)}
            style={{
              backgroundColor: appealClicked ? "#800080" : "#fff", // tím hoặc trắng
              color: appealClicked ? "#fff" : "#000", // chữ trắng hoặc tím
              border: "1px solid #bbb",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              marginLeft: "10px",
              fontWeight: "bold",
              height: "38px"
            }}
          >
            Phúc tra
          </button>
        </div>

        <h3 style={sectionTitleStyle}>Bảng điểm kỳ thi</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableCellStyle}>STT</th>
              <th style={tableCellStyle}>Họ và tên học sinh</th>
              <th style={tableCellStyle}>Kỳ thi</th>
              <th style={tableCellStyle}>Đợt thi</th>
              <th style={tableCellStyle}>Ngày thi</th>
              <th style={tableCellStyle}>Ca thi</th>
              <th style={tableCellStyle}>Khối</th> {/* Cột mới */}
              <th style={tableCellStyle}>Điểm</th>
              <th style={tableCellStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.length > 0 ? (
              filteredScores.map((item, index) => (
                <tr key={item.id}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{item.studentName}</td>
                  <td style={tableCellStyle}>{item.examTitle}</td>
                  <td style={tableCellStyle}>{item.semester}</td>
                  <td style={tableCellStyle}>
                    {new Date(item.examDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={tableCellStyle}>{item.slot}</td>
                  <td style={tableCellStyle}>Lớp {item.grade}</td> {/* Hiển thị khối */}
                  <td style={tableCellStyle}>{item.score}</td>
                  <td style={tableCellStyle}>
                    <button style={actionButtonStyle} onClick={handleReviewExam}>
                      Xem
                    </button>{" "}
                    <button style={appealButtonStyle} onClick={handleRemarkExam}>
                      Yêu cầu phúc tra
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tableCellStyle} colSpan="9">
                  Không có dữ liệu phù hợp.
                </td>
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

export default TeacherScoreExam;

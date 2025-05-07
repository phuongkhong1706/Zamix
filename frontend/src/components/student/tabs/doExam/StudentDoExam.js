import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from "./FilterSidebar";

function StudentDoExam() {
  const typeDisplayMap = {
    midterm: "Giữa kỳ",
    final: "Cuối kỳ",
  };

  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    examTypes: new Set(),
    grades: new Set(),
  });

  const navigate = useNavigate(); // 👈 Thêm điều hướng

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/student/do_exam/")
      .then((res) => res.json())
      .then((res) => {
        console.log("Kết quả API:", res);
        // Fallback nếu không có mảng
        setData(Array.isArray(res) ? res : []);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setData([]);
      });
  }, []);

  const filteredData = data?.filter((exam) => {
    const matchType =
      filters.examTypes.size === 0 || filters.examTypes.has(exam.type);
    const matchGrade =
      filters.grades.size === 0 || filters.grades.has(exam.grade);
    return matchType && matchGrade;
  });

  const handleExamClick = (id) => {
    navigate(`/exam/${id}`); // 👈 Điều hướng đến trang làm bài thi
  };

  return (
    <div className="main-content">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <div style={{ flex: 1, paddingLeft: "20px" }}>
        {data === null ? (
          <p>Đang tải dữ liệu...</p>
        ) : filteredData.length === 0 ? (
          <p>Không có kỳ thi phù hợp</p>
        ) : (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "flex-start"
          }}>
            {filteredData.map((exam) => (
              <div
                key={exam.id}
                style={{ ...cardStyle, cursor: 'pointer' }} // 👈 Thêm cursor
                onClick={() => handleExamClick(exam.id)} // 👈 Bắt sự kiện click
              >
                <h3 style={headerStyle}>{exam.title}</h3>
                <p><strong>Loại:</strong> {typeDisplayMap[exam.type] || exam.type}</p>
                <p><strong>Thời gian làm bài:</strong> {exam.duration}</p>
                <p>🟢 <strong>Bắt đầu:</strong> {formatTime(exam.time_start)}</p>
                <p>🔴 <strong>Kết thúc:</strong> {formatTime(exam.time_end)}</p>
                <p style={{
                  color: exam.status.includes("đang") ? "green" : "red",
                  fontWeight: "bold"
                }}>{exam.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(datetimeString) {
  const options = {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric'
  };
  return new Date(datetimeString).toLocaleString('vi-VN', options);
}

const cardStyle = {
  backgroundColor: '#f5f8ff',
  borderRadius: '12px',
  padding: '16px',
  width: '450px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontFamily: 'Arial',
};

const headerStyle = {
  backgroundColor: '#0b3d91',
  color: 'white',
  padding: '8px',
  borderRadius: '8px',
  fontSize: '16px',
};

export default StudentDoExam;

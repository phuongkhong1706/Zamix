import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconSearchWhite from '../../../../assets/icon/icon-search-white.png'; // 👈 Cập nhật đường dẫn icon nếu cần

function StudentDoExam() {

  const [data, setData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/student/do_exam/")
      .then((res) => res.json())
      .then((res) => {
        setData(Array.isArray(res) ? res : []);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setData([]);
      });
  }, []);

  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase().trim();
    if (data) {
      return data.filter((exam) =>
        exam.name.toLowerCase().includes(keyword)
      );
    }
    return [];
  };

  const filteredData = handleSearch();

  const handleExamClick = (id) => {
    navigate(`/student/do_exam/verify_exam/${id}`);
  };

  return (
    <div className="main-content" style={{ padding: "20px" }}>
      {/* Thanh tìm kiếm */}
      <div className="filter-left" style={filterLeftStyle}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={inputStyle}
        />
        <button className="btn search" style={searchButtonStyle} onClick={handleSearch}>
          <img src={iconSearchWhite} alt="icon" className="btn-icon" style={btnIconStyle} />
          Tìm kiếm
        </button>
      </div>

      {/* Danh sách kỳ thi */}
      <div style={{ marginTop: "20px" }}>
        {data === null ? (
          <p>Đang tải dữ liệu...</p>
        ) : filteredData.length === 0 ? (
          <p>Không có kỳ thi phù hợp</p>
        ) : (
          <div style={cardGridStyle}>
            {filteredData.map((exam) => (
              <div
                key={exam.id}
                style={{ ...cardStyle, cursor: 'pointer' }}
                onClick={() => handleExamClick(exam.id)}
              >
                <h3 style={headerStyle}>{exam.name}</h3>
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

// 🎨 CSS Styles
const filterLeftStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  flex: '1',
};

const searchButtonStyle = {
  backgroundColor: '#6f3e76',
  color: 'white',
  width: '100px',
  border: 'none',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '8px',
};

const btnIconStyle = {
  width: '16px',
  height: '16px',
};

const cardGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "flex-start",
};

const cardStyle = {
  backgroundColor: '#f5f8ff',
  borderRadius: '12px',
  padding: '16px',
  flex: '1 1 calc(33.333% - 20px)', // 👈 Cho phép 3 cột
  maxWidth: 'calc(33.333% - 20px)',  // 👈 Giới hạn chiều rộng
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontFamily: 'Arial',
  boxSizing: 'border-box',
};

const headerStyle = {
  backgroundColor: '#0b3d91',
  color: 'white',
  padding: '8px',
  borderRadius: '8px',
  fontSize: '16px',
};

export default StudentDoExam;

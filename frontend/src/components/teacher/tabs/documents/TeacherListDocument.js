import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import iconSearchWhite from "../../../../assets/icon/icon-search-white.png";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";

const TeacherListDocument = () => {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    grade: "",
    topic: "",
  });

  const documents = [
    {
      id: 1,
      name: "Ôn tập cuối kỳ",
      topic: "Đạo hàm",
      grade: "Lớp 12",
      level: "Trung bình",
    },
    {
      id: 2,
      name: "Tổng hợp hình học",
      topic: "Hình học không gian",
      grade: "Lớp 11",
      level: "Khó",
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // You can add more advanced search logic here if needed
  };

  const filteredDocuments = documents.filter((doc) => {
    const keywordMatch = doc.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const levelMatch = !filters.level || doc.level === filters.level;
    const gradeMatch = !filters.grade || doc.grade === filters.grade;
    const topicMatch = !filters.topic || doc.topic === filters.topic;
    return keywordMatch && levelMatch && gradeMatch && topicMatch;
  });

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "1400px",
      margin: "60px auto 0",
      fontFamily: "Arial, sans-serif",
    },
    section: {
      position: "relative",
      marginBottom: "40px",
      padding: "32px 24px 24px",
      border: "1px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#fdfdfd",
    },
    sectionTitle: {
      position: "absolute",
      top: "-14px",
      left: "20px",
      backgroundColor: "#fdfdfd",
      padding: "0 10px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333",
    },
    buttonAdd: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      backgroundColor: "#6f3e76",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    filterWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      gap: "16px",
    },
    filterLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inputStyle: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    searchButtonStyle: {
      padding: "8px 12px",
      backgroundColor: "#6f3e76",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    btnIconStyle: {
      width: "16px",
      height: "16px",
      marginRight: "6px",
    },
    filterRight: {
      display: "flex",
      gap: "10px",
    },
    selectStyle: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#f0f0f0",
      padding: "10px",
      border: "1px solid #ddd",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      border: "1px solid #ddd",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Danh sách tài liệu</div>

        <button
          style={styles.buttonAdd}
          onClick={() => navigate("/teacher/listdocuments/adddocuments")}
        >
          <img src={iconAddCodeExam} alt="icon" style={styles.btnIconStyle} />
          Thêm tài liệu
        </button>

        <div style={styles.filterWrapper}>
          <div className="filter-left" style={styles.filterLeft}>
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={styles.inputStyle}
            />
            <button
              className="btn search"
              style={styles.searchButtonStyle}
              onClick={handleSearch}
            >
              <img
                src={iconSearchWhite}
                alt="icon"
                className="btn-icon"
                style={styles.btnIconStyle}
              />
              Tìm kiếm
            </button>
          </div>

          <div className="filter-right" style={styles.filterRight}>
            <select
              name="level"
              onChange={handleFilterChange}
              style={styles.selectStyle}
            >
              <option value="">Mức độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Nâng cao</option>
            </select>
            <select
              name="grade"
              onChange={handleFilterChange}
              style={styles.selectStyle}
            >
              <option value="">Khối</option>
              <option value="Lớp 10">Lớp 10</option>
              <option value="Lớp 11">Lớp 11</option>
              <option value="Lớp 12">Lớp 12</option>
            </select>
            <select
              name="topic"
              onChange={handleFilterChange}
              style={styles.selectStyle}
            >
              <option value="">Chủ đề</option>
              <option value="Đạo hàm">Đạo hàm</option>
              <option value="Tích phân">Tích phân</option>
              <option value="Nguyên hàm">Nguyên hàm</option>
              <option value="Hình học không gian">Hình học không gian</option>
            </select>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>STT</th>
              <th style={styles.th}>Tên tài liệu</th>
              <th style={styles.th}>Chủ đề</th>
              <th style={styles.th}>Khối</th>
              <th style={styles.th}>Độ khó</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={doc.id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{doc.name}</td>
                <td style={styles.td}>{doc.topic}</td>
                <td style={styles.td}>{doc.grade}</td>
                <td style={styles.td}>{doc.level}</td>
                <td style={styles.td}>
                  <button
                    className="btn btn-sm btn-edit"
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      border: "1px solid #000",
                      padding: "4px 10px",
                      marginRight: "8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={iconEdit}
                      alt="Edit"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "4px",
                        verticalAlign: "middle",
                      }}
                    />
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-delete"
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      border: "1px solid #000",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={iconDelete}
                      alt="Delete"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "4px",
                        verticalAlign: "middle",
                      }}
                    />
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherListDocument;

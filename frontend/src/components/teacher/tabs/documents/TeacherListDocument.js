import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import iconSearchWhite from "../../../../assets/icon/icon-search-white.png";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";

const TeacherListDocument = () => {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({ level: "", grade: "", topic: "" });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const params = {};

        if (filters.grade) params.grade = filters.grade;
        if (filters.level) params.level = filters.level;
        if (filters.topic) params.topic_id = filters.topic;

        const response = await axios.get(
          "http://localhost:8000/api/teacher/teacher_document/teacher_manage_document/",
          { params }
        );

        console.log("Dữ liệu lấy từ backend:", response.data);
        setDocuments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài liệu:", error);
      }
    };

    fetchDocuments();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditDocument = (docId) => {
    navigate(`/teacher/listdocuments/fixdocument/${docId}`);
  };
  const handleDelete = async (docId) => {
    const userJson = localStorage.getItem("user");
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }

    if (!token) {
      alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tài liệu này?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/teacher/teacher_document/teacher_detail_document/${docId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Xoá tài liệu thành công!");
      // TODO: Điều hướng lại hoặc cập nhật danh sách tài liệu
      window.location.reload(); 
    } catch (err) {
      console.error("❌ Lỗi khi xoá tài liệu:", err);
      alert("Đã xảy ra lỗi khi xoá tài liệu.");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      doc.name.toLowerCase().includes(keyword) ||
      (doc.topic_name && doc.topic_name.toLowerCase().includes(keyword)) ||
      (doc.grade && doc.grade.toLowerCase().includes(keyword)) ||
      (doc.level && doc.level.toLowerCase().includes(keyword))
    );
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
          <div style={styles.filterLeft}>
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={styles.inputStyle}
            />
            <button style={styles.searchButtonStyle}>
              <img src={iconSearchWhite} alt="icon" style={styles.btnIconStyle} />
              Tìm kiếm
            </button>
          </div>

          <div style={styles.filterRight}>
            <select
              name="level"
              onChange={handleFilterChange}
              style={styles.selectStyle}
              value={filters.level}
            >
              <option value="">Tất cả mức độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>
            <select
              name="grade"
              onChange={handleFilterChange}
              style={styles.selectStyle}
              value={filters.grade}
            >
              <option value="">Tất cả khối</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
            <select
              name="topic"
              onChange={handleFilterChange}
              style={styles.selectStyle}
              value={filters.topic}
            >
              <option value="">Tất cả chủ đề</option>
              <option value="1">Đạo hàm</option>
              <option value="2">Tích phân</option>
              <option value="3">Nguyên hàm</option>
              <option value="4">Hình học không gian</option>
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
              <th style={styles.th}>Link tài liệu</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={doc.doc_id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{doc.name}</td>
                <td style={styles.td}>{doc.topic_name || "Chưa có chủ đề"}</td>
                <td style={styles.td}>{`Lớp ${doc.grade}`}</td>
                <td style={styles.td}>
                  {{
                    basic: "Cơ bản",
                    intermediate: "Trung bình",
                    advanced: "Khó",
                  }[doc.level] || doc.level}
                </td>
                <td style={styles.td}>
                  <a
                    href={`http://localhost:8000${doc.file_url.startsWith('/media/documents/documents/')
                      ? doc.file_url.replace('/media/documents/documents/', '/media/documents/')
                      : doc.file_url
                      }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem
                  </a>
                </td>
                <td style={styles.td}>
                  <button
                    className="btn edit"
                    style={{ marginRight: "8px" }}
                    onClick={() => handleEditDocument(doc.doc_id)}
                  >
                    <img src={iconEdit} alt="icon" className="btn-icon" />
                    Chỉnh sửa
                  </button>
                  <button className="btn delete" onClick={() => handleDelete(doc.doc_id)}>
                    <img src={iconDelete} alt="icon" className="btn-icon" />
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

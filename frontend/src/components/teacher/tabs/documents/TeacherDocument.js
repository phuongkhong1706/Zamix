import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import { FaSave } from "react-icons/fa";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
const TeacherDocument = () => {
  const navigate = useNavigate();

  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [grade, setGrade] = useState("10");
  const [level, setLevel] = useState("basic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [,setFile] = useState(null);

  const topics = [
    "Đạo hàm",
    "Tích phân",
    "Nguyên hàm",
    "Hình học phẳng",
    "Hình học không gian",
    "Số phức",
    "Lượng giác",
    "Xác suất thống kê",
  ];

  const handleSave = () => {
    // Logic lưu dữ liệu, ví dụ: validate + gửi API hoặc lưu state
    alert("Lưu thông tin tài liệu thành công!");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const styles = {
    container: {
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1400px",
      margin: "60px auto 0",
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
    row: {
      display: "flex",
      flexWrap: "wrap",
      gap: "24px",
      marginBottom: "24px",
    },
    formGroup: {
      flex: "1 1 30%",
      display: "flex",
      flexDirection: "column",
    },
    fullWidth: {
      flex: "1 1 100%",
    },
    halfWidth: {
      flex: "1 1 48%",
    },
    quarterWidth: {
      flex: "1 1 23%",
    },
    label: {
      marginBottom: "6px",
      fontWeight: "bold",
    },
    input: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    textarea: {
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      resize: "vertical",
    },
    select: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    fileLabel: {
      marginTop: "5px",
      fontStyle: "italic",
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
      marginBottom: "16px",
      fontWeight: "bold"
    },
    icon: {
      width: "18px",
      height: "18px",
    },
    actionButton: {
      padding: "4px 10px",
      marginRight: "8px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
    edit: {
      backgroundColor: "green",
      color: "#fff",
    },
    delete: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Thông tin tài liệu</div>

        {/* Hàng đầu: Tên tài liệu, Khối, Độ khó, Tệp tài liệu */}
        <div style={styles.row}>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Tên tài liệu</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Nhập tên tài liệu"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, ...styles.quarterWidth }}>
            <label style={styles.label}>Khối</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} style={styles.select}>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>

          <div style={{ ...styles.formGroup, ...styles.quarterWidth }}>
            <label style={styles.label}>Độ khó</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={styles.select}>
              <option value="basic">Cơ bản</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Khó</option>
            </select>
          </div>

          <div style={{ ...styles.formGroup, ...styles.quarterWidth }}>
            <label style={styles.label}>Tệp tài liệu</label>
            <input type="file" onChange={handleFileChange} style={styles.input} />
          </div>
        </div>

        {/* Hàng dưới: Chủ đề, Mô tả tài liệu */}
        <div style={styles.row}>
          <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
            <label style={styles.label}>Chủ đề</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              size={3}
              style={{ ...styles.select, height: "82px", overflowY: "auto" }}
            >
              {topics.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
            <label style={styles.label}>Mô tả tài liệu</label>
            <textarea
              value={docDescription}
              onChange={(e) => setDocDescription(e.target.value)}
              placeholder="Nhập mô tả"
              rows={4}
              style={styles.textarea}
            ></textarea>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <button
            className="btn addcode"
            onClick={handleSave}
            style={{
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
            }}
          >
            <FaSave className="btn-icon" />
            Lưu
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Danh sách tài liệu</div>

        <button
          style={styles.buttonAdd}
          onClick={() => navigate("/teacher/documents/document_add/document_detail")}
        >
          <img src={iconAddCodeExam} alt="icon" className="btn-icon" />
          Thêm tài liệu
        </button>

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
            <tr>
              <td style={styles.td}>1</td>
              <td style={styles.td}>Ôn tập cuối kỳ</td>
              <td style={styles.td}>Đạo hàm</td>
              <td style={styles.td}>Lớp 12</td>
              <td style={styles.td}>Trung bình</td>
              <td style={styles.td}>
                  <td>
                    <button
                      className="btn btn-sm btn-edit"
                      style={{ backgroundColor: "#fff", color: "#000",border: "1px solid #000",}}
                    >
                      <img
                        src={iconEdit}
                        alt="Edit"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-delete"
                    >
                      <img
                        src={iconDelete}
                        alt="Delete"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Xóa
                    </button>
                  </td>
              </td>
            </tr>
            <tr>
              <td style={styles.td}>2</td>
              <td style={styles.td}>Tổng hợp hình học</td>
              <td style={styles.td}>Hình học không gian</td>
              <td style={styles.td}>Lớp 11</td>
              <td style={styles.td}>Khó</td>
              <td style={styles.td}>
                <td>
                    <button
                      className="btn btn-sm btn-edit"
                      style={{ backgroundColor: "#fff", color: "#000",border: "1px solid #000",}}
                    >
                      <img
                        src={iconEdit}
                        alt="Edit"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-delete"
                    >
                      <img
                        src={iconDelete}
                        alt="Delete"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Xóa
                    </button>
                  </td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDocument;

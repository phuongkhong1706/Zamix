import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

const TeacherAddDocument = () => {
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [grade, setGrade] = useState("10");
  const [level, setLevel] = useState("basic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [, setFile] = useState(null);

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
    saveButton: {
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
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Thông tin tài liệu</div>

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
          <button onClick={handleSave} style={styles.saveButton}>
            <FaSave />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAddDocument;
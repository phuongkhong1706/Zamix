import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TeacherAddDocument = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const [docName, setDocName] = useState("");
  const [grade, setGrade] = useState("10");
  const [level, setLevel] = useState("Cơ bản");
  const [docDescription, setDocDescription] = useState("");
  const [file, setFile] = useState(null);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
  const fetchTopics = async (token) => {
    try {
      const topicRes = await axios.get(
        "http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_topic_exam/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Topics response:", topicRes.data);
      setTopics(topicRes.data);

      if (!documentId && topicRes.data.length > 0) {
        setSelectedTopic(topicRes.data[0].topic_id);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chủ đề:", err);
    }
  };

  const fetchDocument = async (token) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/teacher/teacher_document/teacher_detail_document/${documentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      console.log("Document response:", data);
      setDocName(data.name || "");
      setGrade(data.grade || "10");
      setLevel(data.level || "Cơ bản");
      setDocDescription(data.description || "");
      setSelectedTopic(data.topic?.topic_id || "");
    } catch (err) {
      console.error("Lỗi khi lấy thông tin tài liệu:", err);
    }
  };

  // ✅ Lấy token từ localStorage
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

  fetchTopics(token).then(() => {
    if (documentId) {
      fetchDocument(token);
    }
  });
}, [documentId]);



  const handleSave = async () => {
    const userJson = localStorage.getItem("user");
    let token = null;
    let userId = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
        userId = userObj.user_id;
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }

    if (!token) {
      alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }

    // Kiểm tra trường bắt buộc
    if (!docName || !docDescription || !file) {
      alert("Vui lòng nhập đầy đủ thông tin tài liệu và chọn tệp.");
      return;
    }

    const formData = new FormData();
    formData.append("name", docName);
    formData.append("description", docDescription);
    formData.append("file_url", file);
    formData.append("grade", grade);
    formData.append("level", level);
    formData.append("topic_id", selectedTopic);
    formData.append("user", userId); // có thể bỏ nếu backend tự nhận từ token
    const method = documentId ? "PUT" : "POST";
    const url = documentId
      ? `http://localhost:8000/api/teacher/teacher_document/teacher_detail_document/${documentId}/`
      : `http://localhost:8000/api/teacher/teacher_document/teacher_detail_document/`;

    try {
      console.log("📤 Gửi dữ liệu tài liệu:", method, url);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // không đặt 'Content-Type', trình duyệt tự xử lý multipart/form-data
      });

      const resJson = await response.json();
      console.log("✅ Phản hồi từ server:", resJson);

      if (!response.ok) {
        console.error("❌ Lỗi khi lưu tài liệu:", resJson);
        alert(`Lỗi khi lưu tài liệu: ${resJson.detail || "Không rõ lỗi"}`);
        return;
      }

      alert(documentId ? "Cập nhật tài liệu thành công!" : "Tạo tài liệu mới thành công!");
      navigate("/teacher/listdocuments");
    } catch (err) {
      console.error("❌ Lỗi kết nối khi gửi tài liệu:", err);
      alert("Đã xảy ra lỗi khi gửi tài liệu. Vui lòng thử lại sau.");
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          {documentId ? "Cập nhật tài liệu" : "Thêm tài liệu mới"}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên tài liệu</label>
            <input
              type="text"
              style={styles.input}
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Khối</label>
            <select style={styles.select} value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Độ khó</label>
            <select style={styles.select} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Chủ đề</label>
            <select
              style={styles.select}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.label}>Mô tả tài liệu</label>
            <textarea
              style={styles.textarea}
              rows={5}
              value={docDescription}
              onChange={(e) => setDocDescription(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tệp tài liệu</label>
            <input
              type="file"
              style={styles.input}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.saveButton} onClick={handleSave}>
            <FaSave />
            {documentId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAddDocument;

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
    padding: "32px 24px 80px",
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
  footer: {
    position: "absolute",
    bottom: "16px",
    right: "24px",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 20px",
    backgroundColor: "#6f3e76",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

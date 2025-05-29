import React, { useState, useEffect} from "react";
import LatexInputKaTeX, { renderWithLatex } from "./LatexInputKaTeX.js";
import { v4 as uuidv4 } from "uuid";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import "../../../../styles/SidebarNavigation.css";
import "../../../../styles/exam-teacher/TeacherExamCode.css";
import iconAddQuestion from "../../../../assets/icon/icon-add.png";
import iconCancelQuestion from "../../../../assets/icon/icon-cancel.png";
import iconCorrect from "../../../../assets/icon/icon-correct.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import { FaSave } from "react-icons/fa";
function TeacherExamCode() {
  const [newQuestions, setNewQuestions] = useState([]);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { testId } = useParams(); // Lấy testId từ URL
  const [examData, setExamData] = useState({
  name: "",
  level: "",
  grade: "",
  duration_minutes: 0,
  exam_type: "",
  shift: {
    shift_id: "",
    name: "",
    date: "",
    start_time: "",
    end_time: ""
  }
});

  const [, setTestList] = useState([]);
  const handleSave = async () => {
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

    const data = {
      name: examData.name,
      level: examData.level,
      grade: examData.grade,
      duration_minutes: examData.duration_minutes,// nếu trường bạn lưu tên là `duration`, 
      exam_type: examData.exam_type,
      shift_id: examData.shift.shift_id
    };

    const method = testId ? "PUT" : "POST";
    const url = testId
      ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}/`
      : "http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resText = await res.text();
      if (res.ok) {
        alert(testId ? "Cập nhật đề thi thành công!" : "Tạo đề thi thành công!");
        // navigate("/teacher/exams");
      } else {
        const errorJson = JSON.parse(resText);
        alert(`Lỗi: ${errorJson.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Lỗi khi lưu kỳ thi:", error);
      alert("Không thể kết nối tới server.");
    }
  };
  useEffect(() => {
  const fetchTestDetail = async () => {
    // 🔐 Lấy token từ localStorage
    const userJson = localStorage.getItem("user");
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("❌ Lỗi khi parse user từ localStorage:", error);
      }
    }

    // ⚠️ Nếu không có token thì dừng lại
    if (!token) {
      alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }

    // 📦 Gọi API với header Authorization
    try {
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log('✅ Dữ liệu lấy được từ API:', data);

      // 📝 Cập nhật state
      setExamData({
        name: data.name || '',
        level: data.level || '',
        grade: data.grade || '',
        duration_minutes: data.duration_minutes || '',
        exam_type: data.exam_type || '',
        shift: data.shift || {
          shift_id: '',
          name: '',
          date: '',
          start_time: '',
          end_time: ''
        }
      });

      setTestList(data.tests || []);
    } catch (error) {
      console.error('❌ Lỗi khi lấy dữ liệu đề thi:', error);
    }
  };

  fetchTestDetail();
}, [testId]);


  const createNewQuestion = () => ({
    content: "",
    options: [
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
    ],
    correct_option_id: "",
  });

  const [newQuestion, setNewQuestion] = useState(createNewQuestion());

  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { id: uuidv4(), text: "" }],
    }));
  };

  const handleDeleteOption = (id) => {
    if (newQuestion.options.length <= 2) {
      alert("Mỗi câu hỏi phải có ít nhất 2 đáp án.");
      return;
    }
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
    if (newQuestion.correct_option_id === id) {
      setNewQuestion((prev) => ({ ...prev, correct_option_id: "" }));
    }
  };

  const handleAddOrEditQuestion = () => {
    if (!newQuestion.content.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (newQuestion.options.some((opt) => !opt.text.trim())) {
      alert("Vui lòng nhập đầy đủ nội dung các đáp án.");
      return;
    }
    if (!newQuestion.correct_option_id) {
      alert("Vui lòng chọn đáp án đúng.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...newQuestions];
      updated[editingIndex] = newQuestion;
      setNewQuestions(updated);
    } else {
      setNewQuestions((prev) => [...prev, newQuestion]);
    }

    setNewQuestion(createNewQuestion());
    setEditingIndex(null);
    setShowNewQuestionForm(false);
  };

  const handleEditQuestion = (index) => {
    setNewQuestion(newQuestions[index]);
    setEditingIndex(index);
    setShowNewQuestionForm(true);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Bạn có chắc muốn xoá câu hỏi này không?")) {
      setNewQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleToggleQuestionForm = () => {
    setShowNewQuestionForm(!showNewQuestionForm);
    setEditingIndex(null);
    setNewQuestion(createNewQuestion());
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, paddingRight: "280px" }}>
        <h2>
          Mã đề:{" "}
          <input
            type="text"
            className="border p-2 rounded"
            value={examData.name}
            onChange={(e) => setExamData({ ...examData, name: e.target.value })}
            placeholder="Nhập mã đề"
          />
        </h2>
        <hr />

        {/* DANH SÁCH CÂU HỎI */}
        {newQuestions.map((q, index) => (
          <div key={`q-${index}`} className="question-item">
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEditQuestion(index)}>
                <img src={iconEdit} alt="edit" className="btn-icon" /> Sửa
              </button>
              <button className="delete-btn" onClick={() => handleDeleteQuestion(index)}>
                <img src={iconDelete} alt="delete" className="btn-icon" /> Xoá
              </button>
            </div>
            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content)}</p>
            <ul>
              {q.options.map((opt, idx) => (
                <li key={opt.id}>
                  <strong>{String.fromCharCode(65 + idx)}</strong>. {renderWithLatex(opt.text)}
                  {q.correct_option_id === opt.id && (
                    <span className="correct-answer">
                      <img src={iconCorrect} alt="correct" className="btn-icon" /> Đáp án đúng
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* NÚT THÊM CÂU HỎI */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleToggleQuestionForm} className="btn addquestion">
            <img
              src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
              alt="toggle"
              className="btn-icon"
            />
            {showNewQuestionForm ? (editingIndex !== null ? "Huỷ sửa" : "Huỷ thêm") : "Thêm câu hỏi"}
          </button>
        </div>

        {/* FORM THÊM/SỬA */}
        {showNewQuestionForm && (
          <div className="question-form">
            <h4>{editingIndex !== null ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h4>

            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Nội dung câu hỏi:</label>
              <LatexInputKaTeX
                value={newQuestion.content}
                onChange={(value) => setNewQuestion({ ...newQuestion, content: value })}
                style={{ width: "90%", minHeight: "100px" }} // nếu component hỗ trợ style
              />
            </div>

            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Danh sách đáp án:</label>
              {newQuestion.options.map((opt, idx) => (
                <div key={opt.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <LatexInputKaTeX
                    value={opt.text}
                    onChange={(value) => {
                      const updatedOptions = newQuestion.options.map((o) =>
                        o.id === opt.id ? { ...o, text: value } : o
                      );
                      setNewQuestion({ ...newQuestion, options: updatedOptions });
                    }}
                  />
                  <input
                    type="radio"
                    name="correct_option"
                    checked={newQuestion.correct_option_id === opt.id}
                    onChange={() => setNewQuestion({ ...newQuestion, correct_option_id: opt.id })}
                    style={{ marginLeft: "8px" }}
                  />
                  <button onClick={() => handleDeleteOption(opt.id)} style={{ marginLeft: "8px" }}>
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddOption}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px", // Tăng chiều cao của nút
                  borderRadius: "8px",  // Bo góc
                  backgroundColor: "#ffffff", // Màu nền trắng
                  border: "1px solid #ccc", // Đường viền mờ
                  cursor: "pointer", // Đổi con trỏ khi hover
                  fontWeight: "bold", // Đậm chữ
                }}
              >
                ➕ Thêm đáp án
              </button>
            </div>

            <button onClick={handleAddOrEditQuestion} className="save-btn">
              ✅ {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
            </button>
          </div>
        )}
      </div>

      {/* SIDEBAR THÔNG TIN KỲ THI */}
      <div className="sidebar-container">
        <div className="exam-form-title">Thông tin đề thi</div>

        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Mức độ đề thi</label>
            <input
              type="text"
              className="exam-form-input"
              value={examData.level}
              onChange={(e) => setExamData({ ...examData, level: e.target.value })}
            />
          </div>
        </div>

        <div className="exam-form-row">

          <div className="exam-form-group">
            <label className="exam-form-label">Khối</label>
            <select
              className="exam-form-select"
              style={{ minWidth: '245px' }}
              value={examData.grade}
              onChange={(e) => setExamData({ ...examData, grade: e.target.value })}
            >
              <option value="">-- Chọn khối --</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>
        </div>

        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Thời lượng (phút)</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.duration_minutes}
              onChange={(e) => setExamData({ ...examData, duration_minutes: e.target.value })}
              min="1"
              placeholder="Nhập số phút"
            />
          </div>
        </div>

        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Ca thi</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.shift?.shift_id || ""}
              onChange={(e) =>
                setExamData({
                  ...examData,
                  shift: {
                    ...examData.shift,
                    shift_id: e.target.value
                  }
                })
              }
              min="1"
              placeholder="Nhập ca thi"
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", marginRight: "9px" }}>
          <button className="btn addcode" onClick={handleSave}>
            <FaSave className="btn-icon" /> {testId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherExamCode;
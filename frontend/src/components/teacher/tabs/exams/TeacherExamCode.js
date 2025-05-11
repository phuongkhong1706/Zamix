import React, { useState } from "react";
import LatexInputKaTeX, { renderWithLatex } from "./LatexInputKaTeX.js";
import { v4 as uuidv4 } from "uuid";

import "../../../../styles/SidebarNavigation.css";
import "../../../../styles/exam-teacher/TeacherExamCode.css";
import iconAddQuestion from "../../../../assets/icon/icon-add.png";
import iconCancelQuestion from "../../../../assets/icon/icon-cancel.png";
import iconCorrect from "../../../../assets/icon/icon-correct.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";

function TeacherExamCode() {
  const [examData, setExamData] = useState({
    exam_title: "",
    exam_code: "",
    exam_type: "",
    grade: "",
    start_time: "",
    duration: "",
  });

  const [newQuestions, setNewQuestions] = useState([]);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

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
            value={examData.exam_code}
            onChange={(e) => setExamData({ ...examData, exam_code: e.target.value })}
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
        <div className="exam-form-title">Thông tin kỳ thi</div>

        {/* Các trường thông tin kỳ thi */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Tên kỳ thi</label>
            <input
              type="text"
              className="exam-form-input"
              value={examData.exam_title}
              onChange={(e) => setExamData({ ...examData, exam_title: e.target.value })}
            />
          </div>
        </div>

        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Loại kỳ thi</label>
            <select
              className="exam-form-select"
              value={examData.exam_type}
              onChange={(e) => setExamData({ ...examData, exam_type: e.target.value })}
            >
              <option value="">-- Chọn loại --</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </select>
          </div>

          <div className="exam-form-group">
            <label className="exam-form-label">Khối</label>
            <select
              className="exam-form-select"
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
              value={examData.duration}
              onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
              min="1"
              placeholder="Nhập số phút"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherExamCode;